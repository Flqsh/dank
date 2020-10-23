const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Displays information about the bot.',
            category: 'Fun',
            usage: '<message>',
            args: true,
		});
	}

    async run(message, args) {

        function reverse(str) {
            return str.join(' ').split('').reverse().join('');
        }
        let reversed = reverse(args)
        if(message.guild.me.hasPermission('MANAGE_MESSAGES')) message.delete();
        message.channel.send(reversed)        
    }
};