const { Command } = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            memberName: "unmute",
            aliases: ["unsilence", "uncalm"],
            examples: [`${client.commandPrefix}unmute @user/userid`],
            description: "Unmutes a member",
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_ROLES"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "mod",
            args: [
                {
                    key: "member",
                    prompt: "What member do you want me to mute?",
                    type: "member"
                },
                {
                    key: "reason",
                    prompt: "What is the reason for the unmute?",
                    type: "string",
                    default: ""
                }
            ]
        })
    }
    async run(message, { member, reason }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let muterole = message.guild.roles.find(r => r.name === "Muted") || message.guild.roles.find(r => r.name === "muted");
        if(!member.roles.has(muterole.id)) return message.channel.send(`${this.client.util.emojis.nemoji} ${member.user.tag} isn't muted!`);
        
        await member.roles.remove(muterole.id);
        message.channel.send(`${this.client.util.emojis.semoji}***${member.user.tag} Has been unmuted!***`);
        message.delete().catch();
         let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`Action: Unmute`)
        .setColor('#FF000')
        .setDescription(`${member} \`@${member.user.tag}\` (${member.user.id})`)
        .addField(`\u200b`, `
        **Moderator: **${message.author} (${message.author.id})
        ${reason === '' ? "" : `**Reason: **${reason}`}
        `)
        .setTimestamp()
        return this.client.f.logging(this.client, 'actionlog', message.guild, e)
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}
