// External 3rd party scripts
(function loadScript(doc, script) {
  var js;
  var fjs = doc.getElementsByTagName(script)[0];
  var add = function add(url, ID, onload) {
    var id = ID;
    if (doc.getElementById(id)) {return;}
    js = doc.createElement(script);
    js.src = url;
    if (id) {
      js.id = id;
    }
    if (onload) {
      js.onload = onload;
    }
    fjs.parentNode.insertBefore(js, fjs);
  };

  // Twitter SDK
  add('https://platform.twitter.com/widgets.js', 'twitter-wjs');
  add(
    'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
    false,
    function app() {
      'use strict';
      var $ = window.jQuery;
      var orgName = 'VerbalExpressions';
      var $body = $('body');

      // Put custom repo URL's in this object, keyed by repo name.
      var repoUrls = {
        'verbalexpressions.github.io': 'https://verbalexpressions.github.io/',
      };

      // Put custom repo descriptions in this object, keyed by repo name.
      var repoDescriptions = {};

      // Return the repo url
      function getRepoUrl(repo) {
        return repoUrls[repo.name] || repo.html_url;
      }

      // Return the repo description
      function getRepoDesc(repo) {
        return repoDescriptions[repo.name] || repo.description;
      }

      // Relative times
      function prettyDate(rawdate) {
        var date;
        var seconds;
        var formats;
        var i = 0;
        var f;
        date = new Date(rawdate);
        seconds = (new Date() - date) / 1000;
        formats = [
          [60, 'seconds', 1],
          [120, '1 minute ago'],
          [3600, 'minutes', 60],
          [7200, '1 hour ago'],
          [86400, 'hours', 3600],
          [172800, 'yesterday'],
          [604800, 'days', 86400],
          [1209600, '1 week ago'],
          [2678400, 'weeks', 604800],
        ];

        for (i = 0; i < formats.length; i++) {
          f = formats[i];
          if (seconds < f[0]) {
            return f[2] ? Math.floor(seconds / f[2]) + ' ' + f[1] + ' ago' : f[1];
          }
        }
        return 'a while ago';
      }

      // Create an entry for the repo in the grid of org repos
      function showRepo(repo) {
        var $item = $('.unit-1-3.repo[data-repo-name="' + repo.name + '"]');
        var alreadyThere = $item.length >= 1;
        if (!alreadyThere) {
          $item = $(
            '<div class="unit-1-3 repo">' +
              '<a class="box" href="">' +
                '<h2 class="repo__name"></h2>' +
                '<p class="repo__info">' +
                  '<span class="repo__watchers"></span>' +
                  ' stargazers &middot; ' +
                  '<span class="repo__language"></span>' +
                  '<span class="repo__updated">&nbsp;</span>' +
                '</p>' +
                '<p class="repo__desc"></p>' +
              '</a>' +
            '</div>'
          );
          $item.attr('data-repo-name', repo.name);
        }

        $item.children('a').attr('href', getRepoUrl(repo));
        $item.find('.repo__name').text(repo.name);
        $item.find('.repo__watchers').text(repo.watchers);
        $item.find('.repo__language').text(repo.language);
        $item.find('.repo__desc').text(getRepoDesc(repo));

        // don't display this when we build the html snapshot
        if ($body.attr('data-prerendered') === 'data-prerendered') {
          $item.find('.repo__updated').text(
            'Updated ' +
            prettyDate(repo.pushed_at)
          );
        }

        if (!alreadyThere) {
          $item.appendTo('#repos');
        }
      }

      $.ajax({
        dataType: 'json',
        url: 'https://api.github.com/orgs/' + orgName + '/repos?per_page=100',
        success: function success(result) {
          var repos = result;
          $(function why() {
            $('#num-repos').text(repos.length);

            // Convert pushed_at to Date.
            $.each(repos, function feRepo(i, REPO) {
              var repo = REPO;
              repo.pushed_at = new Date(repo.pushed_at);
            });

            // Sort by most-recently pushed to.
            repos.sort(function sortReposAgain(a, b) {
              if (a.pushed_at < b.pushed_at) return 1;
              if (b.pushed_at < a.pushed_at) return -1;
              return 0;
            });

            $.each(repos, function feSortedRepo(i, repo) {
              showRepo(repo);
            });
          });
        },
      });

      $.ajax({
        dataType: 'json',
        url: 'https://api.github.com/orgs/' + orgName + '/members',
        success: function success(result) {
          $(function why() {
            $('#num-members').text(result.length);
          });
        },
      });

      $('#year').html((new Date()).getFullYear());
    }
  );
}(document, 'script'));
