init();

function init() {
    initialState();
    componentMount();
    activeDateNavbar();
}

function initialState() {
    window.state = {};
    window.state.data = {};
    window.state.liveData = true;
    window.state.loading = true;
    window.state.rendered = false;
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
    });

    if (getDate()['alis'] === 'today') {
        setTimeout(componentMount, 3000);
    }


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

    if (window.state.loading) {
        $('#root').append(loadingComponnet());
    }

    if (!window.state.liveData) {
        // Get data from Local json file
        return $.getJSON("content.json").fail(function () {
            console.log("An error has occurred.");
        });
    } else {
        // Get live data
        const date = getDate()
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

function getDate() {

    let dateInfo = [];
    let searchParams = new URLSearchParams(window.location.search);
    let alis = searchParams.get('date') === null || searchParams.get('date') === undefined ? 'today' : searchParams.get('date');
    let d = new Date();

    if (alis === 'yesterday') {
        d.setDate(d.getDate() - 1)
    } else if (alis === 'tomorrow') {
        d.setDate(d.getDate() + 1)
    }

    dateInfo['alis'] = alis;
    dateInfo['strDate'] = d.toLocaleDateString('en-ZA');
    dateInfo['paramDate'] = d.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replaceAll('/', '');

    return dateInfo;
}

function activeDateNavbar() {
    $('.nav-link#' + getDate()['alis']).addClass('active');
}


function groupComponent(group) {
    let matches = '';
    group.matches.map(function (match) {
        matches += matchComponent(match);
    });
    const date = getDate();
    const groupName = group.groupName !== null ? ' - ' + group.groupName : '';

    let html = '';

    html += `<table class="table live-scores" id="group-${group.id}">
            <caption></caption>
            <thead>
            <tr class="table-info">
                <th class="text-right" scope="col" colspan="2">${group.name}${groupName}</th>
                <th class="text-left" scope="col" colspan="2">${date.strDate}</th>
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
                <td class="text-left">${match.away.name}</td>
                <td class="bg-score" id="match-score-away-${match.id}" data-bs-target="${match.away.score}">${match.away.score}</td>
                <td class="bg-score" id="match-score-home-${match.id}" data-bs-target="${match.home.score}">${match.home.score}</td>
                <td class="text-right">${match.home.name}</td>
            </tr>`
}

function loadingComponnet() {
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
