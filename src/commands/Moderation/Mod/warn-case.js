const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "case",
            memberName: "case",
            aliases: [`lookup`],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}case [number]`],
            description: "View the info on that case number.",
            group: "mod",
            guildOnly: true,
            args: [
                {
                    key: "cases",
                    prompt: "What case do you want to view?",
                    type: 'integer',
                    min: 1
                }
            ]
        })
    }
    async run(message, {cases}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        const embed = new Discord.MessageEmbed().setColor(message.guild.color);
            this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
                if(db){
                    let info = []
                    await db.warnings.forEach(c => {
                        if(c.case === cases){
                            info.push({
                                case: c.case,
                                id: c.id,
                                mid: c.mid,
                                user: c.user,
                                mod: c.mod,
                                reason: c.reason,
                                date: c.date
                            })
                        }
                    });
                if(info.length === 0){
                    embed.setTitle('Nothing for that case number.. ')
                    return message.channel.send(embed)
                }
                let user = await this.client.users.fetch(info[0].id);
                embed.setTitle(`Case: ${info[0].case}`)
                .setColor(message.guild.color)
                .setAuthor(user.tag, user.displayAvatarURL())
                .addField(`User`, `${user.tag} (${user.id})`, true)
                .addField(`Moderator`, `${info[0].mod}`, true)
                .addField(`Reason`, info[0].reason, false)
                .addField(`Date`, info[0].date, false)
                .setTimestamp()
                return message.channel.send(embed)
                }
            })
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}