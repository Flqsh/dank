const Command = require('../../Structures/Command');
const db = require('quick.db');
const defaultt = require('./../../Data/Database/defaultGuildSettings.json')


module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['p'],
            description: 'View or change the prefix.',
            category: 'Utilities'
        });
    }

    async run(message, args) {

        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permission to perform this command.');

        let pref = this.client.guildSettings.has(message.guild.id) ? (
            this.client.guildSettings.get(message.guild.id).prefix
        ) : (
            this.client.utils.setDefaultGuild(message.guild.id),
            this.client.guildSettings.get(message.guild.id).prefix
        );

        switch (args[0]) {
            case 'set':
                if (!args[1]) return message.channel.send('Please specify a prefix to set to.')
                if (args[1].length > 3) return message.channel.send('A prefix can only be 3 characters long at maximum.');
                if (args[1] == pref) return message.channel.send(`\`${pref}\` is already set as this server's prefix.`);


                this.client.guildSettings.set(`${message.guild.id}.prefix`, args[1]);
                let newPref = this.client.guildSettings.get(message.guild.id).prefix;
                console.log(`${message.author.tag} set the prefix of ${message.guild.name} [ ${message.guild.id} ] to '${newPref}' `);
                //}
                return message.channel.send(`This server's prefix is now set to \`${newPref}\`.`)

            default:
                return message.channel.send(`My prefix is currently \`${pref}\`. Use \`${pref}prefix set <prefix>\` to set a prefix.`);

        }
    }
};