const { Command, eutil: {perms} } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "perms",
            memberName: "perms",
            aliases: [`permissions`, `perm`],
            examples: [`${client.commandPrefix}perms`],
            description: "Gives you all of the permissions you have or another member.",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "What member do you want to see their permissions?",
                    type: "member",
                    default: message => message.member
                }
            ]
        })
    }
    async run(message, { member }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const allowed = Object.entries(member.permissions.serialize()).filter(([perm, allowed]) => allowed).map(([perm]) => `${perms[perm]}`);
        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setTitle(`Permissions`)
            .setDescription(allowed.length !== 0 ? allowed.join('\n') : "None")
            .setColor(message.guild.color)
            if(member.hasPermission("ADMINISTRATOR")){
                embed.setFooter(`${member.user.username} has Administrator and can bypass all set channel permissions!`)
            }
            if(member.hasPermission('MANAGE_ROLES' || 'MANAGE_MESSAGES' || "KICK_MEMBERS" || "BAN_MEMBERS")){
                embed.addField(`Moderator`, `Yes`, true)
            }
            if(member.hasPermission('ADMINISTRATOR' || 'MANAGE_GUILD')){
                embed.addField(`Admin`, `Yes`, true)
            }
        return message.say(embed)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}