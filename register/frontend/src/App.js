var io = require('socket.io-client');
var ObjSync = require('objsync');
var DisciplineSelectionView = require('../../view-tests/views/DisciplineSelectionView/DisciplineSelectionView');
var ScheduleView = require('../../view-tests/views/ScheduleView/ScheduleView');
var ContestantsView = require('../../view-tests/views/ContestantsView/ContestantsView');

// --- Config ---
var HOST = '/friidrett';
var PUBLIC_PORT = 80;
var PRIVATE_PORT = 8889;

function App() {
    this.initialize();
}

module.exports = App;

App.prototype.initialize = function () {
    this.setupElement();
    this.setupSubviews();
    this.setupConnection();
    this.setupSync();
};

App.prototype.setupElement = function () {
    this.el = document.createElement('div');
};

App.prototype.setupSubviews = function () {
    var self = this;

    this.selectionView = new DisciplineSelectionView();
    this.selectionView.on('select', function (discipline) {
        self.scheduleView.disciplineName = discipline.name;
        self.pushState();
        self.presentSchedule();
    });

    this.scheduleView = new ScheduleView();
    this.scheduleView.on('select', function (eventId) {
        self.competitorView.eventId = eventId;
        self.pushState();
        self.presentCompetitors();
    });

    this.competitorView = new ContestantsView();
    this.competitorView.on('toggle_contestant', function (competitorId) {
        var event = self.state.events[this.eventId];
        var participation = event.participations[competitorId];

        // copy
        var newParticipation = {
            isPresent:!participation.isPresent,
            seasonBest:participation.seasonBest,
            results:participation.results
        };

        self.saveParticipation(competitorId, this.eventId, newParticipation);
    });
};

App.prototype.setupSync = function () {
    var connection = io.connect(HOST, {port:PUBLIC_PORT, 'force new connection':true});

    this.sync = new ObjSync(connection, {delimiter:'/'});

    var self = this;
    this.sync.on('update', function () {
        self.setState(self.sync.getObject());
    });
};

App.prototype.setupConnection = function () {
    this.connection = io.connect('/', {port:PRIVATE_PORT, 'force new connection':true});
    this.connection.on('connect', function () {
        console.info('connected on private channel');
    });
};

App.prototype.setState = function (state) {
    this.state = state;

    this.pushState();
};

App.prototype.pushState = function () {
    this.selectionView.setState(this.state.disciplines);

    if (this.scheduleView.hasOwnProperty('disciplineName')) {
        var disciplineName = this.scheduleView.disciplineName;
        var events = this.getEventsForDiscipline(disciplineName);

        this.scheduleView.setState(events);
    }

    if (this.competitorView.hasOwnProperty('eventId')) {
        var eventId = this.competitorView.eventId;
        var eventState = this.getStateForEvent(eventId);

        this.competitorView.setState(eventState);
    }
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

App.prototype.getStateForEvent = function (eventId) {
    var competitors = {};

    var participations = this.state.events[eventId].participations;
    for (var competitorId in participations) {
        var competitor = this.state.competitors[competitorId];
        var participation = participations[competitorId];

        var competitorState = {
            startNum:competitor.startNum,
            name:competitor.name,
            club:competitor.club,
            isPresent:participation.isPresent
        };

        competitors[competitorId] = competitorState;
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

App.prototype.saveParticipation = function (competitorId, eventId, participation) {
    this.connection.emit('saveParticipation', {
        competitorId:competitorId,
        eventId:eventId,
        participation:participation
    });
};
