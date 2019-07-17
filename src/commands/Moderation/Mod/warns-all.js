const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "allwarnings",
            memberName: "allwarnings",
            aliases: [`allwarns`],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}allwarns`],
            description: "View the current warnings for the server.",
            group: "mod",
            guildOnly: true
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setAuthor(message.guild.name, message.guild.iconURL())
        this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
        if(db){
            if(db.warnings.length === 0){
                e.setTitle(`No Warnings.`)
                return message.channel.send(e)
            }else{
                let data = [];
                await db.warnings.forEach(async w => {
                data.push(`
                Case: ${w.case}
                Member: ${w.user} (${w.id})
                Moderator: ${w.mod}
                Reason: ${w.reason}
                Date: ${w.date}
                `)
                })
                if(data.join('\n\n').length < 2040){
                    e.setTitle(`All Warnings`).setDescription(data.join('\n\n'))
                    return message.channel.send(e)
                }else{
                let link = await this.client.f.bin(`Warnings for ${message.guild.name}`, data.join('\n\n'))
                e.setTitle(`All Warnings.`)
                .setDescription(link)
                return message.channel.send(e)
                }
            }
        }
        });
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}