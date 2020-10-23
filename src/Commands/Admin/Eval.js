const { MessageAttachment } = require('discord.js');
const { inspect } = require('util');
const Command = require('../../Structures/Command');
const { Type } = require('@extreme_hero/deeptype');
const sourcebin = require('sourcebin');
const Discord = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            ratelimit: {
                // how many times this command can be ran before getting limited.
                bucket: 1,
                // the time (in milliseconds) before the command can be used again, in this case: seven seconds
                reset: 0,
                // whether the reset time should stack.
                stack: false
            },
            aliases: ['ev', 'exec'],
            category: 'Admin',
            ownerOnly: true
        });
    }

    async run(message, args) {
        const msg = message;
        if (!args.length) return message.channel.send('You must provide something to evaluate.');
        let code = args.join(' ');
        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

        let evaled;
        try {
            const start = process.hrtime();
            evaled = eval(code);
            if (eval instanceof Promise) {
                evaled = await evaled;
            }

            const stop = process.hrtime(start);
            const response = [
                `**Output**: \`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\``,
                `**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
                `**Time:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms \`\`\``
            ]
            const res = response.join('\n');
            if (res.length < 2000) { //<
                await message.channel.send(res)
            } else {
                let output = await sourcebin.create([{
                    name: 'output',
                    content: res,
                    languageId: 'js'
                }], {
                    title: 'Evaluation Output',
                    description: 'Outcome of eval command.'
                });
                output = await sourcebin.shorten(output.url);

                await message.channel.send(output);
            }
        } catch (err) {
            return message.channel.send(`Error: \`\`\`xl\n${this.clean(err)}\n\`\`\``);
        }
    }

    clean(text) {
        if (typeof text === 'string') {
            text = text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(new RegExp(this.client.token, 'gi'), '****')
        }
        return text;
    }
};