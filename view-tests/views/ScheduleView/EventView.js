var EventEmitter = require('events').EventEmitter;

function EventView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

EventView.prototype = new EventEmitter();
EventView.prototype.constructor = EventView;
module.exports = EventView;

EventView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

EventView.prototype.setupState = function () {
    this.state = {};
};

EventView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'event';

    var self = this;
    if (this.el.hasOwnProperty('ontouchend')) {
        this.el.ontouchend = function () {
            self.handleSelect();
        };
    } else {
        this.el.onclick = function () {
            self.handleSelect();
        };
    }

    this.startTimeField = document.createElement('div');
    this.startTimeField.className = 'event_start_time';
    this.el.appendChild(this.startTimeField);

    var infoField = document.createElement('div');
    infoField.className = 'event_info';
    this.el.appendChild(infoField);

    this.disciplineField = document.createElement('div');
    this.disciplineField.className = 'event_discipline';
    infoField.appendChild(this.disciplineField);

    this.classNameField = document.createElement('div');
    this.classNameField.className = 'event_class';
    infoField.appendChild(this.classNameField);

    this.locationField = document.createElement('div');
    this.locationField.className = 'event_location';
    infoField.appendChild(this.locationField);

};

EventView.prototype.handleSelect = function () {
    this.emit('select', this);
};

EventView.prototype.setState = function (state, silent) {
    this.state = state;

    if (!silent)
        this.update();
};

EventView.prototype.update = function () {
    this.startTimeField.innerHTML = this.state.startTime;
    this.disciplineField.innerHTML = this.state.disciplineName;
    this.classNameField.innerHTML = this.state.className;
    this.locationField.innerHTML = this.state.location;
};

/*
    {
        startTime:'',
        disciplineName:'',
        className:'',
        location:''
    }
*/
