(function () {
  'use strict';

  if (window.kinogoua_lampa_plugin) return;
  window.kinogoua_lampa_plugin = true;

  // The API is inferred from the plugin URL. A manual value is useful only
  // when static files and API are intentionally hosted on different domains.
  // window.KinogoUAPluginConfig = { api: 'https://api.example.org' };
  var scriptUrl = document.currentScript && document.currentScript.src;
  var inferredApi = scriptUrl && scriptUrl.replace(/\/kinogoua\.lampa\.js(?:[?#].*)?$/, '');
  var API = ((window.KinogoUAPluginConfig && window.KinogoUAPluginConfig.api) || inferredApi || 'http://127.0.0.1:8787').replace(/\/$/, '');

  function request(path, success, failure) {
    var network = new Lampa.Reguest();
    network.timeout(15000);
    network.silent(API + path, success, function (error) {
      failure((error && error.status) ? 'Сервер недоступен (' + error.status + ')' : 'Сервер недоступен');
    }, false, { dataType: 'json' });
  }

  function play(item, items) {
    var playlist = items.map(function (entry) {
      return {
        title: entry.title,
        url: entry.url,
        season: entry.season,
        episode: entry.episode,
        subtitles: entry.subtitles,
        duration: entry.duration
      };
    });
    var element = playlist[items.indexOf(item)];
    element.isonline = true;
    if (playlist.length > 1) element.playlist = playlist;
    Lampa.Player.play(element);
    Lampa.Player.playlist(playlist);
  }

  function showEpisodes(season, onBack) {
    Lampa.Select.show({
      title: 'Сезон ' + season.season,
      items: season.episodes.map(function (episode) {
        return { title: 'Серия ' + episode.episode + ' — ' + episode.title, episode: episode };
      }),
      onBack: onBack,
      onSelect: function (selected) { play(selected.episode, season.episodes); }
    });
  }

  function showContent(content) {
    if (content.kind === 'series') {
      return Lampa.Select.show({
        title: content.title,
        items: content.seasons.map(function (season) {
          return { title: 'Сезон ' + season.season + ' (' + season.episodes.length + ')', season: season };
        }),
        onSelect: function (selected) { showEpisodes(selected.season, function () { showContent(content); }); }
      });
    }
    play(content.episodes[0], content.episodes);
  }

  function loadContent(result) {
    Lampa.Loading.start(function () {});
    request('/v1/content?url=' + encodeURIComponent(result.url), function (content) {
      Lampa.Loading.stop();
      if (!content || !content.kind) return Lampa.Noty.show((content && content.error) || 'Плеер не найден');
      showContent(content);
    }, function (message) {
      Lampa.Loading.stop();
      Lampa.Noty.show(message);
    });
  }

  function search(movie) {
    var title = movie.name || movie.title || movie.original_name || movie.original_title;
    if (!title) return Lampa.Noty.show('Не удалось определить название');
    Lampa.Loading.start(function () {});
    request('/v1/search?q=' + encodeURIComponent(title), function (response) {
      Lampa.Loading.stop();
      if (!response || !response.results || !response.results.length) return Lampa.Noty.show('Ничего не найдено');
      Lampa.Select.show({
        title: 'KinogoUA: ' + title,
        items: response.results.map(function (result) {
          return { title: result.title, subtitle: result.year || '', result: result };
        }),
        onSelect: function (selected) { loadContent(selected.result); }
      });
    }, function (message) {
      Lampa.Loading.stop();
      Lampa.Noty.show(message);
    });
  }

  function addButton(event) {
    if (event.render.find('.kinogoua--button').length) return;
    var button = $('<div class="full-start__button selector view--online kinogoua--button">'
      + '<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
      + '<span>KinogoUA</span></div>');
    button.on('hover:enter', function () { search(event.movie); });
    event.render.after(button);
  }

  Lampa.Manifest.plugins = {
    type: 'video',
    version: '0.1.0',
    name: 'KinogoUA',
    description: 'Поиск и просмотр через локальный сервер KinogoUA',
    component: 'kinogoua'
  };
  Lampa.Listener.follow('full', function (event) {
    if (event.type === 'complite') addButton({ render: event.object.activity.render().find('.view--torrent'), movie: event.data.movie });
  });
  try {
    if (Lampa.Activity.active().component === 'full') {
      addButton({ render: Lampa.Activity.active().activity.render().find('.view--torrent'), movie: Lampa.Activity.active().card });
    }
  } catch (error) {}
}());
