const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "warns",
            memberName: "warns",
            aliases: [`warnings`, `warning`],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}warns @user`],
            description: "View the current warnings for that user.",
            group: "mod",
            guildOnly: true,
            args: [
                {
                    key: "member",
                    prompt: "What member do you want to check the warnings of?",
                    type: "member"
                }
            ]
        })
    }
    async run(message, {member}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL())
            this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
                if(db){
                    let warns = []
                    await db.warnings.forEach(c => {
                        if(c.id === member.id){
                            warns.push(`
                            **Case: **${c.case}
                            **Moderator: **${c.mod}
                            **Reason: **${c.reason}
                            **Date: **${c.date}
                            `)
                        }
                    });
                if(warns.length === 0){
                    embed.setTitle('No Warnings')
                    return message.channel.send(embed)
                }
                embed.setDescription(warns.join('\n'))
                embed.setTitle(`Warnings`)
                return message.channel.send(embed)
                }
            })
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}