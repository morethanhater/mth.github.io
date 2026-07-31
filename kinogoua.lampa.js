(function () {
  'use strict';

  if (window.kinogoua_lampa_plugin) return;
  window.kinogoua_lampa_plugin = true;

  var scriptUrl = document.currentScript && document.currentScript.src;
  var inferredApi = scriptUrl && scriptUrl.replace(/\/kinogoua\.lampa\.js(?:[?#].*)?$/, '');
  var DEFAULT_API = 'https://mth-video-service.shares.zrok.io';
  var API = ((window.KinogoUAPluginConfig && window.KinogoUAPluginConfig.api) || DEFAULT_API || inferredApi || 'http://127.0.0.1:8787').replace(/\/$/, '');

  function resetTemplates() {
    if ($('#kinogoua_css').length) return;

    var css = '<style id="kinogoua_css">'
      + '.online-prestige{position:relative;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;background-color:rgba(255,255,255,0.05);padding:1.2em;-webkit-border-radius:0.5em;border-radius:0.5em;margin-bottom:0.8em;cursor:pointer}'
      + '.online-prestige.focus{background-color:rgba(255,255,255,0.18)}'
      + '.online-prestige.focus::after{content:"";position:absolute;top:-0.2em;left:-0.2em;right:-0.2em;bottom:-0.2em;-webkit-border-radius:0.7em;border-radius:0.7em;border:solid 0.25em #fff;z-index:2;pointer-events:none}'
      + '.online-prestige__folder{width:3.5em;height:3em;margin-right:1.2em;display:flex;align-items:center;justify-content:center;flex-shrink:0}'
      + '.online-prestige__folder svg{width:100%;height:100%}'
      + '.online-prestige__body{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;overflow:hidden}'
      + '.online-prestige__head{display:flex;align-items:center;justify-content:space-between}'
      + '.online-prestige__title{font-size:1.2em;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.online-prestige__time{font-size:0.9em;opacity:0.6;margin-left:1em;white-space:nowrap}'
      + '.online-prestige__footer{display:flex;align-items:center;justify-content:space-between;margin-top:0.4em}'
      + '.online-prestige__info{font-size:0.9em;opacity:0.7}'
      + '.online-prestige__quality{font-size:0.8em;padding:0.2em 0.5em;background:rgba(255,255,255,0.15);border-radius:0.3em;font-weight:600}'
      + '.kinogoua-watched{opacity:0.5}'
      + '.kinogoua-watched .online-prestige__title::before{content:"✓ ";color:#28a745;font-weight:bold}'
      + '.kinogoua-seasons-bar{display:flex;flex-wrap:wrap;gap:0.6em;margin-bottom:1.2em;padding-bottom:0.8em;border-bottom:1px solid rgba(255,255,255,0.1)}'
      + '.kinogoua-season-btn{padding:0.6em 1.2em;background:rgba(255,255,255,0.08);border-radius:0.4em;font-size:1.1em;font-weight:500;cursor:pointer;white-space:nowrap}'
      + '.kinogoua-season-btn.active{background:rgba(255,255,255,0.25);color:#fff}'
      + '.kinogoua-season-btn.focus{background:#fff;color:#000}'
      + '.online-empty{line-height:1.4;padding:2em;text-align:center}'
      + '.online-empty__title{font-size:1.6em;margin-bottom:0.4em}'
      + '.online-empty__time{font-size:1.1em;opacity:0.6;margin-bottom:1.5em}'
      + '.online-empty-template{background-color:rgba(255,255,255,0.05);padding:1em;display:flex;align-items:center;border-radius:0.4em;margin-bottom:0.8em}'
      + '.online-empty-template__ico{width:3em;height:3em;background:rgba(255,255,255,0.1);border-radius:0.3em;margin-right:1.2em}'
      + '.online-empty-template__body{height:1.4em;width:60%;background:rgba(255,255,255,0.1);border-radius:0.3em}'
      + '</style>';

    $('body').append(css);

    Lampa.Template.add('kinogoua_prestige_full',
      '<div class="online-prestige online-prestige--full selector">'
      + '<div class="online-prestige__body">'
      + '<div class="online-prestige__head">'
      + '<div class="online-prestige__title">{title}</div>'
      + '<div class="online-prestige__time">{time}</div>'
      + '</div>'
      + '<div class="online-prestige__footer">'
      + '<div class="online-prestige__info">{info}</div>'
      + '<div class="online-prestige__quality">{quality}</div>'
      + '</div>'
      + '</div>'
      + '</div>'
    );

    Lampa.Template.add('kinogoua_prestige_folder',
      '<div class="online-prestige online-prestige--folder selector">'
      + '<div class="online-prestige__folder">'
      + '<svg viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<rect y="20" width="128" height="92" rx="13" fill="white"></rect>'
      + '<path d="M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z" fill="white" fill-opacity="0.23"></path>'
      + '<rect x="11" y="8" width="106" height="76" rx="13" fill="white" fill-opacity="0.51"></rect>'
      + '</svg>'
      + '</div>'
      + '<div class="online-prestige__body">'
      + '<div class="online-prestige__head">'
      + '<div class="online-prestige__title">{title}</div>'
      + '<div class="online-prestige__time">{time}</div>'
      + '</div>'
      + '<div class="online-prestige__footer">'
      + '<div class="online-prestige__info">{info}</div>'
      + '</div>'
      + '</div>'
      + '</div>'
    );

    Lampa.Template.add('kinogoua_content_loading',
      '<div class="online-empty">'
      + '<div class="broadcast__scan"><div></div></div>'
      + '<div class="online-empty__templates" style="margin-top:2em">'
      + '<div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div>'
      + '<div class="online-empty-template" style="opacity:0.6"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div>'
      + '<div class="online-empty-template" style="opacity:0.3"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div>'
      + '</div>'
      + '</div>'
    );

    Lampa.Template.add('kinogoua_does_not_answer',
      '<div class="online-empty">'
      + '<div class="online-empty__title">{title}</div>'
      + '<div class="online-empty__time">{time}</div>'
      + '</div>'
    );
  }

  function KinogoUAComponent(object) {
    var network = new Lampa.Reguest();
    network.timeout(15000);

    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);

    var initialized = false;
    var last_focused = false;

    var search_results = [];
    var loaded_content = null;
    var selected_season_index = 0;

    this.activity = object.activity;

    function getMovieHash() {
      return Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
    }

    function clarificationAdd(value) {
      var id = getMovieHash();
      var all = Lampa.Storage.get('clarification_search', '{}');
      all[id] = value;
      Lampa.Storage.set('clarification_search', all);
    }

    function clarificationDelete() {
      var id = getMovieHash();
      var all = Lampa.Storage.get('clarification_search', '{}');
      delete all[id];
      Lampa.Storage.set('clarification_search', all);
    }

    function apiRequest(path, success, failure) {
      network.clear();
      network.silent(API + path, success, function (error) {
        failure((error && error.status) ? 'Сервер недоступен (' + error.status + ')' : 'Сервер недоступен');
      }, false, {
        dataType: 'json',
        headers: { 'skip_zrok_interstitial': '1' }
      });
    }

    this.isActive = function () {
      return !this.activity || (Lampa.Activity.active() && Lampa.Activity.active().activity === this.activity);
    };

    this.initialize = function () {
      var _this = this;

      filter.onSearch = function (value) {
        clarificationAdd(value);
        object.search = value;
        _this.startSearch(value);
      };

      filter.onBack = function () {
        _this.start();
      };

      filter.onSelect = function (type, a, b) {
        if (type === 'filter') {
          if (a.reset) {
            clarificationDelete();
            object.search = object.movie.title || object.movie.name;
            _this.startSearch(object.search);
            setTimeout(Lampa.Select.close, 10);
          } else if (a.stype === 'season' && loaded_content && loaded_content.seasons) {
            selected_season_index = b.index;
            _this.renderEpisodesForSeason(selected_season_index);
            setTimeout(Lampa.Select.close, 10);
          }
        } else if (type === 'sort') {
          setTimeout(Lampa.Select.close, 10);
        }
      };

      if (filter.addButtonBack) filter.addButtonBack();

      filter.render().find('.filter--search').appendTo(filter.render().find('.torrent-filter'));
      filter.render().find('.filter--sort span').text('Источник');
      filter.set('sort', [{ title: 'KinogoUA', source: 'kinogoua', selected: true }]);
      filter.chosen('sort', ['KinogoUA']);

      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.minus(files.render().find('.explorer__files-head'));

      var initialSearch = object.search || object.movie.title || object.movie.name || object.movie.original_title || object.movie.original_name;
      this.startSearch(initialSearch);
    };

    this.loading = function (status) {
      if (status) {
        if (this.activity && this.activity.loader) this.activity.loader(true);
        scroll.clear();
        scroll.append(Lampa.Template.get('kinogoua_content_loading', {}));
      } else {
        if (this.activity && this.activity.loader) {
          this.activity.loader(false);
          this.activity.toggle();
        }
      }
    };

    this.empty = function (message) {
      this.loading(false);
      scroll.clear();
      var emptyEl = Lampa.Template.get('kinogoua_does_not_answer', {
        title: 'KinogoUA',
        time: message || 'Ничего не найдено'
      });
      scroll.append(emptyEl);
      this.enableController();
    };

    this.startSearch = function (query) {
      var _this = this;
      if (!query) return this.empty('Не указано название для поиска');

      this.loading(true);
      apiRequest('/v1/search?q=' + encodeURIComponent(query), function (response) {
        if (!_this.isActive()) return;
        if (!response || !response.results || !response.results.length) {
          return _this.empty('Ничего не найдено по запросу: ' + query);
        }

        search_results = response.results;

        // Find best match by year if available
        var targetYear = (object.movie.year || (object.movie.first_air_date ? object.movie.first_air_date.substr(0, 4) : '')) + '';
        var matchedResult = null;

        if (search_results.length === 1) {
          matchedResult = search_results[0];
        } else if (targetYear) {
          matchedResult = search_results.find(function (r) {
            return r.year && String(r.year) === targetYear;
          });
        }

        if (matchedResult) {
          _this.loadContent(matchedResult.url);
        } else {
          _this.renderSearchResults(search_results);
        }
      }, function (err) {
        if (!_this.isActive()) return;
        _this.empty(err);
      });
    };

    this.renderSearchResults = function (results) {
      var _this = this;
      this.loading(false);
      scroll.clear();

      filter.set('filter', [{ title: 'Сбросить поиск', reset: true }]);
      filter.chosen('filter', []);

      results.forEach(function (result) {
        var item = Lampa.Template.get('kinogoua_prestige_folder', {
          title: result.title,
          time: result.year ? String(result.year) : '',
          info: 'KinogoUA'
        });

        item.on('hover:enter', function () {
          last_focused = item[0];
          _this.loadContent(result.url);
        });

        scroll.append(item);
      });

      this.enableController();
    };

    this.loadContent = function (url) {
      var _this = this;
      this.loading(true);

      apiRequest('/v1/content?url=' + encodeURIComponent(url), function (content) {
        if (!_this.isActive()) return;
        if (!content || !content.kind) {
          return _this.empty((content && content.error) || 'Не удалось загрузить данные источника');
        }

        loaded_content = content;
        selected_season_index = 0;
        _this.renderContent(content);
      }, function (err) {
        if (!_this.isActive()) return;
        _this.empty(err);
      });
    };

    this.renderContent = function (content) {
      if (content.kind === 'series') {
        this.renderEpisodesForSeason(selected_season_index);
      } else {
        this.renderMovieEpisodes(content.episodes || []);
      }
    };

    this.updateFilterHeader = function () {
      var filter_items = [];

      if (loaded_content && loaded_content.kind === 'series' && loaded_content.seasons && loaded_content.seasons.length > 0) {
        var seasonItems = loaded_content.seasons.map(function (s, idx) {
          return {
            title: s.season + ' сезон',
            selected: idx === selected_season_index,
            index: idx
          };
        });

        filter_items.push({
          title: 'Сезон',
          stype: 'season',
          items: seasonItems
        });
      }

      filter_items.push({
        title: 'Сбросить поиск',
        reset: true
      });

      filter.set('filter', filter_items);

      var chosenText = [];
      if (loaded_content && loaded_content.kind === 'series' && loaded_content.seasons && loaded_content.seasons[selected_season_index]) {
        chosenText.push('Сезон: ' + loaded_content.seasons[selected_season_index].season + ' сезон');
      }
      filter.chosen('filter', chosenText);
    };

    this.renderEpisodesForSeason = function (seasonIndex) {
      var _this = this;
      this.loading(false);
      scroll.clear();

      if (!loaded_content || !loaded_content.seasons || !loaded_content.seasons[seasonIndex]) {
        return this.empty('Сезон не найден');
      }

      selected_season_index = seasonIndex;
      var season = loaded_content.seasons[seasonIndex];

      this.updateFilterHeader();

      // Render season bar if multiple seasons
      if (loaded_content.seasons.length > 1) {
        var seasonsBar = $('<div class="kinogoua-seasons-bar"></div>');
        loaded_content.seasons.forEach(function (s, idx) {
          var btn = $('<div class="kinogoua-season-btn selector' + (idx === seasonIndex ? ' active' : '') + '">' + s.season + ' сезон</div>');
          btn.on('hover:enter', function () {
            last_focused = btn[0];
            selected_season_index = idx;
            _this.renderEpisodesForSeason(idx);
          });
          seasonsBar.append(btn);
        });
        scroll.append(seasonsBar);
      }

      var watched = Lampa.Storage.cache('online_view', 5000, []);

      (season.episodes || []).forEach(function (episode) {
        var epTitle = 'Серия ' + episode.episode + (episode.title ? ' — ' + episode.title : '');
        var epKey = (loaded_content.title || object.movie.title) + '_s' + season.season + '_e' + episode.episode;
        var isWatched = watched.indexOf(epKey) !== -1;

        var item = Lampa.Template.get('kinogoua_prestige_full', {
          title: epTitle,
          time: episode.duration ? Math.round(episode.duration / 60) + ' мин' : '',
          info: (loaded_content.title || object.movie.title) + ' — ' + season.season + ' сезон',
          quality: 'HLS'
        });

        if (isWatched) item.addClass('kinogoua-watched');

        item.on('hover:enter', function () {
          last_focused = item[0];
          _this.play(episode, season.episodes, epKey);
        });

        scroll.append(item);
      });

      this.enableController();
    };

    this.renderMovieEpisodes = function (episodes) {
      var _this = this;
      this.loading(false);
      scroll.clear();

      this.updateFilterHeader();

      var watched = Lampa.Storage.cache('online_view', 5000, []);

      (episodes || []).forEach(function (episode) {
        var epTitle = loaded_content.title || episode.title || 'Смотреть фильм';
        var epKey = (loaded_content.title || object.movie.title) + '_movie';
        var isWatched = watched.indexOf(epKey) !== -1;

        var item = Lampa.Template.get('kinogoua_prestige_full', {
          title: epTitle,
          time: episode.duration ? Math.round(episode.duration / 60) + ' мин' : '',
          info: 'Фильм (HLS)',
          quality: 'HLS'
        });

        if (isWatched) item.addClass('kinogoua-watched');

        item.on('hover:enter', function () {
          last_focused = item[0];
          _this.play(episode, episodes, epKey);
        });

        scroll.append(item);
      });

      this.enableController();
    };

    this.play = function (item, items, watchKey) {
      if (watchKey) {
        var watched = Lampa.Storage.cache('online_view', 5000, []);
        if (watched.indexOf(watchKey) === -1) {
          watched.push(watchKey);
          Lampa.Storage.set('online_view', watched);
        }
      }

      var playlist = (items || []).map(function (entry) {
        return {
          title: entry.title ? ('Серия ' + entry.episode + ' — ' + entry.title) : ('Серия ' + entry.episode),
          url: entry.url,
          season: entry.season,
          episode: entry.episode,
          subtitles: entry.subtitles,
          duration: entry.duration
        };
      });

      var target = playlist[items.indexOf(item)] || {
        title: item.title,
        url: item.url,
        season: item.season,
        episode: item.episode,
        subtitles: item.subtitles,
        duration: item.duration
      };

      target.isonline = true;
      if (playlist.length > 1) target.playlist = playlist;

      Lampa.Player.play(target);
      Lampa.Player.playlist(playlist);
    };

    this.enableController = function () {
      var _this = this;
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last_focused || false, scroll.render());
        },
        up: function up() {
          if (Lampa.Navigator.canmove('up')) {
            Lampa.Navigator.move('up');
          } else {
            Lampa.Controller.toggle('head');
          }
        },
        down: function down() {
          Lampa.Navigator.move('down');
        },
        right: function right() {
          if (Lampa.Navigator.canmove('right')) {
            Lampa.Navigator.move('right');
          } else {
            filter.show('Фильтр', 'filter');
          }
        },
        left: function left() {
          if (Lampa.Navigator.canmove('left')) {
            Lampa.Navigator.move('left');
          } else {
            Lampa.Controller.toggle('menu');
          }
        },
        back: function back() {
          _this.back();
        }
      });
      Lampa.Controller.toggle('content');
    };

    this.create = function () {
      return this.render();
    };

    this.start = function () {
      if (this.activity && Lampa.Activity.active().activity !== this.activity) return;
      if (!initialized) {
        initialized = true;
        this.initialize();
      } else {
        this.enableController();
      }
    };

    this.render = function () {
      return files.render();
    };

    this.back = function () {
      if (search_results && search_results.length > 1) {
        last_focused = false;
        this.renderSearchResults(search_results);
      } else {
        Lampa.Activity.backward();
      }
    };

    this.pause = function () {};
    this.stop = function () {};

    this.destroy = function () {
      network.clear();
      files.destroy();
      scroll.destroy();
    };
  }

  function addButton(event) {
    if (event.render.find('.kinogoua--button').length) return;

    var button = $('<div class="full-start__button selector view--online kinogoua--button">'
      + '<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
      + '<span>KinogoUA</span></div>');

    button.on('hover:enter', function () {
      resetTemplates();
      Lampa.Component.add('kinogoua', KinogoUAComponent);

      var title = event.movie.title || event.movie.name || event.movie.original_title || event.movie.original_name;
      var id = Lampa.Utils.hash(event.movie.number_of_seasons ? event.movie.original_name : event.movie.original_title);
      var all = Lampa.Storage.get('clarification_search', '{}');

      Lampa.Activity.push({
        url: '',
        title: 'KinogoUA',
        component: 'kinogoua',
        search: all[id] ? all[id] : title,
        movie: event.movie,
        page: 1
      });
    });

    event.render.after(button);
  }

  Lampa.Manifest.plugins = {
    type: 'video',
    version: '0.2.0',
    name: 'KinogoUA',
    description: 'Поиск и просмотр KinogoUA с интерфейсом Activity Lampa',
    component: 'kinogoua'
  };

  Lampa.Listener.follow('full', function (event) {
    if (event.type === 'complite') {
      addButton({
        render: event.object.activity.render().find('.view--torrent'),
        movie: event.data.movie
      });
    }
  });

  try {
    if (Lampa.Activity.active().component === 'full') {
      addButton({
        render: Lampa.Activity.active().activity.render().find('.view--torrent'),
        movie: Lampa.Activity.active().card
      });
    }
  } catch (error) {}
}());
