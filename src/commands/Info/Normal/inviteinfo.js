const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "inviteinfo",
            memberName: "inviteinfo",
            aliases: [`ii`],
            examples: [`${client.commandPrefix}inviteinfo <Invite Here>`],
            description: "Gives you the infomation on the invite you provide.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'link',
                    prompt: 'What discord invite do you want the info on?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { link }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
            this.client.fetchInvite(link).then(async invite => {
                let e = new Discord.MessageEmbed()
                    .setAuthor(invite.guild.name, `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`)
                    .setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`)
                    .setColor(message.guild.color)
                    .setDescription(`**Server: **${invite.guild.name} (${invite.guild.id})${invite.channel !== undefined ? `\n\n**Channel: **${invite.channel.name} (${invite.channel.id})`: ""}${invite.inviter !== undefined ? `\n\n**User: **${invite.inviter.tag} (${invite.inviter.id})` : ""}${invite.uses !== undefined ? `\n\n**Uses: **${invite.uses}` : ""}${invite.maxAge !== undefined ? `\n\n**Max Age: **${invite.maxAge}` : ""}`)
                    .addField(`Invite`, `**Code: **${invite.code}\n**Link: ** https://discord.gg/${invite.code}`)
                invite.guild.splash !== null ? e.addField(`Splash`, `[Click Here](https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png?size=2048)`, true).setImage(`https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png?size=2048`) : null;
                message.channel.send(e)
            }).catch(err => {
                return message.channel.send(`That invite is expired/invalid`)
            })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}