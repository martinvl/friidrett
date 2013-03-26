function EventHeaderView() {
    this.initialize();
    this.update();
}

module.exports = EventHeaderView;

EventHeaderView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

EventHeaderView.prototype.setupState = function () {
    this.state = {};
};

EventHeaderView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'event_header';

    var header = document.createElement('div');
    header.className = 'event_headline';
    this.el.appendChild(header);

    this.disciplineField = document.createElement('div');
    this.disciplineField.className = 'event_discipline';
    header.appendChild(this.disciplineField);

    this.classNameField = document.createElement('div');
    this.classNameField.className = 'event_class';
    header.appendChild(this.classNameField);

    var info = document.createElement('div');
    info.className = 'event_info';
    this.el.appendChild(info);

    this.locationField = document.createElement('div');
    this.locationField.className = 'event_location';
    info.appendChild(this.locationField);

    this.startingTimeField = document.createElement('div');
    this.startingTimeField.className = 'event_startingTime';
    info.appendChild(this.startingTimeField);
};

EventHeaderView.prototype.setState = function (state, silent) {
    this.state = state;

    if (!silent)
        this.update();
};

EventHeaderView.prototype.update = function () {
    this.disciplineField.innerHTML = this.state.discipline;
    this.classNameField.innerHTML = this.state.className;
    this.locationField.innerHTML = this.state.location;
    this.startingTimeField.innerHTML = this.state.startingTime;
};

/*
{
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00'
}
*/
