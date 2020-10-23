//const Discord = require ('discord.js');
//const {Client, Attachemnt} = require('discord.js');

/* ------------------------

const fs = require("fs");
const { inspect } = require("util");
//const { start } = require('repl');
//const { TIMEOUT } = require('dns');
//const { measureMemory } = require('vm');

bot.reps = require("./reps.json"); // JSON DEFINITION
bot.count = require("./count.json")
bot.commmands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) =>{ // COMMAND HANDLER PART 1
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0){
        console.log("No commands to load!")
        return;
    }

    console.log(`Loading ${jsfiles.length} commands!`)

    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commmands.set(props.help.name, props);
    });
})

bot.on('message', async message=>{ // COMMAND HANDLER PART 2
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(config.prefix)) return;

    let cmd = bot.commmands.get(command.slice(config.prefix.length));
    if(cmd) cmd.run(bot, message, args);

})

bot.on("disconnected", function () { // CLIENT DISCONNECT
    console.error("Client Disconnected!");
  });

bot.on('ready', () =>{ // CLIENT READY
    console.log('The bot is online!');
    bot.user.setActivity("for rule breakers in Dank Society", {type: "WATCHING"});
    console.log(bot.commmands);
})



const clean = text => { // CLEAN FOR EVAL
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

bot.on("message", message => { // EVAL
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    const args = message.content.split(" ").slice(1);
    if (message.content.startsWith(config.prefix + "eval")) {
      if(message.author.id !== "527994612271546379") return message.channel.send("No Perms."); // && message.author.id !== "551889842720604191"
      if(!args[0]){
        const embed = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setTitle("\:x: Error!")
        .setDescription(`\`\`\`js\nNull: You must specify something to evaluate!\n\`\`\``)
        .setTimestamp()
        .setFooter(bot.user.username, message.author.displayAvatarURL());
        return message.channel.send(embed);
      }
      const code = args.join(" ");
      const array = ["os", "drive", "host", "logout", "login", "operating", "system", "wipe", "remove", "config", "token", "process.env"]
      if(code.includes("__os__") || code.includes("token")){
        return message.channel.send("no");
      }
      try {
        let evaled = inspect(eval(code));
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        let hrStart = process.hrtime()
        let hrDiff;
        hrDiff = process.hrtime(hrStart)// for below  , ${code:"xl"}}
        const embed1 = new Discord.MessageEmbed()
        .setTitle("Eval Complete")
        .setColor("00FF00")
        .addField("Evaluated:", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Outcome:", `\`\`\`js\n${evaled}\n\`\`\``)
        .addField("Evaluated in:", `\`\`\`js\n${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms\n\`\`\``)
        .addField("Type:", typeof(evaled)) //called evaled
        .setTimestamp()
        .setFooter(bot.user.username, message.author.displayAvatarURL);
        message.channel.send(embed1);
        console.log(`${message.author.tag} [ID: ${message.author.id}] executed an evalutation in ${message.guild.name} [ID: ${message.guild.id}]:`, code)
      } catch (err) {
            const embed = new Discord.MessageEmbed()
            .setColor("FF0000")
            .setTitle("\:x: Error!")
            .setDescription(`\`\`\`js\n${clean(err)}\n\`\`\``)
            .setTimestamp()
            .setFooter(bot.user.username, message.author.displayAvatarURL);
        message.channel.send(embed);
        console.log(`${message.author.tag} encountered an error in ${message.guild.name}:`, code)
      }
    }
});


bot.on('message', async message=>{ // AUTO REACT
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.channel.id === '701353851747303485'){
        message.react('722270540680921128');
    }
})

bot.on('message', async message=>{ // AUTO RESPONSE
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.content.toLowerCase().startsWith("ree")){
        message.channel.send("REEEE")
    }
    if(message.content.toLowerCase().startsWith("pls rob")) return message.channel.send("try running the command again, but this time actually mention someone to steal from");
    if(message.content.toLowerCase() === "f") return message.channel.send("f");
    if(message.content.toLowerCase() === "no u" || message.content.toLowerCase() === "nou") return message.channel.send("no u");
})




bot.on('guildMemberAdd', member =>{
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === "701353851558821958")
    if(!welcomeChannel) return console.log('ERROR FINDING welcomeChannel');

    const joinMessage = new Discord.MessageEmbed()
    .setAuthor(`${member.displayName} has joined ${member.guild.name}!`,member.user.displayAvatarURL())
    .setTitle('__**Welcome!**__')
    .setColor('4A90E2')
    .setDescription(`Welcome ${member} to **${member.guild.name}**!\nYou are our ${member.guild.memberCount}th member! To get yourself some roles head to <#701353851558821967>, or to chat with some awesome dankers, just head straight to chat!`)
    .setImage('https://ak3.picdn.net/shutterstock/videos/1006819783/thumb/6.jpg')
    .setFooter('We hope you enjoy the server!', 'https://cdn.discordapp.com/icons/701353851059437568/a_eaa35a1140f74a807a43fc87d005a0f3.png?size=1024');
    welcomeChannel.send(`<@${member.id}>`, joinMessage);
})

bot.on('message', async message=>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.channel.id !== '740367486737842579') return;
    
    const string = message.content;
    const regex = /^<a?:\w+:\d+>$/;
    const isExisting = regex.test(string);
    if(isExisting === true){   
        message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        message.react('718299518180786249');
        message.react('718299820506349670');
        return;
    }else{
        if(message.author.id === '527994612271546379') return;
        message.delete();
        return;
    }
})

bot.on('message', async message=>{
    if(message.author.id !== '270904126974590976') return;
    if(message.channel.type === "dm") return;
    if(message.channel.id !== '701353852204482560') return;
        if(message.content.endsWith("Join them by typing `JOIN HEIST` in the next 60 seconds!")){
            message.channel.send('Heist Started');
            message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: null });
            setTimeout(function(){
                message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
                message.channel.send('Heist Ended');
           }, 60000);
        }else{
            message.channel.send("incorrect");
        }
})


bot.login(config.token);


//if(message.content.startsWith('<:') && message.content.endsWith('>') || message.content.startsWith('<a:') && message.content.endsWith('>')){
/*bot.on('message', (message) => {
    const muteRole = message.guild.roles.cache.get('701353851097186390')
    const Flash = message.guild.members.cache.find(member => member === '527994612271546379')
    if(message.mentions.members.has(`527994612271546379`)){
        try {
        if(message.author.id !== '527994612271546379'){
            message.member.roles.add(muteRole);
            console.log(`Muted **${message.author.tag}**`);
            message.react('🔇');//message.channel.send(`Muted **${message.author.tag}**`);
            // message.channel.send(`${message.author}, lol get muted noob`)
            // .then(msg => {
            //     msg.delete(500)
            // });
            setTimeout(function(){
                message.member.roles.remove(muteRole);
                console.log(`Unmuted ${message.author.tag}`);
                message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                message.react('🔊');
           }, 10000);
        }else{
            return message.channel.send('lol why would i mute my master')
        }
    } catch (err) {
           const embed = new Discord.MessageEmbed
           .setAuthor('ut o', message.guild.iconURL())
           .setTitle('\:x: Error!')
           .setDescription(err)
           .setFooter('yeah i know, i had to make this embed sexy because its prob gonna show :)', Flash.displayAvatarURL());
           message.channel.send(embed);
           console.log(err);
    }
}
});*/






