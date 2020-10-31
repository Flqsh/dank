const Command = require('../../Structures/Command');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['up'],
            description: 'Recieve the uptime of the bot.',
            category: 'Bot',
            guildOnly: false,
            botPerms: ['EMBED_LINKS']
        });
    }


    async run(message) {

        const uptime = ms(this.client.uptime, {
            long: true
        });

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`⏲️ Uptime: \`${uptime}\``)
            .setFooter(`Run ${this.client.prefix}botinfo for more information.`)

        message.channel.send(embed);
    }
};