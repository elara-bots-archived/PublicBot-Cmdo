const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "throwremoveall",
            memberName: "throwremoveall",
            aliases: [`tra`],
            examples: [`${client.commandPrefix}throwremoveall [yes/no]`],
            description: "Removes all throw from the database.",
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "areyousure",
                    prompt: "Are you sure you want to clear all of the throws out of the server's database?? [`y`, `n`]\n\n**This action isn't reversible**",
                    type: "string",
                    parse: str => str.toLowerCase()
                }
            ]
        })
    }
    async run(message, {areyousure}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(areyousure === "yes" || areyousure === "y"){
        let e = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL());
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
        if(db){
        if(db.misc.throws.length === 0){
            e.setTitle(`ERROR`)
            .setDescription(`There is no throws in the servers database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        db.misc.throws = []
        db.save().catch(err => console.log(err));
        e.setTitle(`Success`)
        .setDescription(`Alright, I removed all of the throws from the database.`)
        .setColor(`#FF000`)
        return message.channel.send(e)
        }else{
            e.setTitle(`ERROR`)
            .setDescription(`This server doesn't have a database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        });
    }else{
        return message.channel.send({embed: {title: "Command Canceled", color: 0xFF0000, author: {name: message.author.tag, icon_url: message.author.displayAvatarURL()}}})
    }
        } catch (e) {
        this.client.f.logger(this.client, msg, e.stack)
        }
    }
}