const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unlock",
            memberName: "unlock",
            aliases: ["ul"],
            group: "mod",
            guildOnly: true,
            examples: [`${client.commandPrefix}unlock`],
            userPermissions: ["MANAGE_MESSAGES"],
            description: "Unlocks the channel you run the command in.",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "role",
                    prompt: "What role do you want to unlock.",
                    type: "role",
                    default: message => message.guild
                }
            ]
        })
    }
    async run(message, {role}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        message.delete(10000).catch()
        message.channel.overwritePermissions(role.id, {
            SEND_MESSAGES: true
        });
        const lockembed = new Discord.MessageEmbed()
        .setColor(`#FF0000`)
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setTitle(`Unlocked`)
        .setTimestamp()
        .setDescription(`This channel is now unlocked for ${message.guild.roles.get(role.id)}\n**Action By: **${message.author}`)
        message.channel.send(lockembed)
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}