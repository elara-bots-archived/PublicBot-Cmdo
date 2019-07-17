const { Command } = require('elaracmdo'),
    ms = require('ms'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            memberName: "mute",
            aliases: ["silence", "calm"],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ['MANAGE_ROLES'],
            examples: [`${client.commandPrefix}mute @user/userid <reason here>`],
            description: "Mutes the member you provide",
            guildOnly: true,
            group: "mod",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "What member do you want me to mute?",
                    type: "member"
                },
                {
                    key: "time",
                    prompt: "How long do you want to mute the user for? | Example: 1h, 1m, 1s",
                    type: "string",
                    default: '1h'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the mute?',
                    type: 'string',
                    default: "No Reason Provided"
                }
            ]
        })
    }
    async run(message, {member, time, reason}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        if (member.hasPermission(["MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", 'MANAGE_ROLES', "MANAGE_WEBHOOKS", "KICK_MEMBERS", "BAN_MEMBERS"])) return message.reply("Sorry but i can't mute Mods/Admins!");
        if(!time.includes('m' || 'h' || "d" || "s" || "minutes" || "hours" || "days" || "seconds")) time = '1h'
        let muterole = message.guild.roles.find(r => r.name.toLowerCase() === "muted");
        if(member.roles.has(muterole.id)) return message.channel.send(`${this.client.util.emojis.nemoji} ${member.user.tag} is already muted!`)
        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({
                    name: `Muted`,
                    color: "#FF0000",
                    permissions: []
                })
                message.guild.channels.forEach(async (channel, id) => {
                    try{
                    await channel.overwritePermissions(muterole.id, {
                        SEND_MESSAGES: false
                    });
                    }catch(e){}
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        await member.roles.add(muterole.id);
        let eb = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`Action: Mute`)
        .setDescription(`${member} (${member.id})`)
        .addField(`\u200b`, `
        **Moderator: **${message.author} (${message.author.id})
        **Time: **${time}
        **Reason: **${reason}
        `)
        .setTimestamp()
        this.client.f.logging(this.client, 'actionlog', message.guild, eb)
        message.channel.send(`${this.client.util.emojis.semoji} ***${member.user.tag} Has Been Muted!***`);
        const dmembed = new Discord.MessageEmbed()
            .setColor(`#FF0000`)
            .setDescription(`You have been Muted in **${message.guild.name}**`)
            .addField(`Reason`, `${reason}`)
        try{await member.send(dmembed)}catch(e){}
        setTimeout(async () => {
        if(!member.roles.has(muterole.id)) return;
        if(member.roles.has(muterole.id)) member.roles.remove(muterole.id);
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`Action: Unmute`)
        .setColor('#FF000')
        .setDescription(`${member} \`@${member.user.tag}\` (${member.user.id})`)
        .addField(`\u200b`, `
        **Moderator: **${this.client.user} (${this.client.user.id})
        **Reason: **Auto
        `)
        .setTimestamp()
        return this.client.f.logging(this.client, 'actionlog', message.guild, e)
        }, ms(time))
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}
