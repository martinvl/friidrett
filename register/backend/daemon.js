#!/usr/bin/env node

var http = require('http');
var path = require('path');
var express = require('express');
var io = require('socket.io');
var ObjDist = require('objdist');
var DBManager = require('../../private_server/DBManager');

// --- Configuration ---
var PUBLIC_PORT = 80;
var PRIVATE_PORT = 8889;
var DATA_PREFIX = 'friidrett';

// --- Setup express ---
var app = express();

var frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

var server = http.createServer(app);
server.listen(PUBLIC_PORT);

// --- Setup socket.io ---
var public_transport = io.listen(server);

public_transport.set('log level', 0)
public_transport.disable('browser client');

var private_transport = io.listen(PRIVATE_PORT);
private_transport.set('log level', 0)

// --- Setup distibution ---
var dist = new ObjDist(public_transport, {prefix:DATA_PREFIX});

// --- Setup DB manager ---
var dbManager = new DBManager();

dbManager.on('update', function () {
    dist.setObject(dbManager.competitions[1]);
    console.dir(dbManager.competitions[1]);
});

private_transport.on('connection', function (socket) {
    socket.on('saveParticipation', function (payload) {
        console.dir('save');
        //console.dir(payload);

        dist.setObjectForKeypath(payload.participation, 'events/' + payload.eventId + '/participations/' + payload.competitorId);
        dbManager.updateParticipation(payload.competitorId, payload.eventId, payload.participation);
    });
});