/*
bot.on('message', (message) => {
    const muteRole = message.guild.roles.cache.get('701353851097186390')
    const Flash = member.guild.members.cache.find(member => member === '527994612271546379')
    if(message.mentions.members.has(`527994612271546379`)){
        try {
        if(message.author.id !== '527994612271546379'){
            message.member.roles.add(muteRole)
            setTimeout(function(){
                message.member.roles.remove(muteRole)
           }, 15000);
        }else{
            return message.channel.send('lol why would i mute my master')
        }
    } catch (err) {
           const embed = new Discord.MessageEmbed
           .setAuthor('ut o', message.guild.iconURL())
           .setTitle('\:x: Error!')
           .setDescription(err)
           .setFooter('yeah i know, i had to make this embed sexy because its prob gonna show :)', Flash.displayAvatarURL());
           message.channel.send(embed);
           console.log(err);
    }
});



/*bot.on('message', async message=>{

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(message.content !== 'startCountInterval()') return;
    if(message.author.id !== '527994612271546379' && message.author.id !== '477168699112161281') return message.channel.send("u no get to use dis lol");

    bot.reps[message.author.id] = {
        count: 1
    }

    setInterval(() => {
        start()
      }, 3000);

      function start() {
        let oldscore = bot.reps[message.author.id].count;
        bot.reps[message.author.id] = {
            count: 1 + oldscore
        }


       fs.writeFile("./count.json", JSON.stringify(bot.count, null, 4), err => {
        if(err) throw err;
        let score = bot.reps[message.author.id].count;
        var number =  score
        message.channel.send(number);
      })
    }

})
bot.on('message', async message=>{
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(message.content !== 'count') return;
    bot.reps[message.author.id] = {
        count: 1
    }
    let count = bot.count[message.author.id].count;
    message.channel.send(count)
})*/











































