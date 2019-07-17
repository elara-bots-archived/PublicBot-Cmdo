const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class AdCheckCommand extends Command {
    constructor(client) {
        super(client, {
            name: "adcheck",
            group: "mod",
            aliases: [],
            memberName: "adcheck",
            userPermissions: ["MANAGE_MESSAGES"],
            guildOnly: true,
            examples: [`${client.commandPrefix}adcheck`],
            description: "Checks for discord invites in users playing statuses",
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
        const members = message.guild.members.filter(member => member.user.bot === false && member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
        const adchecker = members.map(member => `${member} (${member.id})`).join("\n") || "No invite links found."
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setTitle(`Discord invites in these users playing statuses`)
            .setDescription(adchecker)
        message.say(embed)
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}