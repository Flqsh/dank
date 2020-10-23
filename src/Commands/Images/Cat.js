const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const subreddits = [
    'cat',
    'cats',
    'catpics',
    'kittens'
];

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Displays information about the bot.',
            description: 'Request a funny cat pic from reddit.',
            category: 'Images',
        });
    }

    async run(message) {
        let reddit = subreddits[Math.floor(Math.random() * subreddits.length)];
        const data = await fetch(`https://imgur.com/r/${reddit}/hot.json`)
            .then(response => response.json())
            .then(body => body.data);
        const selected = data[Math.floor(Math.random() * data.length)];
        const embed = new MessageEmbed()
            .setTitle(reddit)
            .setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
            .setFooter(`Requested by: ${message.author.tag}`)
            .setTimestamp();
        return message.channel.send(embed);
    }
};