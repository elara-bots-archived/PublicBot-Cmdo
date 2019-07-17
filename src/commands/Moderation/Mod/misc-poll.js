const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "poll",
            memberName: "poll",
            aliases: [],
            examples: [`${client.commandPrefix}poll <#channel> <poll question here>`],
            description: "Posts a poll in the selected channel!",
            group: "mod",
            userPermissions: ["MANAGE_MESSAGES"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What Channel do you want it to be posted in?",
                    type: "channel"

                },
                {
                    key: 'poll',
                    prompt: 'What is the poll going to be?`',
                    type: 'string',
                }
            ]
        })
    }
    async run(message, { channel, poll}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(poll)
            .setTitle(`Poll`)
            .setFooter(`React to Vote!`)
        message.channel.send(`Poll sent to ${channel}`).then(async msg => {
            msg.delete(15000).catch()
            message.delete(15000).catch()
            channel.send(e).then(async message => {
                message.react(this.client.util.emojis.sreact)
                await message.react(this.client.util.emojis.nreact)
                
            })
        })
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}