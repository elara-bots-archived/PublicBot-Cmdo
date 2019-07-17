const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "imgtfy",
            memberName: "imgtfy",
            aliases: ["google"],
            examples: [`${client.commandPrefix}imgtfy google it`],
            description: "Makes a IMGTFY gif of the text you give",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What do you want the imgtfy gif to say?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let url = await new URLSearchParams(content)
        let e = new Discord.MessageEmbed()
            .setDescription(`https://lmgtfy.com/?q=${url}`)
            .setColor(message.guild.color)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
        message.say(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}