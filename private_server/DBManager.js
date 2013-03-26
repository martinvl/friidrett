var EventEmitter = require('events').EventEmitter;
var pg = require('pg');

function DBManager() {
    this.initialize();
};

DBManager.prototype = new EventEmitter();
DBManager.prototype.constructor = DBManager;
module.exports = DBManager;

DBManager.prototype.initialize = function () {
    this.competitions = {};

    this.setupClient();
};

DBManager.prototype.setupClient = function () {
    var connectionData = 'tcp://dbuser:ech748@localhost/friidrett';

    var self = this;
    this.client = new pg.Client(connectionData);
    this.client.connect(function (err) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('connected to db');

        self.getCompetition(1);
        self.getEvents(1);
        self.getParticipations(1);
        self.getDisciplines(1);
        self.getCompetitors(1);
    });
};

DBManager.prototype.setCompetition = function (competitionId, competition) {
    this.competitions[competitionId] = competition;

    this.emit('update');
};

DBManager.prototype.getState = function () {
    return this.competitions;
};

DBManager.prototype.getCompetition = function (competitionId) {
    var query = 'SELECT competitionName, isOpen, competitionId FROM Competition WHERE competitionId = ' + competitionId + ';';

    var self = this;
    this.client.query(query, function (err, result) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('received competition');

        self.competitionData = result.rows;
        self.assemble();
    });
};

DBManager.prototype.getEvents = function (competitionId) {
    var query = 'SELECT e.eventId, e.disciplineName, e.className, dc.classRemarks, e.location, e.startTime, e.notifications, e.isOpen FROM Event e, Discipline_Class dc WHERE e.competition = ' + competitionId + ' AND e.disciplineName = dc.disciplineName AND e.className = dc.className ORDER BY e.eventId ASC;';

    var self = this;
    this.client.query(query, function (err, result) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('received events');

        self.eventsData = result.rows;
        self.assemble();
    });
};

DBManager.prototype.getParticipations = function (competitionId) {
    var query = 'SELECT p.eventId, p.competitorId, p.isPresent, p.seasonBest, p.results FROM EventParticipation p, Event e WHERE p.eventId = e.eventId AND e.competition = ' + competitionId + ' ORDER BY competitorId;';

    var self = this;
    this.client.query(query, function (err, result) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('received participations');

        self.participationsData = result.rows;
        self.assemble();
    });
};

DBManager.prototype.getCompetitors = function (competitionId) {
    var query = 'SELECT competitorId, startingNumber, competitorName, competitorClub, competitorClass FROM Competitor WHERE competition = ' + competitionId + ' ORDER BY competitorId;';

    var self = this;
    this.client.query(query, function (err, result) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('received competitors');

        self.competitorsData = result.rows;
        self.assemble();
    });
};

DBManager.prototype.getDisciplines = function () {
    var query = 'SELECT disciplineName, archetype, description FROM Discipline ORDER BY archetype;';

    var self = this;
    this.client.query(query, function (err, result) {
        if (err) {
            console.dir(err);
            return;
        }

        console.dir('received disciplines');

        self.disciplinesData = result.rows;
        self.assemble();
    });
};

DBManager.prototype.updateParticipation = function (competitorId, eventId, participation) {
    var query = 'UPDATE EventParticipation SET isPresent = ' + participation.isPresent + ' , seasonBest = ' + (participation.seasonBest || 0) + ', results = \'' + participation.results + '\' WHERE competitorId = ' + competitorId + ' AND eventId = ' + eventId + ';';

    this.client.query(query, function (err, result) {
        if(err) {
            console.dir(err);
            return; //her må vi få en bedre løsning
        }

        console.dir(result);
    });
}

DBManager.prototype.updateEvent = function (eventId, event) {
    var query = 'UPDATE Event SET startTime = ' + event.startTime + ' , notifications = ' + event.notifications + ' isOpen = ' + event.isOpen + ' WHERE eventId = ' + eventId + ';';

    this.client.query(query, function (err, result) {
        if(err) {
            console.dir(err);
            return; //her må vi få en bedre løsning
        }

        console.dir(result);
    });
}

