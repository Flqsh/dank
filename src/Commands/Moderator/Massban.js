const Command = require('../../Structures/Command');
const Discord = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['mass'],
            description: 'Ban multiple members at once',
            category: 'Moderator',
            usage: '[usage]',
            userPerms: ['BAN_MEMBERS'],
            botPerms: ['BAN_MEMBERS'],
            guildOnly: true,
            args: true,
        });
    }

    run(message, args) {
        
        const banned = [];
        const notBannable = [];
        const notBanned = [];

        let ids = args.join(' ').split(', ');
        let reason;

        if (ids[ids.length - 1].split(' ').length > 1) {
            reason = ids
                .slice(ids.length - 1)[0]
                .split(' ')
                .slice(1)
                .join(' ');

            ids = ids
                .join(' ')
                .replace(reason, '')
                .split(' ')
                .filter(Boolean)
        }

        for (const id of ids) {
            try {
                const member = await message.guild.members.fetch(id);
                if (member && !member.bannable) notBannable.push(id);

                await message.guild.ban(id, `Mass banned by ${message.author.tag}${reason ? ` for ${reason}` : ''}`);
                banned.push(id);
            } catch (e) {
                notBanned.push(id);
            }
        }

        let msg = '';
        if (banned.length > 0) msg += `Banned **${banned.length}** user(s): \`${banned.join(', ')}\`\n`;
        if (notBannable.length > 0) msg += `Could not ban **${notBannable.length}** user(s) as I don't have permissions: \`${notBannable.join(', ')}\`\n`;
        if (notBanned.length > 0) msg += `Could not find **${notBanned.length}** user(s): \`${notBanned.join(', ')}\``;

        message.channel.send(msg || 'No users banned.');
    }
};