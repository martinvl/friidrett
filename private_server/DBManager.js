function DBManager() {
    this.client = ...;
};

DBManager.prototype.getState = function (callback) {
    var query = 'SELECT ';
};

DBMananger.prototype.getCompetition = function (competitionId) {
    this.competitionData = null;

    var query = 'SELECT competitionName, isOpen FROM Competition WHERE competitionId = ' + competitionId + ';';

    this.client.query(query, function (err, result) {
	if (err) {
	    // release hell
	}
	
	this.competitionData = result.rows;
	this.assemble();
    });
};

DBManager.prototype.getEvents = function (competitionId) {
    this.eventData = null;

    var query = 'SELECT e.eventId, e.disciplineName, e.className, dc.classRemarks, e.location, e.startTime, e.notifications, e.isOpen FROM Event e, Discipline_Class dc WHERE e.competition = ' + competitionId + ' AND e.disciplineName = dc.disciplineName AND e.className = dc.className ORDER BY e.eventId ASC;';

    this.client.query(query, function (err, result) {
	if (err) {
	    // release hell
	}
	
	this.eventData = result.rows;
	this.assemble();
    });
};

DBManager.prototype.getParticipations = function (competitionId) {
    this.participationsData = null;

    var query = 'SELECT p.eventId, p.competitorId, p.isPresent, p.seasonBest, p.results FROM EventParticipation p, Event e WHERE p.eventId = e.eventId AND e.competition = ' + competitionId + ' ORDER BY competitorId;';

    this.client.query(query, function (err, result) {
	if (err) {
	    // release hell
	}
	
	this.participationsData = result.rows;
	this.assemble();
    });
};

DBManager.prototype.getCompetitors = function (competitionId) {
    this.competitorsData = null;

    var query = 'SELECT competitorId, startingNumber, competitorName, competitorClub, competitorClass FROM Competitor WHERE competition = ' + competitionId + ' ORDER BY competitorId;';

    this.client.query(query, function (err, result) {
	if (err) {
	    // release hell
	}
	
	this.competitiorsData = result.rows;
	this.assemble();
    });
};

DBManager.prototype.getDisciplines = function () {
    this.disciplinesData = null;

    var query = 'SELECT disciplineName, archtype, description FROM Discipline ORDER BY archtype;';

    this.client.query(query, function (err, result) {
	if (err) {
	    // release hell
	}

	this.disciplinesData = result.rows;
	this.assemble();
    }
}

DBManager.prototype.updateCompetitor = function (competitorId, competitionId,
        competitor, callback) {
    var query = 'UPDATE ...';
};

DBManager.prototype.assemble = function () {
    if (!this.competitionData)
        return;

    if (!this.eventsData)
        return;

    if (!this.participationsData)
        return;

    if (!this.competitorsData)
        return;

    if(!this.disciplinesData)
	return;

    var disciplines = this.assembleDisciplines;
    var competitors = this.assembleCompetitors();
    var events = this.assembleEvents();
    var competiton = {
	name:competitionData[0].competitionname,
	isOpen:competitionData[0].isopen,
	disciplines:disciplines,
	events:events,
	competitors:competitors
    }
};

DBManager.prototype.assembleDisciplines = function  () {
    var disciplines [];
    
    for (var idx in this.disciplinesData) {
	var disciplineData = this.disciplinesData[idx];
	
	var discipline = {
	    name:disciplineData.disciplinename,
	    archtype:disciplineData.archtype,
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
            startTime:eventData.starttime,
            notifications:eventData.notifications, // OBSOBS dette er nok feil, dette er i tekst i SQL
	    participations:parts
	}
	    
	events[eventData.eventid] = event;
    }

    return events;
};

DBManager.prototype.assembleEventParticipations = function (eventId) {
    var participations = {};
    for(var idx in this.participationsData) {
	var participationData = this.participationsData[idx];

	if(participationData.eventId == eventId){
	    var part = {
		isPresent:participationData.ispresent
		seasonBest:participationData.seasonbest
		results:participationData.results
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
	    className:competitorData.classname,
	    participations:parts
	}
	    
	competitors[comptitorData.competitorid] = competitor;
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
