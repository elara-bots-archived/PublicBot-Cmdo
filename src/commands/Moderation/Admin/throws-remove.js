const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "th-",
            memberName: "th-",
            aliases: [`removethrow`, "throwremove"],
            examples: [`${client.commandPrefix}throw- [throw]`],
            description: "Remove a throw from the database.",
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "throws",
                    prompt: "What is the throw you want to remove?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {throws}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL());
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
        if(db){
        if(db.misc.throws.length === 0){
            e.setTitle(`ERROR`)
            .setDescription(`There is no throws in the servers database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        if(!db.misc.throws.includes(throws)){
            e.setTitle(`ERROR`)
            .setDescription(`That isn't a throw in the servers database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        let data = [];
        db.misc.throws.forEach(g => {
            if(g.toLowerCase() !== throws.toLowerCase()){
                data.push(g)
            };
        });
        db.misc.throws = data
        db.save().catch(err => console.log(err));
        e.setTitle(`Success`)
        .setDescription(`Alright, I removed **${throws}** from the throw list.`)
        .setColor(`#FF000`)
        return message.channel.send(e)
        }else{
            e.setTitle(`ERROR`)
            .setDescription(`This server doesn't have a database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        });
        } catch (e) {
        this.client.f.logger(this.client, msg, e.stack)
        }
    }
}