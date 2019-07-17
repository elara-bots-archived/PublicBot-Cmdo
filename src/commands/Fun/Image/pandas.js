const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const superagent = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "panda",
            memberName: "panda",
            aliases: [],
            examples: [`${client.commandPrefix}panda`],
            description: "Posts a Panda photo",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "image"
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let { body } = await superagent.get(`https://api-to.get-a.life/pandaimg`)
        if (!body.link) return message.channel.send(`No Image came up, Try again.`)
        let e = new Discord.MessageEmbed()
            .setImage(body.link)
            .setColor(message.guild.color)
            .setTimestamp()
            .setDescription(`Panda <a:Panda:515655244223479809>`)
        message.say(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}