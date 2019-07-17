const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            memberName: "ban",
            aliases: [],
            examples: [`${client.commandPrefix}ban @user <reason here>`],
            description: "Bans the user.",
            group: "mod",
            guildOnly: true,
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user", 
                    prompt: "what user do you want me to ban?",
                    type: "user"
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for this ban?',
                    type: 'string',
                    default: "No Reason Provided"
                }
            ]
        })
    }
    async run(message, {user, reason }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
    try{
    if(message.guild.members.get(user.id)) {
    if(user.id === this.client.user.id) return message.say(`I can't ban myself.`);
    if(message.guild.members.get(user.id).hasPermission(["MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", 'MANAGE_ROLES', "MANAGE_WEBHOOKS", "KICK_MEMBERS", "BAN_MEMBERS"])) return message.say(`I can't ban a Mod/Admin.`);
    if(user.id === message.guild.ownerID) return message.say(`I can't ban the server owner.`);
    if(message.guild.me.roles.highest.position < message.guild.members.get(user.id).roles.highest.position) return this.client.error(this.client, message, `I don't have a role high enough to ban that member.`)
    let embed = new Discord.MessageEmbed()
    .setTitle(`Action: Ban`)
    .setAuthor(user.tag, user.displayAvatarURL())
    .addField(`User`,`${user} \`@${user.tag}\` (${user.id})`)
    .addField(`Mod`, `${message.author} (${message.author.id})`)
    .addField(`Reason`, reason)
    .setColor(`#FF0000`)
    .setTimestamp()
    .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
message.guild.members.ban(user.id, { reason: `${reason} | Banned By: ${message.author.tag}`, days: 7 }).then(async () => {
    this.client.f.logging(this.client, 'actionlog', message.guild, embed)
    await message.say(`${this.client.util.emojis.semoji}**${user.tag}** has been banned.`)
})
}else {
if (user.id === this.client.user.id) return message.say(`I can't ban myself.`);
if (user.id === message.guild.ownerID) return message.say(`I can't ban the server owner.`);
let embed = new Discord.MessageEmbed()
    .setTitle(`Action: Ban`)
    .setColor(`#FF0000`)
    .setAuthor(user.tag, user.displayAvatarURL())
    .addField(`User`,`${user} \`@${user.tag}\` (${user.id})`)
    .addField(`Mod`, `${message.author} (${message.author.id})`)
    .addField(`Reason`, reason)
    .setTimestamp()
    .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
    let bans = await message.guild.fetchBans();
    if(bans.has(user.id)) return message.channel.send(`${user.tag} is already banned!`)
message.guild.members.ban(user.id, { reason: `${reason} | Banned By: ${message.author.tag}`, days: 7 }).then(async () => {
    this.client.f.logging(this.client, 'actionlog', message.guild, embed)
    await message.say(`${this.client.util.emojis.semoji}**${user.tag}** has been banned.`)
})
}
} catch (e) {
    this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
    }
}
