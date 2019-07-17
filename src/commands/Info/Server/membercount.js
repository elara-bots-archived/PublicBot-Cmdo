const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "membercount",
            memberName: "membercount",
            aliases: ["mc"],
            examples: [`${client.commandPrefix}mc`],
            description: "Gives you the membercount for your server.",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let serverSize = await message.guild.memberCount;
        let botCount = await message.guild.members.filter(m => m.user.bot).size;
        let humanCount = await serverSize - botCount;
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL() ? message.guild.iconURL() : "https://cdn.discordapp.com/emojis/483118381650804747.gif")
            .setColor(message.guild.color)
            .setTimestamp()
            .addField(`Total`, `**${serverSize}**`, true)
            .addField(`Humans`, `**${humanCount}**${message.guild.members.get("248947473161256972") ? `\n**1.** ${message.guild.members.get("248947473161256972").displayName}` : ""}`, true)
            .addField(`Bots`, `**${botCount}**`, true)
            .addField(`Member Status`, `**${message.guild.members.filter(o => o.presence.status === 'online').size}** Online\n** ${message.guild.members.filter(i => i.presence.status === 'idle').size}** Idle\n**${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}** DND\n**${message.guild.members.filter(off => off.presence.status === 'offline').size}** Offline`, true)
        message.channel.send(embed)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}