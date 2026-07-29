(function () {
    'use strict';
    console.log("[AdBlock] Запущен безопасный обход VAST");

    // Пустой валидный VAST-документ (0 рекламных роликов)
    const EMPTY_VAST = '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"></VAST>';

    // 1. Перехватываем XMLHttpRequest (для VAST-запросов)
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._isVast = typeof url === 'string' && (url.includes('vast') || url.includes('ad/'));
        return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (this._isVast) {
            console.log("[AdBlock] Перехвачен VAST XHR, отдаем пустой ответ");
            
            Object.defineProperty(this, 'responseText', { value: EMPTY_VAST, writable: false });
            Object.defineProperty(this, 'response', { value: EMPTY_VAST, writable: false });
            Object.defineProperty(this, 'status', { value: 200, writable: false });
            Object.defineProperty(this, 'readyState', { value: 4, writable: false });

            setTimeout(() => {
                if (typeof this.onreadystatechange === 'function') this.onreadystatechange();
                if (typeof this.onload === 'function') this.onload();
            }, 5);

            return;
        }
        return origSend.apply(this, arguments);
    };

    // 2. Перехватываем fetch (если Lampa или плагин использует его)
    if (window.fetch) {
        const origFetch = window.fetch;
        window.fetch = function (input, init) {
            let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            if (url && (url.includes('vast') || url.includes('ad/'))) {
                console.log("[AdBlock] Перехвачен VAST Fetch, отдаем пустой ответ");
                return Promise.resolve(new Response(EMPTY_VAST, {
                    status: 200,
                    headers: { 'Content-Type': 'text/xml' }
                }));
            }
            return origFetch.apply(this, arguments);
        };
    }

    // 3. Мягко очищаем vast_url в объекте проигрывателя (без delete)
    function patchLampa() {
        if (window.Lampa && window.Lampa.Player) {
            let origPlay = Lampa.Player.play;
            Lampa.Player.play = function (item) {
                if (item) {
                    let items = Array.isArray(item) ? item : [item];
                    items.forEach(file => {
                        if (file && file.vast_url) {
                            // Оставляем пустым, чтобы плеер корректно пропустил этап
                            file.vast_url = ''; 
                        }
                    });
                }
                return origPlay.apply(this, arguments);
            };
        } else {
            setTimeout(patchLampa, 200);
        }
    }

    patchLampa();
})();
