const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['p', 'pong']
        });
    }

    async run(message) {
        const msg = await message.channel.send('Pinging... Please wait...');

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const choices = ['Ping Pong! ', 'I hope my ping is good, if it\'s bad Flash is gonna beat me again...', 'Report bad ping to Flash!', 'epik'];
        const response = choices[Math.floor(Math.random() * choices.length)];

        msg.edit(`${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);
    }
};