const Command = require('../../Structures/Command');
const { exec } = require('child_process');
const { stderr } = require('process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exec'],
			description: 'Executes a console command.',
            category: 'Admin',
            usage: '<query>',
            ownerOnly: true,
            args: true
		});
	}

	async run(message, args) {
        exec(args.join(' '), (error, stdout) => {
            const response = stdout || error;
            message.channel.send(response, { split: true, code: true })
        })
	}
};