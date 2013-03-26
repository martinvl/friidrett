var EventEmitter = require('events').EventEmitter;
var DisciplineView = require('./DisciplineView');

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
        var discipline = this.state[idx];
        var disciplineView = new DisciplineView();

        disciplineView.setState(discipline);

        var self = this;
        disciplineView.on('select', function () {
            self.handleSelection(this);
        });

        this.disciplinesList.appendChild(disciplineView.el);
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
