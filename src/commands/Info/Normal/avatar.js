const { Command } = require('elaracmdo');
const Discord = require('discord.js');
module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            memberName: "avatar",
            group: "info",
            description: "Shows user's avatar.",
            examples: [`${client.commandPrefix}avatar`],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want the profile photo from?",
                    type: "user",
                    default: message => message.author
                }
            ]
        });
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setAuthor(user.tag, user.displayAvatarURL())
            if(message.author.id !== user.id){e.setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL())}
            e.setDescription(`[Avatar](${user.displayAvatarURL({size: 2048})})`).setImage(user.displayAvatarURL({size: 2048}))
            return message.channel.send(e)
        }catch(e){
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}