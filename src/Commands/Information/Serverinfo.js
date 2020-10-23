const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydney: 'Sydney',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West (The best region)',
	'us-south': 'US South'
};

module.exports = class extends Command {

    constructor(...args) {
		super(...args, {
			aliases: ['si', 'guildinfo'],
			description: 'Displays information about the server.',
			category: 'Information'
		});
	}

    async run(message) {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;

        const embed = new MessageEmbed()
			.setDescription(`Server Info for **${message.guild.name}**`)
			.setColor('BLUE')
			.setThumbnail(message.guild.iconURL())
			.addField('General', [
                `**❯ Name:** ${message.guild.name}`,
                `**❯ Guild ID:** ${message.guild.id}`,
                `**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.owner.user.id})`,
                `**❯ Voice Region:** ${regions[message.guild.region]}`,
                `**❯ Boost Level:** ${message.guild.premiumTier ? `Level ${message.guild.premiumTier}` : 'None (0)'}`,
                `**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
                `**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
                `**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
                '\u200b'
            ])
            .addField('Statistics', [
                `**❯ Role Count:** ${roles.length}`,
                `**❯ All Emoji Count:** ${emojis.size}`,
                `**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
                `**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
                `**❯ All Member Count:** ${message.guild.memberCount}`,
                `**❯ Human Count:** ${members.filter(member => !member.user.bot).size}`,
                `**❯ Bot Count:** ${members.filter(member => member.user.bot).size}`,
                `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
                `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
                `**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
                '\u200b'
            ])
            .addField('Presence', [
                `**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
                `**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
                `**❯ DnD:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                `**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
                '\u200b'
            ])
            .addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None')
            .setTimestamp();
        message.channel.send(embed)
    }
};