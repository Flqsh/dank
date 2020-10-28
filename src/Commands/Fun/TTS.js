/*const googleTTS = require('google-tts-api')
const discordTTS = require('discord-tts');*/
const Command = require('../../Structures/Command');
const Discord = require('discord.js')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [],
            category: 'Fun',
            args: true
        });
    }

    async run(message, args) {
        return;/*
        const voiceChannel = message.member.voice.channel;
        let ttsusage = args.join(' ');

        if (!voiceChannel) return message.channel.send('You must be in a voice channel to use this command.');
        if (ttsusage.length > 300) return message.channel.send('Please make text smaller then 300 characters.');
        googleTTS(ttsusage)
        voiceChannel.join().then(connection => {
            const stream = discordTTS.getVoiceStream(ttsusage);
            const dispatcher = connection.play(stream);
            message.react('🔊');
            dispatcher.on('finish', () => voiceChannel.leave())
        });*/
    }
};