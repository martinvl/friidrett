var EventEmitter = require('events').EventEmitter;
var ContestantView = require('../ContestantView/ContestantView');
var EventHeaderView = require('../EventHeaderView/EventHeaderView');

function ContestantsView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

ContestantsView.prototype = new EventEmitter();
ContestantsView.prototype.constructor = ContestantsView;
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

ContestantsView.prototype.handleToggle = function (contestantView) {
    this.emit('toggle_contestant', contestantView);
};

ContestantsView.prototype.update = function () {
    this.headerView.update();

    this.contestantsList.innerHTML = '';
    for (var idx in this.state.contestants) {
        var contestant = this.state.contestants[idx];
        var contestantView = new ContestantView();

        var self = this;
        contestantView.on('toggle', function (contestantView) {
            self.handleToggle(contestantView);
        });

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
