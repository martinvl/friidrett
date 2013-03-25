/*******************************************************************
* Competition table
*******************************************************************/


CREATE TABLE Competition (
       competitionId INTEGER PRIMARY KEY,
       competitionName VARCHAR(255) NOT NULL
);


/*******************************************************************
* Discipline table
*******************************************************************/


CREATE TABLE Discipline (
       disciplineName VARCHAR(32) PRIMARY KEY
);


/*******************************************************************
* Competitor class table
*******************************************************************/


CREATE TABLE CompetitorClass (
       className VARCHAR(32) PRIMARY KEY
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
       disciplineName VARCHAR(32),
       className VARCHAR(32),
       competition INTEGER,
       startTime TIME
);

ALTER TABLE Event ADD CONSTRAINT event_discipline
       FOREIGN KEY (disciplineName) REFERENCES Discipline(disciplineName);

ALTER TABLE Event ADD CONSTRAINT event_class
       FOREIGN KEY (className) REFERENCES CompetitorClass(className);

ALTER TABLE Event ADD CONSTRAINT event_competition
       FOREIGN KEY (competition) REFERENCES Competition(competitionId);

/*******************************************************************
* Competitor table
*******************************************************************/


CREATE TABLE Competitor (
       startingNumber INTEGER,
       competitorName VARCHAR(255),
       competitorClub VARCHAR(255),
       competitorClass VARCHAR(32),
       competition INTEGER,
       PRIMARY KEY(startingNumber, competition)
);

/* Foreign keys */

ALTER TABLE Competitor ADD CONSTRAINT competitor_class
       FOREIGN KEY (competitorClass) REFERENCES CompetitorClass(className);

ALTER TABLE Competitor ADD CONSTRAINT competitor_competition
       FOREIGN KEY (competition) REFERENCES Competition(competitionId);


/*******************************************************************
* Constraint drops
*******************************************************************/

/*
DROP CONSTRAINT competitor_competition;

DROP CONSTRAINT competitor_class;

DROP CONSTRAINT event_discipline;

DROP CONSTRAINT event_competition;

DROP CONSTRAINT event_class;

DROP CONSTRAINT comp_class;

DROP CONSTRAINT comp_discipline;
*/

/*******************************************************************
* Table drops
*******************************************************************/


DROP TABLE Competitor;

DROP TABLE Event;

DROP TABLE Discipline_Class;

DROP TABLE CompetitorClass;

DROP TABLE Discipline;

DROP TABLE Competition;
