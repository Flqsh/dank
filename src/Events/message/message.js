const Event = require('../../Structures/Event');
const ms = require('ms');
//const db = require('quick.db');
//const guildsettings = new db.table('guildsettings');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		this.buckets = new Map();
	}

	async run(message) {


		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		//const usedPrefix = guildsettings.has(`guild_${message.guild.id}_prefix`) ? guildsettings.get(`guild_${message.guild.id}_prefix`) : globalPrefix;

		if (!message.guild || message.author.bot) return;

		let pref = await this.client.utils.getPrefix(message.guild.id);

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${pref}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : pref;



		if (!message.content.startsWith(prefix)) return;



		// eslint-disable-next-line no-unused-vars
		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);



		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!this.client.owners.includes(message.author.id)) {
			let remaining = await this._runLimits(message, command);
			if (remaining) {
				remaining = ms(remaining - Date.now(), {
					long: true
				});
				return message.channel.send(`Sorry **${message.author.username}**, you have to wait **${remaining}** before running this command.`);
			}
		}

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

	_timeout(userId, commandName) {
		return () => {
			const bucket = this.buckets.get(`${userId}-${commandName}`);
			if (bucket && bucket.timeout) {
				this.client.clearTimeout(bucket.timeout);
			}

			this.buckets.delete(`${userId}-${commandName}`);
		};
	}

	_runLimits(message, command) {
		if (!command) return;
		const tout = this._timeout(message.author.id, command.name);

		let bucket = this.buckets.get(`${message.author.id}-${command.name}`);
		if (!bucket) {
			bucket = {
				reset: command.ratelimit.reset,
				remaining: command.ratelimit.bucket,
				timeout: this.client.setTimeout(tout, command.ratelimit.reset)
			};

			this.buckets.set(`${message.author.id}-${command.name}`, bucket);
		}

		if (bucket.remaining === 0) {
			if (command.ratelimit.stack) {
				if (bucket.limited) {
					if (bucket.timeout) {
						this.client.clearTimeout(bucket.timeout);
					}

					bucket.reset = (bucket.resetsIn - Date.now()) + command.ratelimit.reset;
					bucket.timeout = this.client.setTimeout(tout, bucket.reset);
				}

				bucket.limited = true;
			}

			if (!bucket.resetsIn) {
				bucket.resetsIn = Date.now() + bucket.reset;
			}

			return bucket.resetsIn;
		}

		--bucket.remaining;
		return null;
	}

}