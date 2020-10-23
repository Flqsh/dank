const Command = require('../../Structures/Command');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Sets the topic of a channel.',
            usage: '<topic>',
            args: false,
            botPerms: ['MANAGE_CHANNELS'],
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(message, args) {
        if (!args[0]) {
            message.channel.startTyping();
            message.channel.setTopic('', `Topic command issued by ${message.author.tag}.`).then(message.channel.stopTyping(true));

            message.channel.send(`Reset the channel topic.\nPlease note: this command has an api ratelimit of 2 times per 10 minutes.`)
            return;
        }
        let topic = args.join(' ');


        if (topic.length > 1024) return message.channel.send('Channel topics must be under 1024 characters.');

        if (topic.includes('`')) return message.channel.send("Topic must not include a '`'.");
        if (topic.includes('\\')) return message.channel.send("Topic must not include a back slash.");

        if (!message.channel) return message.channel.send('Error, cannot find the channel.');
            message.channel.startTyping();
            message.channel.setTopic(topic, `Topic command issued by ${message.author.tag}.`).then(message.channel.stopTyping(true));

            message.channel.send(`Set the topic to \`${topic}\`.\nPlease note: this command has an api ratelimit of 2 times per 10 minutes.`)
    }
};