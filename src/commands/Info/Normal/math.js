const { Command } = require('elaracmdo'),
    Discord = require('discord.js'),
    math = require('mathjs');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "math",
            memberName: "math",
            aliases: [],
            examples: [`${client.commandPrefix}math 1+1`],
            description: "Gives you the answer to the math question you ask.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What math calculation do you want the answer for?',
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
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            e.setTitle(`Loading...`)
            let msg = await message.channel.send(e)
        try {
            let r = await math.eval(content)
            e.setTitle(`Math Calculation`).addField(`Input`, content, false).addField(`Output`, r, false)
            return msg.edit(e)
        } catch(error) {
            e.setTitle(`ERROR`).setDescription(`Please provide a valid calculation.`).setColor(`#FF0000`)
            return msg.edit(e)
             }
    }catch(e){
        this.client.error(this.client, message, e);
   this.client.f.logger(this.client, message, e.stack)
    }
    }
}