const Command = require('../../Structures/Command');
const fetch = require('node-fetch');
const { Util } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['djs', 'd.js', 'js'],
            description: 'Recieve information from the discord.js documentaion.',
            category: 'Utilities',
            usage: '<searchQuery>',
            args: true,
            botPerms: ['ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }

    async run(message, ...query) {
        const url = `https://djsodcs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

        const docFetch = await fetch(url);
        const embed = await docFetch.json();

        if (!embed || embed.error) {
            return message.reply(Util.removeMentions(`"${query}" couldn't be located within the discord.js documentation (<https://discord.js.org/>).`));
        }

        if (!message.guild) {
            return message.channel.send({
                embed
            })
        }

        const msg = await message.channel.send({
            embed
        });
        msg.react('🗑')

        let react;
        try {
            react = await msg.awaitReactions(
                (reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id, {
                    max: 1,
                    time: 1000,
                    errors: ['time']
                }
            );
        } catch (err) {
            msg.reactions.removeAll();
        }

        if (react && react.first()) msg.delete();

        return message;
    }
};