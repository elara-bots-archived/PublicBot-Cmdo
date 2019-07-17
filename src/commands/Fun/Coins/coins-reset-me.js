const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reset-money',
            memberName: 'reset-money',
            aliases: [`reset-me`],
            examples: [`${client.commandPrefix}reset-money`],
            description: 'Resets your money..',
            group: 'coins',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5000
            },
            args: [
                {
                    key: "choose",
                    prompt: "Are you sure you want to reset your coins database [y/n]? **THIS ACTION ISN'T REVERSIBLE**",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {choose}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        this.client.dbcoins.findOne({ userID:  message.author.id, guildID: message.guild.id }, async (err, db) => {
        if (db) {
        if(choose.toLowerCase() === 'y' || choose.toLowerCase() === "yes"){
        db.coins = 0;
        db.bank = 0;
        db.save().catch(err => console.log(err.stack));
        return message.channel.send(`Your ${message.guild.currency} database has been reset :sweat:`)
        }else
        if(choose.toLowerCase() === "n" || choose.toLowerCase() === "no"){
        return message.channel.send(`Canceled. :sweat:`)
        }else{
            return message.channel.send(`You didn't select "yes" or "no" so I canceled the selection.`)
        }
        }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}