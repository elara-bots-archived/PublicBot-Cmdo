const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "googleit",
            memberName: "googleit",
            aliases: [],
            examples: [`${client.commandPrefix}googleit`],
            description: "Posts a google it gif",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "image"
        })
    }
    async run(message){
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setTitle(`GOOGLE IT!!!!`)
            .setImage(`https://vgy.me/vnEMkf.gif`)
        message.channel.send(embed)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
        
    }
}