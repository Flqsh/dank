const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['h'],
			description: 'Displays all the commands in the bot',
			category: 'Utilities',
			usage: '[command]',
			roleMention: 'false',
		});
	}

	async run(message, [command]) {
		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor(`${message.guild.name}'s Bot Manual`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd) return message.channel.send(`Cannot find command named \`${command}\`.`);
			/*let cdTime = cmd.ratelimit.reset ? `${cmd.ratelimit.reset / 1000}s` : '0s';
			let cdBucket = cmd.ratelimit.bucket ? `${cmd.ratelimit.bucket} time(s)` : '1 time';
			let cdStack = cmd.ratelimit.stack ? cmd.ratelimit.stack : false;

			let cooldown =`**❯ Cooldown:** ⏲️ ${cdTime}, 🔁 ${cdBucket}, <:stackoverflow:762207493992480768> ${cdStack}`
			
			let cd = cmd.ratelimit.reset ? cooldown : '';*/

			embed.setAuthor(`${this.client.utils.capitalize(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
			embed.setDescription([
				`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'None'}`,
				`**❯ Description:** ${cmd.description}`,
				`**❯ Category:** ${cmd.category}`,
				`**❯ Usage:** ${cmd.usage}`,
				//cd
			]);
			return message.channel.send(embed);
		} else {
			embed.setDescription([
				`These are the available commands for ${message.guild.name}`,
				`**Prefix:** \`${this.client.prefix}\``,
				`**Command Parameters:** \`<>\` is required & \`[]\` is optional`,
				'**Command Cooldowns:** ⏲️ Time until a refreshes of cooldown, 🔁 Amount of command uses before cooldown, <:stackoverflow:762207493992480768> If the cooldown renews when command is used on cooldown.'
			]);
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Admin').map(cmd => cmd.category));
			} else {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			}

			for (const category of categories) {
				embed.addField(`**${this.client.utils.capitalize(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}
			return message.channel.send(embed);
		}
	}

};