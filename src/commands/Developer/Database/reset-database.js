const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resetstats',
            memberName: 'resetstats',
            aliases: [],
            examples: [`${client.commandPrefix}resetstats`],
            description: 'Resets the stats database',
            group: 'owner',
            hidden: true,
            ownerOnly: true,
        })
    }
    async run(message) {
        
        try{
        this.client.dev.findOne({clientID: this.client.user.id}, async (err, db) => {
            if(db){
                db.stats.cmdrun = 0;
                db.stats.guildsjoin = 0;
                db.stats.guildsleft = 0;
                db.stats.restarts = 0;
                db.stats.shutdowns = 0;
                db.stats.starts = 0;
                db.save().catch(err => console.log(err.stack))
                await message.channel.send(`Ok, I've resetted the stats database!`)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}