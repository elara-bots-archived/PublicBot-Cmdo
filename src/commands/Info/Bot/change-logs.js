const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'change',
            memberName: 'change',
            aliases: [`update`],
            examples: [`${client.commandPrefix}change`],
            description: 'Shows the current change log',
            group: 'bot',
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(`Recent Update`, this.client.user.displayAvatarURL()).setColor(message.guild.color).setTimestamp().setTitle(`No Update Logged Yet.`);
        this.client.dev.findOne({clientID: this.client.user.id}, async (err,db) => {
            if(db){
            if(db.change.time !== ""){
            e.addField(`Updated At`, db.change.time ? db.change.time : "Nothing..").setTitle(' ')
            }
            if(db.change.args !== ""){
            e.setDescription(db.change.args).setTitle('Update')
            }
            return message.channel.send(e)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}