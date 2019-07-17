const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            memberName: "kick",
            aliases: [],
            examples: [`${client.commandPrefix}kick @user <reason here>`],
            description: "Kicks the user you mention",
            group: "mod",
            guildOnly: true,
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "what member do you want me to kick?",
                    type: "member"
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this kick?',
                    type: 'string',
                    default: "No Reason Provided"
                }
            ]
        })
    }
    async run(message, { member, reason }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        if (member.id === message.guild.ownerID) return message.say(`I can't kick the server owner.`)
        if (member.id === message.author.id) return message.say(`You can't kick yourself.`)
        if (member.hasPermission(["MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", 'MANAGE_ROLES', "MANAGE_WEBHOOKS", "KICK_MEMBERS", "BAN_MEMBERS"])) return message.channel.send("That member is a Mod/Admin for the server!");
        if(message.guild.me.roles.highest.position < member.roles.highest.position) return this.client.error(this.client, message, `I don't have a role high enough to kick that member.`)
        let embed = new Discord.MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`Action: Kick`)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField(`User`,`${member} \`@${member.user.tag}\` (${member.user.id})`)
            .addField(`Mod`, `${message.author} (${message.author.id})`)
            .addField(`Reason`, reason)
            .setTimestamp()
            .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
        if(member.user.bot === false){
        try{member.send(`${member.user}, You have been kicked from **${message.guild.name}** for: **${reason}**`)}catch(e){}
        }
        await message.guild.members.get(member.id).kick([reason]).then(async () => {
            this.client.f.logging(this.client, 'actionlog', message.guild, embed)
            message.delete().catch()
            await message.say(`${this.client.util.emojis.semoji}**${member.user.tag}** has been kicked.`).then(m => m.delete(15000).catch())
        })

    } catch(e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
    }
}
