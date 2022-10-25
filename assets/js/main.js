init();

function init() {

  initialState();
  componentMount();

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

    // window.state.updatedData = window.state.data;
  });

  setTimeout(componentMount, 3000);
}


function render() {
  let html = '<div class="row row-cols-1 row-cols-md-3 mb-3 text-center">\n';
  window.state.data.map(function (group) {
    html += groupComponent(group);
  });
  html += '</div>';

  $('#root').append(html);
}

function fetchData() {
  const url = 'http://varzeshikhan.ir/api/Test/Index?s=20221025';

  return $.ajax({
    url: url,
    type: 'GET',
    headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:63342/'},
  });

}

function groupComponent(group) {
  let matches = '';
  group.matches.map(function (match) {
    matches += matchComponent(match);
  });

  const groupName = group.groupName !== null ? ' - ' + group.groupName : '';
  let html = '';
  html += `      <div class="col" id="group-${group.id}">\n` +
    '        <div class="card mb-4 rounded-3 shadow-sm">\n' +
    '          <div class="card-header py-3">\n' +
    `            <h4 class="my-0 fw-normal">${group.ccode}${groupName}</h4>\n` +
    '          </div>\n' +
    '          <div class="card-body">\n';
  html += `${matches}`
  html += '          </div>\n' +
    '        </div>\n' +
    '      </div>\n';

  return html;
}

function matchComponent(match) {
  return `  <div class="row p-2" id="match-${match.id}">\n` +
    `    <div class="col-2 text-center p-2 bg-score" id="match-score-home-${match.id}">${match.home.score}</div>\n` +
    `    <div class="col-8 text-center p-2">${match.home.name} - ${match.away.name}</div>\n` +
    `    <div class="col-2 text-center p-2 bg-score" id="match-score-away-${match.id}">${match.away.score}</div>\n` +
    '  </div>'
}


function updateComponents() {

  window.state.data.map(function (value, index, array) {
    value.matches.map(function (match) {
      const scoreHome = $('#match-score-home-' + match.id);
      const scoreAway = $('#match-score-away-' + match.id);


      if (parseInt(scoreHome.text()) !== match.home.score) {

        console.log(match.home.name)
        console.log('old-data:' + parseInt(scoreHome.text()))
        console.log('new-data:' + match.home.score)
        scoreHome.addClass('bg-score-updated');
        setTimeout(function () {
          scoreHome.removeClass('bg-score-updated')
        }, 7000);
      }

      if (parseInt(scoreAway.text()) !== match.away.score) {
        console.log(match.away.name)
        console.log('old-data:' + parseInt(scoreAway.text()))
        console.log('new-data:' + match.away.score)
        scoreAway.addClass('bg-score-updated');
        setTimeout(function () {
          scoreAway.removeClass('bg-score-updated')
        }, 7000);
      }

      scoreHome.text(match.home.score);
      scoreAway.text(match.away.score);
    })
  });
}

function initialState() {
  window.state = {};
  window.state.data = {};
  window.state.synced = false;
  window.state.rendered = false;
}
