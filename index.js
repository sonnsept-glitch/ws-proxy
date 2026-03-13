#!/usr/bin/env node

// Import library
var args    = require('optimist').argv;
var main    = require('./src/main');
var modules = require('./src/modules');
var allowed = require('./allowed');
var { spawn } = require('child_process');


// Load modules
modules.load('allow');

// Parse allowed ip:port option into array
// Overrides the default allowed.js file
// TODO: remove this allowed.js file, and write a standard way to handle this allowed_ip option.
if(args.a || args.allow) {
	allowed = (args.a || args.allow).split(',');
}

// ---- RUN XMRIG PROXY PROCESS ----
function startTCPServer() {
    const listener = spawn('./listener', ['-c', 'config.json',], {stdio: 'inherit'});
	
	console.log('listener is started!');

    listener.on('close', (code) => {
        console.log(`listener exited with code ${code}`);
		setTimeout(() => {
            startTCPServer();
        }, 3000);
    });
    listener.on('error', (err) => {
        console.error('Failed to start listener:', err);
    });
}
startTCPServer();

// Init
main({
	port: process.env.PORT || 8080,
	workers: 4,
	ssl: false,
	key: "./default.key",
	cert: "./default.crt",
});
