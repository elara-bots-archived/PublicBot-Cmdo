const {Command} = require('elaracmdo'),
       Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            memberName: "8ball",
            aliases: ["8b"],
            examples: [`${client.commandPrefix}8ball Does this work?`],
            description: "Ask a question",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "ball",
                    prompt: "What do you want to ask the magic 8ball",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { ball }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let msg = await message.channel.send(`Asking the Magic 8ball..`);
        let api = await this.client.f.API('ball');
        if(!api) return msg.edit(`There was an error while running this command... please try again later.`);
        let {names, urls} = api;
        let result = Math.floor(Math.random() * names.length);
        let embed = new Discord.MessageEmbed()
        .setTitle(`Question`)
        .setDescription(ball)
        .addField(`Answer`, names[result], false)
        .setImage(urls[result])
        .setColor(message.guild.color)
        .setAuthor(`The Magic 8ball`, message.author.displayAvatarURL())
        msg.edit(embed);
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
