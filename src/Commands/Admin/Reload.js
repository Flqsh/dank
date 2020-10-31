const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Reloads all the commands.',
			category: 'Admin',
			aliases: ['r'],
			ownerOnly: true
		});
	}

	async run(message) {
		this.client.utils.loadCommands()
			.then(() => message.channel.send(`Reloaded all the commands!`))
			.catch(err => message.channel.send(`There was a error trying to load the commands!\n**Error:**\`\`\`xl\n${err}\n\`\`\``));
	}

};