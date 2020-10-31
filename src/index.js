const mainClient = require('./Structures/mainClient');

const config = require('./../config.json');
const client = new mainClient(config);

client.start();