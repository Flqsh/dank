const Command = require('../../Structures/Command');
const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const sourcebin = require('sourcebin');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'N/A',
            usage: '<role mention/name>',
            args: true,
        });
    }

    async run(message, args) {
        let role = message.mentions.roles.first();

        if (!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(' ').toLowerCase()));
        if (!role) role = message.guild.roles.cache.find(r => r.id == args[0]);
        if (!role) return message.reply('that role does not exist!');

        let arr = new Array();

        role.members.forEach(user => {
            arr.push(user.user.tag);
        });

        let array = arr;
        arr = arr.join('\n');

        let finalString = arr;
        let final = finalString;


        if (arr.length > 2048) {
            finalString = await sourcebin.create([{
                name: 'dump.txt',
                content: arr,
                languageId: 'text'
            }], {
                title: 'Dump Output',
                description: 'Outcome of dump command.'
            });
            finalString = finalString.url;

            final = `[Click to view role members](${finalString})`
        } else {
            finalString = arr;
            final = finalString;
        }


        const embed = await new Discord.MessageEmbed()
            .setTitle(`Users with ${role.name}`)
            .setAuthor(`${array.length} members`)
            .setDescription(final)
            .setColor(role.color || 'BLUE')
            .setFooter(`ID: ${role.id} • Created ${moment(role.createdTimestamp).fromNow()}`)

        message.channel.send(embed);
    }
};