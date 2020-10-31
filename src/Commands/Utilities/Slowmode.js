const Command = require('../../Structures/Command');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['sm', 'cd'],
            description: 'Sets the slowmode of a channel.',
            usage: '<time>',
            args: false,
            botPerms: ['MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(message, args) {
        let time;
        if (args[0]) {
            if (isNaN(args[0])) {
                time = 0;
            } else {
                if (args[0].startsWith('-')) {
                    return message.channel.send('You cannot set a negative slowmode.')
                } else {
                    time = args[0];
                }
            }
        } else {
            time = 0;
        }
        time = isNaN(time) ? ms(time) : time * 1000;
        time = time / 1000;

        if (time > 21600) return message.channel.send('Slowmode can only be **6 hours** at maximum.');


        let min = time;
        let type = 'seconds';

        if (time > 60) {
            min = time / 60;
            type = 'minutes'
        } else if (time >= 60) {
            min = time;
            type = 'seconds';
        }

        if (!message.channel) return message.channel.send('Error, cannot find the channel.');
        try {
            message.channel.startTyping();
            message.channel.setRateLimitPerUser(time, `Slowmode command issued by ${message.author.tag}.`).then(message.channel.stopTyping(true));
            message.channel.send(`Set the slowmode to **${Math.round(min)} ${type}**.`);
        } catch (e) {
            message.channel.send('Error: ', e);
        }

    }
};