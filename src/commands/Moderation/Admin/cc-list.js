const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cc=',
            memberName: 'cc=',
            aliases: [`commandslist`],
            examples: [`${client.commandPrefix}cc=`],
            description: `Shows the custom commands for the server...`,
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            userPermissions: ["MANAGE_GUILD"],
            group: 'admin'
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        this.client.custom.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
                let data = []
                await db.commands.forEach(async c => {
                data.push(`${c.cmd}`)
                })
                let e = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor(message.guild.color)
                .setDescription(data.join('\n') ? data.join('\n') : "No custom commands for this server!")
                .setTimestamp()
                .setTitle(`Custom Commands!`)
                return message.channel.send(e)
            }else{
                return message.channel.send(`No custom commands for this server!`);
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}