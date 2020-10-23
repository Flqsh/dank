const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
            category: 'Admin',
            ownerOnly: true
		});
	}

	async run(message, args) {
        return;
        const embed = new MessageEmbed()
        .setTitle('test');
        message.channel.send(embed);

    }
};