/*bot.on('voiceStateUpdate', async message=>{
    if(!message.member.voice.channel.join()) return;
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play('./song.mp3');
        if(message.member.join){
        dispatcher.play();
        }

})*/

/*bot.on('message', async message=>{
    //const chan = message.guild.users.find(user => user.id === "645327099141554186")
    //if(message.author.bot) return;
   // if(message.author === "645327099141554186"){
   //// message.channel.send(`<@${message.author.id}> noob`);
    //console.log("noobed");
    //}

    if(message.mentions.roles.has(`703068755478970479`)){ //message.content.includes("<@&703068755478970479>")
        const raidAlertChannel = message.guild.channels.cache.find(channel => channel.id === "732009253463916574")
        const rolePerms = message.guild.roles.cache.get('701353851059437568')
        const raidAlertEmbed = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setTitle("Raid Detected")
        .setDescription(`A raid by ${message.author.tag} has been detected in ${message.channel}`)
        //.addField("Potential Raider's Information:" `Tag: ${message.author.tag}\nID: ${message.author.id}\n${message.author}`)
        .setFooter("Please take the nessasary actions to resolve this case.", "https://thumbs.gfycat.com/DelayedVacantDassie-size_restricted.gif")
        .setThumbnail(`${message.author.avatarURL}`);
        message.channel.send("**RAID DETECTED**");
        raidAlertChannel.send("<@&732010686808457276>", raidAlertEmbed);
        //message.guild.roles.get('701353851059437568').setPermissions(SEND_MESSAGES: false);
        rolePerms.edit({
            permissions: [0]
            }).catch(console.error)
        return;
    }
})*/




/*
      array.forEach(word => {
        args.forEach(arg => {
          if (arg.includes(word)){
            console.log(`~~ALERT~~ ${message.author.tag} [ID: ${message.author.id}] executed a BLACKLISTED evalutation in ${message.guild.name} [ID: ${message.guild.id}]:`, code);
            const embed = new Discord.MessageEmbed()
            .setColor("FF0000")
            .setTitle("\:x: Error!")
            .setDescription(`\`\`\`js\nYour evaluation includes a blacklisted malicious keyword. Cancelled evaluation.\n\`\`\``)
            .setTimestamp()
            .setFooter(bot.user.username, message.author.displayAvatarURL);
            return message.channel.send(embed)
        }
      })
      })*/



