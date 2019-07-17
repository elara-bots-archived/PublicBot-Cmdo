const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "lockdown",
            memberName: "lockdown",
            aliases: ["ld"],
            group: "mod",
            guildOnly: true,
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}lockdown`],
            description: "Locks down the channel you run the command in.",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What channel do you want to lockdown?",
                    type: "channel",
                    default: message => message.channel
                },
                {
                    key: "role",
                    prompt: "What role do you want to lockdown.",
                    type: "role",
                    default: message => message.guild
                }
            ]
        })
    }
    async run(message, {channel, role}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        message.delete(10000).catch()
        channel.overwritePermissions(role.id, {
            SEND_MESSAGES: false
        });
        const lockembed = new Discord.MessageEmbed()
        .setColor(`#FF0000`)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`LOCKDOWN`)
        .setTimestamp()
        .setDescription(`${channel} is now locked for ${message.guild.roles.get(role.id)}\n**Action By: **${message.author}`)
        channel.send(lockembed)
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}