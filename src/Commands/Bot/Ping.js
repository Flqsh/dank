const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['p', 'pong'],
            description: 'Test the latency of the bot.',
            category: 'Bot',
            guildOnly: false,
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(message) {
        const msg = await message.channel.send('Pinging... Please wait...');

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const ping = Math.round(this.client.ws.ping);
        /*const choices = ['Ping Pong! ', 'I hope my ping is good, if it\'s bad Flash is gonna beat me again...', 'Report bad ping to Flash!', 'epik'];
        const response = choices[Math.floor(Math.random() * choices.length)];*/

        const embed = new MessageEmbed()
        .setTitle('🏓 Pong!')
		.setColor('BLUE')
        .setDescription([
            `Bot Latency: \`${latency}ms\``,
            `API Latency: \`${ping}ms\``
        ])
        .setFooter('Please report high ping to the Bot Developer!')

        msg.edit('', embed)//`Bot Latency: \`${latency}ms\`, API Latency: \`${ping}ms\``);
    }
};