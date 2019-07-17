const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "card",
            memberName: "card",
            aliases: ["cards"],
            examples: [`${client.commandPrefix}card`],
            description: "Posts a random card",
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
        let msg = await message.channel.send(`Loading your card...`);
        let api = await this.client.f.API('photos');
        if(!api) return msg.edit(`There was an error while running this command... please try again later.`);
        let result = Math.floor(Math.random() * api.cards.length);
        let embed = new Discord.MessageEmbed()
        .setImage(api.cards[result])
        .setColor(message.guild.color)
        .setAuthor(`Your Card.`, message.author.displayAvatarURL())
        msg.edit(embed);
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}