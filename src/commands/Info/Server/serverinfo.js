const { Command } = require('elaracmdo'),
    moment = require('moment'),
    Discord = require('discord.js');
let tiers = {
    0: "None",
    1: "Tier 1",
    2: "Tier 2",
    3: "Tier 3"
}
module.exports = class ServerINFO extends Command {
    constructor(client) {
        super(client, {
            name: "serverinfo",
            memberName: "serverinfo",
            aliases: ["guildinfo", "si", "gi"],
            examples: [`${client.commandPrefix}serverinfo`],
            description: "Gives you a all of the information about the guild.",
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
        let prefix = message.guild._commandPrefix ? message.guild._commandPrefix : this.client.commandPrefix;
        let e = new Discord.MessageEmbed()
        .setColor(message.guild ? message.member.displayColor : message.guild.color)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTimestamp()
        .setThumbnail(message.guild.iconURL())
        .setFooter(`On Shard: ${message.guild.shardID}`, this.client.user.displayAvatarURL())
        .setTitle(`Server Information`)
        .setDescription(`
        **Name: **${message.guild.name}
        **ID: **${message.guild.id}
        **Icon: **${message.guild.iconURL() ? `[URL](${message.guild.iconURL()})` : "None"}
        **Owner: **${message.guild.owner} (${message.guild.ownerID})
        **Verification Level: **${this.client.util.verifLevels[message.guild.verificationLevel]}
        **Region: **${this.client.util.region[message.guild.region]}${message.guild.features.length !== 0 ? `\n**Features?: **Yes: ${message.guild.features.map(feature => `\`${feature}\``).join(', ')}` : ""}
        
        **Misc**
        - Channels: ${message.guild.channels.size}, \`Do ${prefix}channels\`
        - Roles: ${message.guild.roles.size}, \`Do ${prefix}roles\`
        - Emojis: ${message.guild.emojis.size}, \`Do ${prefix}emojis\`
        - Members: Bots: ${message.guild.members.filter(c => c.user.bot).size}, Humans: ${message.guild.members.filter(c => !c.user.bot).size}, Total: ${message.guild.memberCount}
        
        **Server Boost**
        - Tier: ${tiers[message.guild.premiumTier]}
        - Users: ${message.guild.premiumSubscriptionCount}

        **Members Status**
        **${message.guild.members.filter(o => o.presence.status === 'online').size}** Online
        **${message.guild.members.filter(i => i.presence.status === 'idle').size}** Idle
        **${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}** DND
        **${message.guild.members.filter(off => off.presence.status === 'offline').size}** Offline

        **Created At**
        - ${moment(message.guild.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}, ${await this.client.f.days(message.guild.createdAt)}
        `)
        return message.channel.send(e)
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }

}