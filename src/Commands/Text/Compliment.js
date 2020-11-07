const Command = require('../../Structures/Command');
const Discord = require('discord.js');
const request = require('request');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Send a random compliment',
            category: 'Text',
            guildOnly: false,
		});
	}

	async run(message) {
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

		const { compliment } = await fetch('https://complimentr.com/api').then(compliment => compliment.json()).catch(e => (console.error))

        if (!compliment.length) return ('Error.')



        /*const options = {
            method: 'GET',
            url: 'https://complimentr.com/api',
        };

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        request(options, function (err, response, body) {
            if (err) throw new Error(error);
            
            let text = capitalizeFirstLetter(JSON.parse(body).compliment + '.');

            message.channel.send(`**Random Compliment:**\n${text}`);
        });*/

	}
};