#!/usr/bin/env node

var http = require('http');
var express = require('express');

// --- Configuration ---
var PORT = 80;

// --- Setup express ---
var app = express();

app.use(express.static(__dirname));

var server = http.createServer(app);
server.listen(PORT);
