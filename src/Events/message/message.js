const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
	}

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;

		let pref = this.client.prefix;

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${pref}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : pref;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (command) {
			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) return message.reply('this command is only accessible by Bot Administrators.');
			if (command.guildOnly && !message.guild) return message.reply('this command can only be used in a discord server.');
			if (command.nsfw && !message.channel.nsfw) return message.reply('this command can only be used in a NSFW channel.');
			if (command.args && !args.length) return message.reply(`this command requires arguments. Usage: \`${command.usage ? command.usage : 'This command doesn\'t have a usage format.'}\`.`)
			//if (command.roleMention && !message.mentions.roles) return message.reply('I\'d rather not be used to raid.');

			const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;

			if (message.guild) {
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						return message.reply(`you are missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms)).replace('_', ' ')} permssions.`)
					}
				}

				const botPermCheck = command.userPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(botPermCheck);
					if (missing.length) {
						return message.reply(`I am missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permssions.`)
					}
				}
			}
			command.run(message, args);
		}
	}
}