const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "channelinfo",
            memberName: "channelinfo",
            aliases: [`ci`],
            examples: [`${client.commandPrefix}channelinfo #channel`],
            description: "Gives you all of information about the channel you mention",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What channel?",
                    type: "channel",
                    default: message => message.channel
                }
            ]
        })
    }
    async run(message, {channel}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            let c = await this.client.channels.get(channel.id);
            let e = new Discord.MessageEmbed()
            .setAuthor(c.guild.name, c.guild.iconURL())
            .setColor(message.member.displayColor)
            .setTimestamp()
            .setTitle(`Channel Information`)
            .setDescription(`
            **Channel: **${c} \`#${c.name}\` (${c.id})
            - Type: **${c.type.toUpperCase()}**
            - Position: **${c.position}**
            - NSFW: ${c.nsfw ? "**Enabled**": "**Disabled**"}
            - Category: ${c.parentID ? `**${this.client.channels.get(c.parentID).name}**` : "**None**"}
            - Topic: ${c.topic ? c.topic : "**None**"}
            `)
            return message.channel.send(e)
        }catch(e){
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}