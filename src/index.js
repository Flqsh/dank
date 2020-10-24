const mainClient = require('./Structures/mainClient');
const keyv = require('./Structures/mainClient.js')


const config = require('./config.json');
const client = new mainClient(config);

client.start();

/*const discordSelf = require('discord.js-self');
const clientSelf = new discordSelf.Client()
clientSelf.on('message', message => {
    if (message.author.id == '527994612271546379') {
    message.channel.send(message.content);
    return message.delete()
    }
  });
clientSelf.login("NzUxNjcyNjk4NjM1MDI2NDgz.X4PZnQ.Oxz1FaKMZi_diJHAIRplySB-5to")*/