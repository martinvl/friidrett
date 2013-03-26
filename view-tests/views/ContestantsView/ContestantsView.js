var ContestantView = require('../ContestantView/ContestantView');
var EventHeaderView = require('../EventHeaderView/EventHeaderView');

function ContestantsView() {
    this.initialize();
    this.update();
}

module.exports = ContestantsView;

ContestantsView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

ContestantsView.prototype.setupState = function () {
    this.state = {};
};

ContestantsView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'contestants_view';

    this.headerView = new EventHeaderView();
    this.el.appendChild(this.headerView.el);

    this.contestantsList = document.createElement('div');
    this.contestantsList.className = 'contestants';
    this.el.appendChild(this.contestantsList);
};

ContestantsView.prototype.setState = function (state, silent) {
    this.state = state;
    this.headerView.setState(state, true);

    if (!silent)
        this.update();
};

ContestantsView.prototype.update = function () {
    this.headerView.update();

    this.contestantsList.innerHTML = '';
    for (var idx in this.state.contestants) {
        var contestant = this.state.contestants[idx];
        var contestantView = new ContestantView();

        contestantView.setState(contestant);

        this.contestantsList.appendChild(contestantView.el);
    }
};

/*
{
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    contestants:[
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        }
    ]
}
*/
