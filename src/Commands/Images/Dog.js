const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const subreddits = [
    'dog',
    'dogs',
    'dogpics',
    'puppies'
];

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Request a cute dog pic from reddit.',
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