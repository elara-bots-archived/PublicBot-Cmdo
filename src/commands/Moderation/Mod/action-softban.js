const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "softban",
            memberName: "softban",
            aliases: [`sb`],
            examples: [`${client.commandPrefix}softban @user <reason here>`],
            description: "Bans and unbans the member you provide",
            group: "mod",
            guildOnly: true,
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "what member do you want me to softban?",
                    type: "member"
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this softban?',
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
        if (member.user.id === message.author.id) return message.say(`You can't softban yourself :face_palm: `)
        if (member.hasPermission(["MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", 'MANAGE_ROLES', "MANAGE_WEBHOOKS", "KICK_MEMBERS", "BAN_MEMBERS"])) return message.say(`I can't softban another staff member.`)
        if(message.guild.me.roles.highest.position < member.roles.highest.position) return this.client.error(this.client, message, `I don't have a role high enough to softban that member.`)
        let embed = new Discord.MessageEmbed()
        .setTitle(`Action: Softban`)
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .addField(`User`,`${member} \`@${member.user.tag}\` (${member.user.id})`)
        .addField(`Mod`, `${message.author} (${message.author.id})`)
        .addField(`Reason`, reason)
        .setColor(`#FF0000`)
            .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
        await message.guild.members.ban(member.user.id).then(async () => {
            await message.guild.members.unban(member.user.id)
            await message.channel.send(`${this.client.util.emojis.semoji} ${member} has been softbanned`)
        });
        message.delete().catch();
        this.client.f.logging(this.client, 'actionlog', message.guild, embed)
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}
