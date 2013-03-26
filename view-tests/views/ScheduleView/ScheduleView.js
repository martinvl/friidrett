var EventEmitter = require('events').EventEmitter;
var EventView = require('./EventView');

function ScheduleView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

ScheduleView.prototype = new EventEmitter();
ScheduleView.prototype.constructor = ScheduleView;
module.exports = ScheduleView;

ScheduleView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

ScheduleView.prototype.setupState = function () {
    this.state = {};
};

ScheduleView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'schedule_view';

    this.eventsList = document.createElement('div');
    this.eventsList.className = 'events';
    this.el.appendChild(this.eventsList);
};

ScheduleView.prototype.setState = function (state, silent) {
    this.state = state;

    if (!silent)
        this.update();
};

ScheduleView.prototype.handleSelect = function (eventView) {
    this.emit('select', eventView.eventId);
};

ScheduleView.prototype.update = function () {
    this.eventsList.innerHTML = '';

    for (var eventId in this.state) {
        var event = this.state[eventId];
        var eventView = new EventView();

        var self = this;
        eventView.on('select', function () {
            self.handleSelect(this);
        });

        eventView.eventId = eventId;
        eventView.setState(event);
        this.eventsList.appendChild(eventView.el);
    }
};

/*
{
    <event id>:{
        startTime:'',
        disciplineName:'',
        className:'',
        location:''
    }
}
*/
