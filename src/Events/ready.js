const Event = require('../Structures/Event');
const { Client } = require('discord.js');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }
    
    run() {
        console.log([
            `Logged in as ${this.client.user.tag}`,
            `Loaded ${this.client.commands.size} commands!`,
            `Loaded ${this.client.events.size} events!`
        ].join('\n'));
    
        const activities = [
            'Justa be dumb',
            'Dank Society',
            'Flash be cool',
            'Dank Society',
            'alts are bad',
            'contact staff for support',
            'Dank Society'
        ];

        let i = 0;
        this.client.user.setStatus('dnd')
        setInterval(() => this.client.user.setActivity(`${activities[i++ % activities.length]} | ${this.client.prefix}help`, { type: 'WATCHING' }), 15000)


        //this.client.user.setActivity('discord.js', { type: 'WATCHING' } );

    }
}