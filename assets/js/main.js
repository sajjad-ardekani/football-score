function init() {
  initialState();
  componentMount();
}

function initialState() {
  persianDate.toCalendar('gregorian');
  persianDate.toLocale('en');
  window.state = {};
  window.state.data = {};
  window.state.liveData = false;
  window.state.loading = true;
  window.state.rendered = false;
  window.state.date = new persianDate();
  window.state.timeoutId = undefined;
}


function componentMount() {

  fetchData().then(function (res) {
    window.state.data = res;
  }).then(function () {
    if (window.state.rendered === false) {
      render();
      window.state.rendered = true;
    } else {
      updateComponents();
    }
  }).then(function () {
    if (window.state.loading) {
      $('.w3samples_table_loader').remove();
      window.state.loading = false;
    }
  }).fail(function (e) {
    console.log(e.responseJSON.Message)
  })

  if (getDate()['alis'] === 'today') {
    window.state.timeoutId = setTimeout(componentMount, 3000);
  }
}


function render() {
  let html = '<div class="row row-cols-1 row-cols-md-3 mb-3 text-center">\n';
  window.state.data.map(function (group) {
    html += groupComponent(group);
  });
  html += '</div>';
  $('#content').append(html);

  handelCalender();
}

function handelCalender() {
  $('.locale-fa').persianDatepicker({
    "inline": true,
    "toolbox": {
      "enabled": false
    },
    onSelect: function (unix) {
      clearTimeout(window.state.timeoutId)
      setData(unix);
      componentMount();
    },
  })
}

function fetchData() {

  if (window.state.loading) {
    $('#content').append(loadingComponent());
  }
  const date = getDate();

  if (!window.state.liveData) {
    // Get data from Local json file
    return $.getJSON("content.json", {'s': date['paramDate']}).fail(function () {
      console.log("An error has occurred.");
    });
  } else {
    // Get live data
    const url = 'http://varzeshikhan.ir/api/Test/Index';
    return $.ajax({
      url: url,
      type: 'GET',
      data: {'s': date['paramDate']},
      headers: {'Access-Control-Allow-Origin': '*'},
    })
  }
}

function updateComponents() {

  window.state.data.map(function (value, index, array) {
    value.matches.map(function (match) {
      const scoreHome = $('#match-score-home-' + match.id);
      const scoreAway = $('#match-score-away-' + match.id);

      if (parseInt(scoreHome.text()) !== match.home.score) {
        scoreHome.text(match.home.score);
        scoreHome.addClass('bg-score-updated');
        setTimeout(function () {
          scoreHome.removeClass('bg-score-updated')
        }, 3000);
      }

      if (parseInt(scoreAway.text()) !== match.away.score) {
        scoreAway.text(match.away.score);
        scoreAway.addClass('bg-score-updated');
        setTimeout(function () {
          scoreAway.removeClass('bg-score-updated')
        }, 3000);
      }

    })
  });
}

function setData(unix) {
  persianDate.toCalendar('gregorian');
  persianDate.toLocale('en');
  window.state.date = new persianDate(unix)
}

function getDate() {
  persianDate.toCalendar('gregorian');
  persianDate.toLocale('en');

  let now = new persianDate();
  let date = window.state.date;

  let dateInfo = [];
  let diff = date.diff(now, 'days');

  if (diff === -1) {
    dateInfo['alis'] = 'yesterday';
  } else if (diff === 1) {
    dateInfo['alis'] = 'tomorrow';
  } else if (diff === 0) {
    dateInfo['alis'] = 'today';
  }

  dateInfo['date'] = date;
  dateInfo['paramDate'] = date.format('YYMMDD');

  return dateInfo;
}

function activeDateNavbar() {
  $('.nav-link').removeClass('active')
  if ($('.nav-link#' + getDate()['alis']).length) {
    $('.nav-link#' + getDate()['alis']).addClass('active');
  }
}


function groupComponent(group) {
  let matches = '';
  group.matches.map(function (match) {
    matches += matchComponent(match);
  });

  const groupName = group.groupName !== null ? ' - ' + group.groupName : '';

  let html = '';

  html += `<table class="table live-scores" id="group-${group.id}">
            <caption></caption>
            <thead>
            <tr class="table-info">
                <th class="text-right" scope="col" colspan="2">${group.name}${groupName}</th>
                <th scope="col"></th>
                <th class="text-left" scope="col"></th>
                <th scope="col" colspan="2"></th>
            </tr>
            </thead>
            <tbody>`;
  html += matches;
  html += `</tbody>
        </table>`;
  return html;
}

function matchComponent(match) {

  return `<tr id="match-${match.id}">
                <td class="text-right">${match.time}</td>
                <td class="text-left">${match.away.name}</td>
                <td class="bg-score" id="match-score-away-${match.id}" data-bs-target="${match.away.score}">${match.away.score}</td>
                <td class="bg-score" id="match-score-home-${match.id}" data-bs-target="${match.home.score}">${match.home.score}</td>
                <td class="text-right">${match.home.name}</td>
                <td></td>
            </tr>`
}

function loadingComponent() {
  return " <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"w3samples_table_loader\">\n" +
    "            <tr>\n" +
    "                <th class=\"col1\">\n" +
    "                    <span></span>\n" +
    "                </th>\n" +
    "                <th class=\"col4\">\n" +
    "                    <span></span>\n" +
    "                </th>\n" +
    "                <th class=\"col5\">\n" +
    "                    <span></span>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"col1\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "                <td class=\"col4\">\n" +
    "                    <span></span>\n" +
    "                    <!--                    <span class=\"sub-temp\"></span>-->\n" +
    "                    <!--                    <span class=\"sub-temp sub-temp-three\"></span>-->\n" +
    "                </td>\n" +
    "                <td class=\"col5\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"col1\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "                <td class=\"col4\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "                <td class=\"col5\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"col1\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "                <td class=\"col4\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "                <td class=\"col5\">\n" +
    "                    <span></span>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "        </table>"
}


init();