DBManager.prototype.updateCompetitor = function (competitorId, competitor) {
    console.dir(competitor);
    var query = 'UPDATE Competitor SET startingNumber = ' + competitor.startNum + ' , competitorName = \'' + competitor.name + '\', competitorClub = \'' + competitor.club + '\', competitorClass = \'' + competitor.className + '\' WHERE competitorId = ' + competitorId + ';';

    this.client.query(query, function (err, result) {
        if(err) {
            console.dir(err);
            return; //her må vi få en bedre løsning
        }

        console.dir(result);
    });
};

DBManager.prototype.assemble = function () {
    if (!this.competitionData) {
        console.dir('no competitionData');
        return;
    }

    if (!this.eventsData) {
        console.dir('no eventsData');
        return;
    }

    if (!this.participationsData) {
        console.dir('no participationsData');
        return;
    }

    if (!this.competitorsData) {
        console.dir('no competitorsData');
        return;
    }

    if(!this.disciplinesData) {
        console.dir('no disciplinesData');
        return;
    }

    console.dir('ready to assemble');

    var disciplines = this.assembleDisciplines();
    var competitors = this.assembleCompetitors();
    var events = this.assembleEvents();

    var competitionData = this.competitionData;
    var competitionId = competitionData[0].competitionid

        var competition = {
            name:competitionData[0].competitionname,
            isOpen:competitionData[0].isopen,
            disciplines:disciplines,
            events:events,
            competitors:competitors
        }

    this.setCompetition(competitionId, competition);
};

DBManager.prototype.assembleDisciplines = function  () {
    var disciplines = [];

    for (var idx in this.disciplinesData) {
        var disciplineData = this.disciplinesData[idx];

        var discipline = {
            name:disciplineData.disciplinename,
            archetype:disciplineData.archetype,
            description:disciplineData.description,
        }

        disciplines[idx] = discipline;
    }

    return disciplines;
}

DBManager.prototype.assembleEvents = function () {
    var events = {};

    for (var idx in this.eventsData) {
        var eventData = this.eventsData[idx];

        var parts = this.assembleEventParticipations(eventData.eventid);

        var event = {
            disciplineName:eventData.disciplinename,
            className:eventData.classname,
            remarks:eventData.classremarks,
            location:eventData.location,
            startTime:eventData.starttime.substr(0, 5),
            notifications:eventData.notifications, // OBSOBS dette er nok feil, dette er i tekst i SQL
            participations:parts
        }

        events[eventData.eventid] = event;
    }

    return events;
};

DBManager.prototype.assembleEventParticipations = function (eventId) {
    var participations = {};

    for (var idx in this.participationsData) {
        var participationData = this.participationsData[idx];

        if (participationData.eventid == eventId){
            var part = {
                isPresent:participationData.ispresent,
                seasonBest:participationData.seasonbest,
                results:participationData.results  // OBSOBS seriell data, dette kommer kun som tekst fra SQL
            }

            participations[participationData.competitorid] = part;
        }
    }

    return participations;
};


DBManager.prototype.assembleCompetitors = function () {
    var competitors = {};

    for (var idx in this.competitorsData) {
        var competitorData = this.competitorsData[idx];

        var parts = this.assembleCompParticipations(competitorData.competitorid);

        var competitor = {
            startNum:competitorData.startingnumber,
            name:competitorData.competitorname,
            club:competitorData.competitorclub,
            className:competitorData.competitorclass,
            participations:parts
        };

        competitors[competitorData.competitorid] = competitor;
    }

    return competitors;
};

DBManager.prototype.assembleCompParticipations = function (competitorId) {
    var participations = [];
    var parts = 0;
    for(var idx in this.participationsData) {
        var participationData = this.participationsData[idx];

        if(participationData.competitorId == competitorId){
            participations[parts] = participationsData.eventId;
            parts++;
        }
    }

    return participations;
};
