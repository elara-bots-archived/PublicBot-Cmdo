const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'main',
            memberName: 'main',
            hidden: true,
            aliases: [],
            examples: [`${client.commandPrefix}main`],
            description: 'Toggles the maintenance mode on or off',
            group: 'owner',
            ownerOnly: true
        })
    }
    async run(message) {
        
        try{
        this.client.dev.findOne({clientID: this.client.user.id}, async (err,db) => {
            if(db){
                let m;
                if(db.misc.maintenance === true){
                    db.misc.maintenance = false
                    this.client.f.starting(this.client);
                    m = `Disabled`
                }else{
                    db.misc.maintenance = true
                    this.client.user.setPresence({status: "dnd", game: {name: "-- Maintenance --", type: "WATCHING"}})
                    m = `Enabled`
                }
                db.save().catch(err => this.client.error(this.client, message, err))
                return this.client.f.embed(this.client, message, m, "Maintenance Mode")
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}