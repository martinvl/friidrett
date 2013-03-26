var http = require('http');
var path = require('path');
var express = require('express');
var io = require('socket.io');
var ObjDist = require('objdist');

// --- Configuration ---
var PORT = 8888;
var DATA_PREFIX = 'friidrett';

// --- Setup express ---
var app = express();

var frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

var server = http.createServer(app);
server.listen(PORT);

// --- Setup socket.io ---
var transport = io.listen(server);

transport.set('log level', 0)
transport.disable('browser client');

// --- Setup distibution ---
var dist = new ObjDist(transport, {prefix:DATA_PREFIX});

var state = {
    disciplines:[
    ],
    events:{
        1:{
            disciplineName:'Discipline 1',
            className:'MJ',
            remarks:'',
            location:'Hovedbanen',
            startTime:'09.00',
            participations:{
                1:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                2:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                3:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                }
            }
        },
        2:{
            disciplineName:'Discipline 1',
            className:'J18-19',
            remarks:'',
            location:'Hovedbanen',
            startTime:'10.00',
            participations:{
                1:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                2:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                3:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                4:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                },
                5:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                }
            }
        }
    },
    competitors:{
        1:{
            startNum:69,
            name:'Martin Larsen',
            club:'Moss IL',
            present:false
        },
        2:{
            startNum:69,
            name:'Sebastian Søberg',
            club:'Moss IL',
            present:false
        },
        3:{
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        4:{
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        5:{
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        }
    }
};

setInterval(addDiscipline, 2000);

function addDiscipline() {
    var discipline = {
        name:'Discipline ' + state.disciplines.length,
        description:''
    };

    state.disciplines.push(discipline);
    dist.setObject(state);
}

addDiscipline();
