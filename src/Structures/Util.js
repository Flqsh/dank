const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
//const db = require('quick.db');
const Command = require('./Command.js');
const Event = require('./Event.js');
const fs = require('fs');
const defaultGuild = require('../Data/Database/defaultGuildSettings.json')

module.exports = class Util {

    constructor(client) {
        this.client = client;
    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    capitalize(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    async setDefaultGuild(id) {
        if (!this.client.guildSettings.has(id)) await this.client.guildSettings.set(id, defaultGuild);
        return;
    }

    async getPrefix(id) {
        let pref = this.client.guildSettings.has(id) ? (
            this.client.guildSettings.get(id).prefix
        ) : (
            this.client.utils.setDefaultGuild(id),
            this.client.guildSettings.get(id).prefix
        );
        return await pref
    }


    ///^[A-Za-z-. \d]+$/

    englishify(string) {
        const regex = /^[A-Za-z-.\d]+/ //after -.
        return string.replace(regex, '')
        /*const arr = string.split('')
        const finalArr = new Array()
        arr.forEach((letter) => {
            if (regex.test(letter)) {
                finalArr.push(letter)
            }
        });*/
    }

    checkOwner(target) {
        return this.client.owners.includes(target);
    }

    comparePerms(member, target) {
        return member.roles.highest.position < target.roles.highest.position;
    }

    formatPerms(perm) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/ /g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use Voice Activity');
    }

    formatArray(array, type = 'conjunction') {
        return new Intl.ListFormat('en-GB', {
            style: 'short',
            type: type
        }).format(array);
    }

    async loadCommands() {
        return glob(`${this.directory}Commands/**/*.js`).then(Commands => {
            for (const commandFile of Commands) {
                //delete require.cache[commandFile];
                delete require.cache[require.resolve(commandFile)];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesn't belong in Commands.`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
            }
        });
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    async loadEvents() {
        return glob(`${this.directory}Events/**/*.js`).then(Events => {
            for (const eventFile of Events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
                const event = new File(this.client, name.toLocaleLowerCase());
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in the Events directory.`);
                this.client.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        })
    }
};