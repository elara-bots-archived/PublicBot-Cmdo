const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dice",
            memberName: "dice",
            aliases: ["diceroll", "roll", "rolldice"],
            examples: [`${client.commandPrefix}dice`],
            description: "Rolls the dice",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "fun"
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        message.say(`:game_die: **${message.author.username}**, you rolled a **${Math.floor(Math.random() * 10) + 1}**!`);
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}