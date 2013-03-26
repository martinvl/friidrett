

/*******************************************************************
* Competition table
*******************************************************************/


CREATE TABLE Competition (
       competitionId INTEGER PRIMARY KEY,
       competitionName VARCHAR(255) UNIQUE NOT NULL
);


/*******************************************************************
* Discipline table
*******************************************************************/


CREATE TABLE Discipline (
       disciplineName VARCHAR(32) PRIMARY KEY,
       disciplineDescription VARCHAR(255)
);


/*******************************************************************
* Competitor class table
*******************************************************************/


CREATE TABLE CompetitorClass (
       className VARCHAR(32) PRIMARY KEY,
       classDescription VARCHAR(255)
);


/*******************************************************************
* Discipline and competitior class combination table
*******************************************************************/


CREATE TABLE Discipline_Class (
       disciplineName VARCHAR(32),
       className VARCHAR(32),
       classRemarks VARCHAR(255),
       PRIMARY KEY(disciplineName, className)
);

/* Foreign keys */

ALTER TABLE Discipline_Class ADD CONSTRAINT comp_discipline
       FOREIGN KEY (disciplineName) REFERENCES Discipline(disciplineName);

ALTER TABLE Discipline_Class ADD CONSTRAINT comp_class
       FOREIGN KEY (className) REFERENCES CompetitorClass(className);


/*******************************************************************
* Discipline, competitior class and competition combination table
* called Event
*******************************************************************/


CREATE TABLE Event (
       eventId INTEGER PRIMARY KEY,
       disciplineName VARCHAR(32) NOT NULL,
       className VARCHAR(32) NOT NULL,
       competition INTEGER NOT NULL,
       location VARCHAR(255),
       startTime TIME,
       UNIQUE(disciplineName, className, competition)
);

/* Foreign keys */

ALTER TABLE Event ADD CONSTRAINT event_discipline
       FOREIGN KEY (disciplineName, className) REFERENCES Discipline_Class(disciplineName, className);

ALTER TABLE Event ADD CONSTRAINT event_competition
       FOREIGN KEY (competition) REFERENCES Competition(competitionId);


/*******************************************************************
* Competitor table
*******************************************************************/


CREATE TABLE Competitor (
       competitorId INTEGER PRIMARY KEY,
       startingNumber INTEGER NOT NULL,
       competitorName VARCHAR(255),
       competitorClub VARCHAR(255),
       competitorClass VARCHAR(32),
       competition INTEGER NOT NULL,
       UNIQUE(startingNumber, competition)
);

/* Foreign keys */

ALTER TABLE Competitor ADD CONSTRAINT competitor_class
       FOREIGN KEY (competitorClass) REFERENCES CompetitorClass(className);

ALTER TABLE Competitor ADD CONSTRAINT competitor_competition
       FOREIGN KEY (competition) REFERENCES Competition(competitionId);


/*******************************************************************
* Event participation table
*******************************************************************/


CREATE TABLE EventParticipation (
       competitorId INTEGER,
       eventId INTEGER,
       seasonBest REAL,
       isPresent BOOLEAN NOT NULL,
       results VARCHAR(510),
       PRIMARY KEY(competitorId, eventId)
);

/* Foreign keys */

ALTER TABLE EventParticipation ADD CONSTRAINT participation_event
       FOREIGN KEY (eventId) REFERENCES Event(eventId);

ALTER TABLE EventParticipation ADD CONSTRAINT participation_competitor
       FOREIGN KEY (competitorId) REFERENCES Competitor(competitorId);


/*******************************************************************
* Table drops
*******************************************************************/
/*
DROP TABLE EventParticipation;

DROP TABLE Competitor;

DROP TABLE Event;

DROP TABLE Discipline_Class;

DROP TABLE CompetitorClass;

DROP TABLE Discipline;

DROP TABLE Competition;
*/