/*
bot.on('guildMemberAdd', member =>{
    const joinChannel = member.guild.channels.cache.find(channel => channel.name === "〔😇〕welcoming")
    const welcomeInfo = member.guild.channels.cache.find(channel => channel.name === "〔📝〕welcome-info")
    const verifyChannel = member.guild.channels.cache.find(channel => channel.name === "〔⚠〕verify")
    if(!joinChannel) return;
    if(!welcomeInfo) return;
    if(!verifyChannel) return;

    const joinMessage = new Discord.MessageEmbed()
    .setThumbnail(`${member.user.displayAvatarURL()}`)
    .setTitle('Welcome')
    .setColor(0xFF0000)
    .setDescription(`Welcome *${member}* to **${member.guild.name}**!\nVerify yourself in **${verifyChannel}** and recieve full access to ${member.guild.name}.\nPlease read **${welcomeInfo}** for Information!`);
    joinChannel.send(joinMessage);
    verifyChannel.send(`${member}`).then(a_msg => { a_msg.delete(5000); });
})
*/


    //let args = message.content.substring(PREFIX.length).split(" ");

    //var randomColor = Math.floor(Math.random()*16777215).toString(16);
    // -----------------------------
    /*
    if(message.content.includes("<@&703068755478970479>")){
        const raidAlertChannel = message.guild.channels.cache.find(channel => channel.id === "732009253463916574")
        const rolePerms = message.guild.roles.cache.get('701353851059437568')
        const raidAlertEmbed = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setTitle("Raid Detected")
        .setDescription(`A raid by ${message.author.tag} has been detected in ${message.channel}`)
        //.addField("Potential Raider's Information:" `Tag: ${message.author.tag}\nID: ${message.author.id}\n${message.author}`)
        .setFooter("Please take the nessasary actions to resolve this case.", "https://thumbs.gfycat.com/DelayedVacantDassie-size_restricted.gif")
        .setThumbnail(`${message.author.avatarURL}`);
        message.channel.send("**RAID DETECTED**");
        raidAlertChannel.send("<@&732010686808457276>", raidAlertEmbed);
        //message.guild.roles.get('701353851059437568').setPermissions(SEND_MESSAGES: false);
        rolePerms.edit({
            permissions: [0]
            }).catch(console.error)

        //message.author
        return;
    }
    // -----------------------------
    */
    //switch(args[0]){
        /*
        case 'resolve':
            if(!message.member.roles.cache.find(r => r.id === "701353851172683838")){
                return message.channel.send("No Perms")
            }else{
                const sendChannel = message.guild.channels.cache.find(channel => channel.id === "732009253463916574")
                const unlockEmbed = new Discord.MessageEmbed()
                .setColor("00FF00")
                .setTitle("Resolved")
                .setDescription("The raid has been resolved by a Staff Member.")
                .setFooter(`${message.author.tag} has resolved this case.`, "https://toppng.com/uploads/preview/download-transparent-check-mark-gif-11562855141yrviuuu1dd.png");
                sendChannel.send(unlockEmbed);
                return message.channel.send(unlockEmbed);
            }*/
        //case 'exec':
          //  Discord.execute(args)
          //  return message.channel.send(error)
        /*case 'roll':
            const channelOne = message.guild.channels.cache.find(channel => channel.name === "🎰│event¹")
            if(message.channel!=channelOne){
                const denyEmbed = new Discord.MessageEmbed()
                .setColor(`${randomColor}`)
                .setTitle("Random Roll")
                .setDescription("You can not use this here!");
                return message.channel.send(denyEmbed)
            }else{
                if(!(args[1])){
                    const invalidEmbed = new Discord.MessageEmbed()
                    .setColor(`${randomColor}`)
                    .setTitle("Random Roll")
                    .setDescription("Please specify a number to roll!");
                    return message.channel.send(invalidEmbed)
                }else{
                    if(isNaN(args[1])){
                        const nanEmbed = new Discord.MessageEmbed()
                        .setColor(`${randomColor}`)
                        .setTitle("Random Roll")
                        .setDescription("It must be a number smartass");
                        return message.channel.send(nanEmbed)
                    }else{
                        //message.channel.send(`${Math.floor(Math.random() * ((args[1]) - 0 + 1)) + 0}`);
                        var random = Math.floor(Math.random() * ((args[1]) - 0 + 1)) + 0
                        const Embed = new Discord.MessageEmbed()
                        .setColor(`${randomColor}`)
                        .setTitle("Random Roll")
                        .setDescription(`${random}`);
                        console.log(`${message.author.username} rolled ${random} in ${message.channel.name}`)
                        return message.channel.send(Embed)

                    }
                }
            }
        case 'roledelete':
            if(!message.member.hasPermission("MANAGE_ROLES")){
                return message.channel.send("No Perms")
            }else{
                const roleDel = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r=>r.name==args[1])
                if(!roleDel) return message.channel.send("Please specify a valid role.")
                message.channel.send(`Deleted the role **${roleDel.name}**.`)
                console.log(`${message.author.username} deleted ${roleDel.name} at ${message.createdTimestamp}`)
                return roleDel.delete();
            }
        case 'dumpdelete':
            const agree = "✅"
            const disagree = "❌"
            if(!message.member.hasPermission("MANAGE_ROLES")){
                return message.channel.send("No Perms")
            }else{
                const rolee = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r=>r.name==args[1])
                if(!rolee) return message.channel.send("Please specify a valid role.")
                if(rolee.members.size>=1){
                    message.channel.send("That role has someone in it.")
                }else{
                    let msg1 = await message.channel.send("This role is empty, do you want to delete it? You have 3 seconds to respond.")
                    await msg1.react(agree)
                    await msg1.react(disagree)

                    const reactions = await msg1.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 3000}); //
                    if(reactions.get(disagree).count>=2){
                        message.channel.send(`Role deletion ended. You reacted with ${disagree}.`)
                    }
                    //if((reactions.get(disagree).count && reactions.get(agree).count)==2) return message.channel.send("Role deletion ended. You reacted with both.")
                    if(reactions.get(agree).count>=2){
                        message.channel.send(`Deleted the role **${rolee.name}**.`)
                        console.log(`${message.author.username} deleted ${rolee.name} at ${message.createdTimestamp} using dumpdelete`)
                        return rolee.delete();
                    }
                    //if(!reactions.get(agree).count) return message.channel.send("fail")
                    //message.channel.send(`${reactions.get(agree).count}`)
                    return console.log(reactions)
                }
            }*/
    //}// end of cases




