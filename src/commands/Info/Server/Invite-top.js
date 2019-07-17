const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "topinvites",
            memberName: "topinvites",
            aliases: ["invites", "ti", "topinvite"],
            examples: [`${client.commandPrefix}invites`],
            description: "Gives you the top invites for the server",
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
        if(!message.guild.me.hasPermission("MANAGE_GUILD")) return this.client.error(this.client, message, `I need the \`Manage Server\` permission to view the invites for the server!`)
        let invites = await message.guild.fetchInvites();

        let possibleinvites = [];
        let num = 0;
        invites.sort((a, b) => b.uses - a.uses).forEach(function (invites) {
            if(invites.uses === 0) return;
            num++
            possibleinvites.push(`**${num}.** ${invites.inviter} Invited **${invites.uses}** people using **${invites.code}**`)
        })
        if (possibleinvites.join('\n').length === 0) return this.client.error(this.client, message, `There isn't any invites on this server.`)
        const embed = new Discord.MessageEmbed()
            .setTitle(`Top 15 Invites Leaderboard`)
            .setColor(message.guild.color)
            .addField('Invites', `${possibleinvites.splice(0, 15).join('\n')}`)
            .setFooter(this.client.user.tag, this.client.user.avatarURL)
            .setTimestamp();
        message.channel.send({ embed });
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}