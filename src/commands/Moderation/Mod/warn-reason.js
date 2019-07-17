const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reason",
            memberName: "reason",
            aliases: [],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}reason [number] [new reason]`],
            description: "Edits the reason for the warn in the database.",
            group: "mod",
            guildOnly: true,
            args: [
                {
                    key: "cases",
                    prompt: "What case do you want to edit the reason for?",
                    type: 'integer',
                    min: 1
                },
                {
                    key: "reason",
                    prompt: "What is the reason for the case?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {cases, reason}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        const embed = new Discord.MessageEmbed().setColor(message.guild.color);
            this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
                if(db){
                    if(db.warnings.length !== cases){
                        embed.setTitle(`There isn't that many cases in the database!`).setColor(this.client.util.colors.red);
                        return message.channel.send(embed)
                    }else{
                        let cedit = [], data = [];
                        await db.warnings.forEach(c => {
                            if(c.case === cases){
                                cedit.push({
                                case: c.case,
                                id: c.id,
                                mid: c.mid,
                                user: c.user,
                                mod: c.mod,
                                reason: reason,
                                date: c.date
                                })
                                data.push({
                                    case: c.case,
                                    id: c.id,
                                    mid: c.mid,
                                    user: c.user,
                                    mod: c.mod,
                                    reason: reason,
                                    date: c.date
                                    })
                            }else{
                                data.push({
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
                        if(cedit.length === 0){
                            embed.setTitle(`Case not found`);
                            return message.channel.send(embed)
                        }else{
                            db.warnings = data;
                            db.save().catch(err => {
                                this.client.f.error(this.client, message, `Database Error\n${err}`)
                                return this.client.f.logger(this.client, message, err.stack)
                            });
                            embed.setTitle(`Case: ${cedit[0].case} Edited!`);
                            return message.channel.send(embed)
                        }
                    }
                }
            })
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}