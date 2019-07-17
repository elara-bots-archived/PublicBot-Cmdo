const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "fortune",
            memberName: "fortune",
            aliases: [],
            examples: [`${client.commandPrefix}fortune`],
            description: "Gives you a fortune",
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
        let result = Math.floor((Math.random() * this.client.util.fortunes.length));
        let color = message.guild.color
        let usernameid = message.author.tag;
        let usernameurl = message.author.avatarURL;
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription("<a:Dots:426956230582599690> Loading the Fortune")

        message.channel.send(embed).then(async message => {
            embed.setColor(color)
            embed.setAuthor(`${usernameid}`, `${usernameurl}`)
            embed.setTitle(`You're Fortune`)
            embed.setDescription(`**${this.client.util.fortunes[result]}**`)
            message.edit(embed)
        })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}