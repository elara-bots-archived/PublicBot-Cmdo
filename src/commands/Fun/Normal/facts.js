const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "fact",
            memberName: "fact",
            aliases: [`randomfact`, `random-fact`],
            examples: [`${client.commandPrefix}fact`],
            description: "Gives a random fact.",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            await message.channel.startTyping(1);
            let api = await this.client.f.API('facts')
            if(!api) return message.channel.send(`Couldn't fetch a fact :(`)
            let e = new MessageEmbed()
            .setTitle(`FACT!`)
            .setDescription(api.facts[Math.floor((Math.random() * api.facts.length))])
            .setColor(message.guild.color);
            return message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}