var ContestantView = require('./ContestantView');

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

    var header = document.createElement('div');
    header.className = 'header';
    this.el.appendChild(header);

    this.disciplineField = document.createElement('div');
    this.disciplineField.className = 'discipline';
    header.appendChild(this.disciplineField);

    this.classNameField = document.createElement('div');
    this.classNameField.className = 'class';
    header.appendChild(this.classNameField);

    var info = document.createElement('div');
    info.className = 'info';
    this.el.appendChild(info);

    this.locationField = document.createElement('div');
    this.locationField.className = 'location';
    info.appendChild(this.locationField);

    this.startingTimeField = document.createElement('div');
    this.startingTimeField.className = 'startingTime';
    info.appendChild(this.startingTimeField);

    this.contestantsList = document.createElement('div');
    this.contestantsList.className = 'contestants';
    this.el.appendChild(this.contestantsList);
};

ContestantsView.prototype.setState = function (state) {
    this.state = state;

    this.update();
};

ContestantsView.prototype.update = function () {
    this.disciplineField.innerHTML = this.state.discipline;
    this.classNameField.innerHTML = this.state.className;
    this.locationField.innerHTML = this.state.location;
    this.startingTimeField.innerHTML = this.state.startingTime;

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
