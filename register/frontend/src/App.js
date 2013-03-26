var io = require('socket.io-client');
var ObjSync = require('objsync');
var DisciplineSelectionView = require('../../view-tests/views/DisciplineSelectionView/DisciplineSelectionView');
var ScheduleView = require('../../view-tests/views/ScheduleView/ScheduleView');
var ContestantsView = require('../../view-tests/views/ContestantsView/ContestantsView');

// --- Config ---
var HOST = 'localhost/friidrett';
var PORT = 8888;

function App() {
    this.initialize();
}

module.exports = App;

App.prototype.initialize = function () {
    this.setupElement();
    this.setupSubviews();
    this.setupSync();
};

App.prototype.setupElement = function () {
    this.el = document.createElement('div');
};

App.prototype.setupSubviews = function () {
    var self = this;

    this.selectionView = new DisciplineSelectionView();
    this.selectionView.on('select', function (discipline) {
        var schedule = self.getEventsForDiscipline(discipline.name);

        self.scheduleView.setState(schedule);
        self.presentSchedule();
    });

    this.scheduleView = new ScheduleView();
    this.scheduleView.on('select', function (eventId) {
        var competitors = self.getCompetitorsForEvent(eventId);

        self.competitorView.setState(competitors);
        self.presentCompetitors();
    });

    this.competitorView = new ContestantsView();
};

App.prototype.setupSync = function () {
    this.connect();

    this.sync = new ObjSync(this.connection, {delimiter:'/'});

    var self = this;
    this.sync.on('update', function () {
        self.setState(self.sync.getObject());
    });
};

App.prototype.connect = function () {
    this.connection = io.connect(HOST, {port:PORT, 'force new connection':true});
};

App.prototype.setState = function (state) {
    this.state = state;

    this.selectionView.setState(state.disciplines);
};

App.prototype.getEventsForDiscipline = function (disciplineName) {
    var events = {};

    for (var eventId in this.state.events) {
        var event = this.state.events[eventId];

        if (event.disciplineName == disciplineName)
            events[eventId] = event;
    }

    return events;
};

App.prototype.getCompetitorsForEvent = function (eventId) {
    var competitors = {};

    var participations = this.state.events[eventId].participations;
    for (var competitorId in participations) {
        var competitor = this.state.competitors[competitorId];

        competitors[competitorId] = competitor;
    }

    var event = this.state.events[eventId];
    var state = {
        discipline:event.disciplineName,
        className:event.className,
        location:event.location,
        startTime:event.startTime,
        competitors:competitors
    };

    return state;
};

App.prototype.presentDisciplineSelection = function () {
    this.el.innerHTML = '';
    this.el.appendChild(this.selectionView.el);
};

App.prototype.presentSchedule = function () {
    this.el.innerHTML = '';
    this.el.appendChild(this.scheduleView.el);
};

App.prototype.presentOverview = function () {
};

App.prototype.presentCompetitors = function () {
    this.el.innerHTML = '';
    this.el.appendChild(this.competitorView.el);
};
