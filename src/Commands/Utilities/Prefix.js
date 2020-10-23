const Command = require('../../Structures/Command');
//const db = require('quick.db');
//const guildsettings = new db.table('guildsettings');

module.exports = class extends Command {
    constructor(...args) {
		super(...args, {
			aliases: ['p'],
			description: 'View or change the prefix.',
			category: 'Utilities'
		});
	}

    async run(message, args) {
        return;
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permission to perform this command.');
        if(args[0] != 'set') {
            let pref = guildsettings.has(`guild_${message.guild.id}_prefix`) ? guildsettings.get(`guild_${message.guild.id}_prefix`) : this.client.prefix;
            message.channel.send(`My prefix is currently \`${pref}\`. Use \`${pref}prefix set\` to set a prefix.`);
        } else {
            if (!args[1]) return message.channel.send('Please specify a prefix to set to.')
            if (args[1].length > 3) return message.channel.send('A prefix can only be 3 characters long at maximum.');
            if (args[1] == guildsettings.get(`guild_${message.guild.id}_prefix`)) return message.channel.send(`\`${guildsettings.get(`guild_${message.guild.id}_prefix`)}\` is already set as this server's prefix.`);
            if (args[1] == this.client.prefix) {
                guildsettings.delete(`guild_${message.guild.id}_prefix`);
                console.log(`${message.author.tag} reset the prefix of ${message.guild.name} [ ${message.guild.id} ]`);
            } else {
                guildsettings.set(`guild_${message.guild.id}_prefix`, args[1]);
                console.log(`${message.author.tag} set the prefix of ${message.guild.name} [ ${message.guild.id} ] to '${guildsettings.get(`guild_${message.guild.id}_prefix`)}' `);
            }
            return message.channel.send(`This server's prefix is now set to \`${guildsettings.has(`guild_${message.guild.id}_prefix`) ? guildsettings.get(`guild_${message.guild.id}_prefix`) : this.client.prefix}\`.`)
        }
    }
};