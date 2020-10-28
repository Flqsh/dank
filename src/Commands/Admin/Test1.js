const Command = require('../../Structures/Command');
const sourcebin = require('sourcebin');
const { MessageAttachment } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
            category: 'Admin',
            ownerOnly: true
		});
	}

	async run(message, args) {

        const response = [
            '**Output**: \`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\`',
            '**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\`',
            '**Time:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms \`\`\`'
        ]
        
        const res = response.join('\n');
        let text;
        text = await sourcebin.create([
            {
                name: 'output',
                content: res,
                languageId: 'js'
            }
        ], {
          title: 'Evaluation Output',
          description: 'Outcome of eval command.'
        }).catch(console.error);
        
        message.channel.send(text.url);
    }
};