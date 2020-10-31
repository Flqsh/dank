const Command = require('../../Structures/Command');
const killArray = require('../../Data/json/Kill.json');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['murder'],
            description: 'Murder your friends! 😃',
            category: 'Fun',
            usage: '<user>',
            args: true,
        });
    }

    run(message, args) {
        let randomKill = killArray[Math.floor(Math.random() * killArray.length)];

        const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag == args.join(' ')) || message.guild.members.cache.find(m => m.user.username == args.join(' '));

        if (!randomKill) return message.channel.send('Error.');
        if (!member) return message.channel.send('You must mention someone to kill! Unless you want me to kill you, ig that works too...')

        randomKill.includes('$mention') ? randomKill = randomKill.replace('$mention', member.user) : randomKill = randomKill;
        randomKill.includes('$mention') ? randomKill = randomKill.replace('$mention', member.user) : randomKill = randomKill;
        randomKill.includes('$author') ? randomKill = randomKill.replace('$author', message.author) : randomKill = randomKill;
        randomKill.includes('$author') ? randomKill = randomKill.replace('$author', message.author) : randomKill = randomKill;

        message.channel.send(randomKill);

    }
};