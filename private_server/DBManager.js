function DBManager() {
}

DBManager.prototype.getState = function (callback) {
    var query = 'SELECT ';
};

DBMananger.prototype.getCompetition = function (competitionId) {
    this.competitionData = null;

    var query = 'SELECT competitionId, competitionName, isOpen FROM Competition WHERE competitionId = ' + competitionId + ';';

    on_callback {
        this.competitionData = ...;
        this.assemble();
    }
}

DBManager.prototype.getEvents = function (competitionId) {
    var query = 'SELECT e.eventId, e.disciplineName, e.className, dc.classRemarks, e.location, e.startTime, e.notifications, e.isOpen FROM Event e, Discipline_Class dc WHERE e.competition = ' + competitionId + ' AND e.disciplineName = dc.disciplineName AND e.className = dc.className ORDER BY e.eventId ASC;';
}

DBManager.prototype.getParticipations = function (competitionId) {
    var query = 'SELECT p.eventId, p.competitorId, p.isPresent, p.seasonBest, p.results FROM EventParticipation p, Event e WHERE p.eventId = e.eventId AND e.competition = ' + competitionId + ' ORDER BY competitorId;';
}

DBManager.prototype.getCompetitors = function (competitionId) {
    var query = 'SELECT competitorId, startingNumber, competitorName, competitorClub, competitorClass FROM Competitor WHERE competition = ' + competitionId + ' ORDER BY competitorId;';
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

    if (!this.)
        return;

    if (!this.competitorsData)
        return;

    // insert magic here
};
