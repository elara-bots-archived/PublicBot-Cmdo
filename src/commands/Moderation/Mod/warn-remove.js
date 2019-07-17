const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clearcase",
            memberName: "clearcase",
            aliases: [`clearwarn`, 'clearwarns'],
            examples: [`${client.commandPrefix}clearcase case number`],
            description: "Removes the case from the database",
            group: "mod",
            userPermissions: ["MANAGE_MESSAGES"],
            guildOnly: true,
            args: [
                {
                    key: "cases",
                    prompt: "What case do you want to remove?",
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
        
        try{
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setTitle(`Loading...`)
        let msg = await message.channel.send(e);
        this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
                if(db.warnings.length === 0){
                    e.setTitle(`ERROR`)
                    .setColor(`#FF0000`)
                    .setDescription(`There is no warnings..`);
                    return msg.edit(e)
                };
                let c = [];
                let hm = [];
                let num = 0;
                await db.warnings.forEach(w => {
                if(w.case === cases){
                    hm.push(`
                    **Case: **${w.case}
                    **User: **${w.user} (${w.id})
                    **Moderator: **${w.mod}
                    **Reason: **${w.reason}
                    **Date: **${w.date}
                    `)
                }
                if(w.case !== cases){
                num++
                c.push({
                    case: num,
                    id: w.id,
                    mid: w.mid,
                    user: w.user,
                    mod: w.mod,
                    reason: w.reason,
                    date: w.date
                })
                }
                });
                if(hm.length === 0){
                    e.setTitle(`ERROR`)
                    .setColor(`#FF0000`)
                    .setDescription(`There isn't a case **${cases}**`)
                    return msg.edit(e)
                }
                db.warnings = c;
                db.save().catch(err => console.log(err));
                e.setTitle(`Case Removed`)
                .setDescription(hm.join('\n'));
                return msg.edit(e)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}