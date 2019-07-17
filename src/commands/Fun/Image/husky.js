const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "husky",
            memberName: "husky",
            aliases: ["huskys"],
            examples: [`${client.commandPrefix}husky`],
            description: "Posts a husky photo",
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
            let api = await this.client.f.API('photos')
            if(!api) return message.channel.send(`Couldn't fetch a Husky photo :(`);
            let e = new MessageEmbed()
            .setAuthor(`HUSKYS!!!`, 'https://cdn.discordapp.com/emojis/555878813591011338.gif')
            .setImage(api.Husky[Math.floor((Math.random() * api.Husky.length))])
            .setColor(message.guild.color);
            return message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}