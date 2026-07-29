(function () {
    'use strict';
    console.log("[AdBlock] Скрипт очистки VAST запущен");

    // 1. Подменяем Lampa.Player.play, чтобы перед запуском вычищать рекламные ссылки из объекта элемента
    let originalPlay = Lampa.Player.play;

    Lampa.Player.play = function (item) {
        if (item) {
            // Если передан одиночный объект или массив
            let items = Array.isArray(item) ? item : [item];
            
            items.forEach(file => {
                if (file.vast_url) {
                    console.log("[AdBlock] Удалена VAST ссылка:", file.vast_url);
                    delete file.vast_url;
                    delete file.vast_msg;
                    delete file.vast_region;
                    delete file.vast_platform;
                    delete file.vast_screen;
                }
            });
        }

        // Вызываем оригинальный плеер уже с "чистым" объектом
        return originalPlay.apply(this, arguments);
    };

    // 2. Блокировка фонового RCH (если нужно отключить фоновый eval и проксирование)
    if (window.WebSocket) {
        let OrigWS = window.WebSocket;
        window.WebSocket = function (url, protocols) {
            if (typeof url === 'string' && url.includes('z01.online')) {
                console.log("[AdBlock] Заблокировано WebSocket-подключение RCH к z01");
                return {}; // Возвращаем пустышку
            }
            return new OrigWS(url, protocols);
        };
    }
})();