/*
bot.on('message', async message=>{

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            const msg = await message.channel.send('Pinging...');

            msg.edit(`Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency ${Math.round(bot.ws.ping)}ms`);
            break;






        case 'decancer':


        let text = words.slice(1).join(' ');
        let member;
        if (/\d{17,21}/.test(words[1])) {
            let user = await bu.getUser(msg, words[1]);
            if (user) {
                member = msg.guild.members.get(user.id);
                if (member) text = member.nick || member.user.username;
                else text = user.username;
            }
        }
        let original = text;
        let isStaff = await bu.isUserStaff(msg.author.id, msg.guild.id);
        let nickChanged = false;
        let output = '';
        text = bu.decancer(text);
        if (isStaff && member) {
            try {
                await member.edit({ nick: text }, 'Decancer');
                nickChanged = true;
            } catch (err) { }
        }
        if (nickChanged)
            output = `Successfully decancered **${bu.getFullName(member.user)}**'s name to: \`${text}\``;
        else
            output = `The decancered version of **${original}** is: \`${text}\``;
        await bu.send(msg, output);
    }
}

*/



        //case 'say':
        //    if(message.deletable) return message.delete();
//
        //    if(!(args[1])){
        //        message.reply("Please specify a message to send!");
        //        break;
         //   }


        //    if(args[1].toLowerCase() === "embed") {
        //        const embed = new Client.MessageEmbed()
        //        .setColor(0xFF0000)
        //        .setDescription(args.slice(2).join(" "));
        //        message.channel.send(embed);
        //        break;
         //   }else{
         //       message.channel.send(args.slice(1).join(" "));
         //       break;
         //   }
        //case 'gay':
        //    const attachment = new Discord.MessageAttachment('https://previews.123rf.com/images/fusssergei/fusssergei1711/fusssergei171100484/89445828-trims-in-rainbow-colors-colorful-wooden-background-gay-flag-.jpg')
        //    // Send the attachment in the message channel
        ////    message.channel.send(attachment)
        //    break;
//        case 'kick':
 //           const kUser = message.guild.member(message.mentions.users.first());
//            if(!kUser) return message.channel.send("Can't find user!")
//            const kReason = args.join(" ").slice(22);
//            if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, you can't kick this user!")
            //if(kUser.id = '527994612271546379')
