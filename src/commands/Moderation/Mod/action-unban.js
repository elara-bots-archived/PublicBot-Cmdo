const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            memberName: "unban",
            aliases: [],
            examples: [`${client.commandPrefix}unban @user/userid`],
            description: "Unbans the member",
            group: "mod",
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to unban?',
                    type: 'user'
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let bans = await message.guild.fetchBans();
        if(bans.length === 0) return message.channel.send(`${this.client.util.emojis.nemoji} there isn't any bans on this server!`)
        if(!bans.has(user.id)) return message.channel.send(`${this.client.util.emojis.nemoji}**${user.tag}** isn't banned!`)
        message.guild.members.unban(user.id, `Unbanned By: ${message.author.tag}`).then(async () => {
        let e = new Discord.MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(`#FF000`)
        .setTimestamp()
        .setTitle(`Action: Unban`)
        .addField(`User`,`${user} \`@${user.tag}\` (${user.id})`)
        .addField(`Mod`, `${message.author} (${message.author.id})`)
        return this.client.f.logging(this.client, 'actionlog', message.guild, e).then(async () => {return message.channel.send(`${this.client.util.emojis.semoji} **${user.tag}** has been unbanned!`)})
        }).catch(async err => {return message.channel.send(`Failed to unban ${user.tag}`)});
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }

    }
}
