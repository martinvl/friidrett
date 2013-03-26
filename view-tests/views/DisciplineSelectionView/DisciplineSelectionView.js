var EventEmitter = require('events').EventEmitter;

function DisciplineSelectionView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

DisciplineSelectionView.prototype = new EventEmitter();
DisciplineSelectionView.prototype.constructor = DisciplineSelectionView;
module.exports = DisciplineSelectionView;

DisciplineSelectionView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

DisciplineSelectionView.prototype.setupState = function () {
    this.state = [];
};

DisciplineSelectionView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'disciplines_view';

    this.disciplinesList = document.createElement('div');
    this.disciplinesList.className = 'disciplines';
    this.el.appendChild(this.disciplinesList);
};

DisciplineSelectionView.prototype.setState = function (state, silent) {
    this.state = state;

    if (!silent)
        this.update();
};

DisciplineSelectionView.prototype.handleSelection = function (disciplineView) {
    this.emit('select', disciplineView.state.name);
};

DisciplineSelectionView.prototype.update = function () {
    this.disciplinesList.innerHTML = '';
    for (var idx in this.state) {
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
[
        {
            name:'',
            description:''
        }
    ]
*/