//
//            const kickEmbed = new Discord.MessageEmbed()
//            .setTitle("KICK")
//            .setColor("e56b00")
//            .addField("Kicked User:", `${kUser} with ID ${kUser.id}`)
//            .addField("Kicked By:", `<@${message.author.id}> with ID ${message.author.id}`)
//            .addField("Kicked In:", message.channel)
//            .addField("Time:", message.createdAt)
//            .addField("Reason:", kReason);
//            message.channel.send(kickEmbed);
//
 //           message.guild.member(kUser).kick(kReason);
 //           break;
        //case 'rob':
        //    if(!(args[1])){
        //        message.channel.send("try running the command again, but this time actually mention someone to steal from");
        //        return;
        //    }else{
        //        message.channel.send(`You stole a MASSIVE portion! :money_mouth:\nYour payout was **${Math.floor(Math.random() * (999 - 100) ) + 100},${Math.floor(Math.random() * (400 - 100) ) + 100}** coins.`)
        //        return;
        //    }

        //case 'bal':
            //const sarahWallet = "sarah'swalletvar"
            //const sarahBank = "sarah'sbankvar"
            //const flashWallet = "245,375"
            //const flashBank = "221,921/272,426"
            //if(!(args[1])){
             //   var name = message.author.username
            //}else{
             //   var name = args[1]
             //   break;
            //}
            //if(message.author.id = (527994612271546379 || 673722043694317597)){
             //   if(message.author.id = 527994612271546379){
            //        const balEmbedFlash = new Discord.MessageEmbed()
            //        .setTitle(`${name}'s balance`)
            //        .setDescription(`**Wallet**: ${flashWallet}\n**Bank**: ${flashBank}`)
            //        .setFooter("dankmemer.lol/premium 😏");
            //        message.channel.send(balEmbedFlash);
             //       console.log(`${message.author.username} ran a balance command!`);
           //         return;
            //    }else if(message.author.id = 673722043694317597){
            //        const balEmbedSarah = new Discord.MessageEmbed()
            //        .setTitle(`${name}'s balance`)
            //        .setDescription(`**Wallet**: ${sarahWallet}\n**Bank**: ${sarahBank}`)
             //       .setFooter("dankmemer.lol/premium 😏");
             //       message.channel.send(balEmbedSarah);
            //        console.log(`${message.author.username} ran a balance command!`);
             //       return;
             //   }else{
            //        message.channel.send("Error! *You like my error messages ;)*");
            //    }
            //}else{
            //    const balEmbed = new Discord.MessageEmbed()
            //    .setTitle(`${name}'s balance`)
             //   .setDescription("**Wallet**: 331,500\n**Bank**: 0/172,491")
             //   .setFooter("dankmemer.lol/premium 😏");
             //   message.channel.send(balEmbed);
             //   console.log(`${message.author.username} ran a balance command!`);
             //   return;
            //}

        //case 'use':
          //  if(!(message.content = "v")){
        //        message.channel.send("Error! *You like my error messages ;)*");
        //    return;
        //    }else{
         //   const reversalMessage = "You haven't been stolen from by anybody within the last 20 minutes."
          //  message.channel.send(reversalMessage);
        //    return;
         //   }
         //case 'user':
            //if(message.author.hasPermission("ADMINISTRATOR")){
         //       if(!(args[2])){
        //            message.channel.send("Please enter a valid User ID in your second argument!")
         //           return;
      ///          }else{
  //                  if(!(args[2])){
        ///                message.channel.send("Please enter a valid repeating amount!");
      ///                  return;
       ////             }else{
       ///                 function repeat(func, times) {
       ///                     for (x = 0; x < times; x++) {
           //                   eval(func)
            //                }
       //                   }
         //           }
                    //message.channel.send(`<@${(args[1])}>`);
                    //string.repeat(args[2]);
         //       }
            //}else{
            //    message.channel.send("You do not have permission to use this command!");
            //}
        // ping user 527994612271546379 5
            //   0          1           2
            //case 'role':

      //          }else if((args(1) == 'role')){
                 //   if(!(args(2))){
         //               message.channel.send("Please enter a valid User ID in your third argument!");
        //                return;
       // //            }else{
      //                  message.channel.send("");
       //             }
               // }else{
      //              message.channel.send("Please specify 'role' or 'user' in your second argument!");
      ////              return;
        //        }
      //          return;
      //      }
        //}else{
        //    message.channel.send("You do not have permission to use this command!");
        //    return;
        //}
      //  }
        //switch args
           //message.author.avatar
