const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'recent',
            memberName: 'recent',
            hidden: true,
            aliases: [],
            examples: [`${client.commandPrefix}recent`],
            description: 'Lists all of the recent [Connects, Reconnects, Disconnects]',
            group: 'owner',
            ownerOnly: true
        })
    }
    async run(message) {
        
        try{
        this.client.dev.findOne({clientID: this.client.user.id}, async (err,db) => {
            if(db){
                let e = new Discord.MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setColor(message.member.displayColor)
                .addField(`Last Connect`, db.logs.connect ? db.logs.connect : "None")
                .addField(`Last Reconnect`, db.logs.reconnect ? db.logs.reconnect : "None")
                .addField(`Last Disconnect`, db.logs.disconnect ? db.logs.disconnect : "None")
                return message.say(e)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}