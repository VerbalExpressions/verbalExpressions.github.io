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
  add('http://platform.twitter.com/widgets.js', 'twitter-wjs');
  add(
    'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
    false,
    function app() {
      'use strict';
      var $ = window.jQuery;
      var orgName = 'VerbalExpressions';

      // Put custom repo URL's in this object, keyed by repo name.
      var repoUrls = {
        // 'html5-boilerplate': 'http://html5boilerplate.com/'
        'verbalexpressions.github.io': 'http://verbalexpressions.github.io/',
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
          [172800, 'Yesterday'],
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
        return 'A while ago';
      }

      // Display a repo's overview (for recent updates section)
      function showRepoOverview(repo) {
        var item = (
          '<li>' +
            '<span class="name"><a href="' + repo.html_url + '">' +
              repo.name +
            '</a></span>' +
            ' &middot; ' +
            '<span class="time"><a href="' + repo.html_url + '/commits">' +
              prettyDate(repo.pushed_at) +
            '</a></span>' +
          '</li>'
        );

        $(item).appendTo('#updated-repos');
      }

      // Create an entry for the repo in the grid of org repos
      function showRepo(repo) {
        var $item = $('<div class="unit-1-3 repo" />');
        var $link = $('<a class="box" href="' + getRepoUrl(repo) + '" />');

        $link.append('<h2 class="repo__name">' + repo.name + '</h2>');
        $link.append(
          '<p class="repo__info">' +
            repo.watchers +
            ' stargazers &middot; ' +
            repo.language +
          '</p>'
        );
        $link.append('<p class="repo__desc">' + getRepoDesc(repo) + '</p>');

        $link.appendTo($item);
        $item.appendTo('#repos');
      }

      $.ajax({
        dataType: 'json',
        url: 'https://api.github.com/orgs/' + orgName + '/repos?per_page=100',
        headers: {
          // "Authorization": "Basic " + btoa(username + ":" + password)
        },
        success: function success(result) {
          var repos = result;
          $(function why() {
            $('#num-repos').text(repos.length);

            // Convert pushed_at to Date.
            $.each(repos, function feRepo(i, REPO) {
              var repo = REPO;
              var weekHalfLife = 1.146 * Math.pow(10, -9);
              var pushDelta;
              var createdDelta = (new Date()) - Date.parse(repo.created_at);
              var weightForPush = 1;
              var weightForWatchers = 1.314 * Math.pow(10, 7);

              repo.pushed_at = new Date(repo.pushed_at);
              pushDelta = (new Date()) - Date.parse(repo.pushed_at);
              repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
              repo.hotness += weightForWatchers * repo.watchers / createdDelta;
            });

            // Sort by hotness.
            repos.sort(function sortRepos(a, b) {
              if (a.hotness < b.hotness) return 1;
              if (b.hotness < a.hotness) return -1;
              return 0;
            });

            $.each(repos, function feSortedRepo(i, repo) {
              showRepo(repo);
            });

            // Sort by most-recently pushed to.
            repos.sort(function sortReposAgain(a, b) {
              if (a.pushed_at < b.pushed_at) return 1;
              if (b.pushed_at < a.pushed_at) return -1;
              return 0;
            });

            $.each(repos.slice(0, 3), function feSlicedRepos(i, repo) {
              showRepoOverview(repo);
            });
          });
        },
      });

      $.ajax({
        dataType: 'json',
        url: 'https://api.github.com/orgs/' + orgName + '/members',
        headers: {
          // "Authorization": "Basic " + btoa(username + ":" + password)
        },
        success: function success(result) {
          var members = result;
          $(function why() {
            $('#num-members').text(members.length);
          });
        },
      });

      $('#year').html((new Date()).getFullYear());
    }
  );
}(document, 'script'));
