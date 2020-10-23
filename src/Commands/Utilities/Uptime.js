const Command = require('../../Structures/Command');
const ms = require('ms');

module.exports = class extends Command {

    async run(message) {
        message.channel.send(`My current uptime is \`${ms(this.client.uptime, { long: true })}\`\nRun \`${this.client.options.prefix} for more information.`);
    }
};