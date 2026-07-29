(function () {
    'use strict';

    // 1. Сетевая подстраховка: отдаем пустой валидный VAST XML, если плеер все же сделает запрос
    const EMPTY_VAST = '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"></VAST>';

    if (window.XMLHttpRequest) {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url) {
            const urlStr = typeof url === 'string' ? url : '';
            
            // Исключаем служебные домены BWA и проверяем VAST с косыми чертами (/ad/)
            const isBwa = urlStr.includes('bwa.ad');
            this._isVast = !isBwa && (
                urlStr.includes('vast') || 
                urlStr.includes('/ad/') || 
                urlStr.includes('adserver')
            );

            return origOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function () {
            if (this._isVast) {
                console.log("[AdBlock] Перехвачен фоновый VAST XHR, отдаем пустой XML");
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
    }

    // 2. Мягкая очистка VAST-полей без разрушения структуры объекта
    function processVideoItem(file) {
        if (!file || typeof file !== 'object') return;

        // Мягко обнуляем VAST-параметры (без delete)
        if ('vast_url' in file) file.vast_url = '';
        if ('vast_msg' in file) file.vast_msg = '';
        if ('vast_region' in file) file.vast_region = '';
        if ('vast_platform' in file) file.vast_platform = '';
        if ('vast_screen' in file) file.vast_screen = '';

        // Если это плейлист (список серий) — мягко очищаем каждый элемент
        if (Array.isArray(file.playlist)) {
            file.playlist.forEach(processVideoItem);
        }

        // Переводим на HTTPS ТОЛЬКО если сама Lampa загружена по HTTPS
        const isHttpsPage = window.location.protocol === 'https:';

        if (isHttpsPage) {
            if (file.url && typeof file.url === 'string' && file.url.startsWith('http://')) {
                file.url = file.url.replace('http://', 'https://');
                console.log("[AdBlock] Ссылка переведена на HTTPS:", file.url);
            }

            if (file.quality && typeof file.quality === 'object') {
                for (let q in file.quality) {
                    if (typeof file.quality[q] === 'string' && file.quality[q].startsWith('http://')) {
                        file.quality[q] = file.quality[q].replace('http://', 'https://');
                    }
                }
            }
        }
    }

    // 3. Перехват Lampa.Player.play
    function initAdBlock() {
        if (!window.Lampa || !window.Lampa.Player) {
            setTimeout(initAdBlock, 100);
            return;
        }

        let originalPlay = Lampa.Player.play;

        Lampa.Player.play = function (item) {
            if (item) {
                if (Array.isArray(item)) {
                    item.forEach(processVideoItem);
                } else {
                    processVideoItem(item);
                }
            }

            return originalPlay.apply(this, arguments);
        };

        console.log("[AdBlock] Модуль с мягкой очисткой VAST запущен");
    }

    initAdBlock();
})();
