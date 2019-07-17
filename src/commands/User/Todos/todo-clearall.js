const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "cleartodos",
            memberName: "cleartodos",
            aliases: [`ct`, 'clearalltodos'],
            examples: [`${client.commandPrefix}cleartodos`],
            description: "Clears all of your todos.",
            group: "user",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "sure",
                    prompt: "Are you sure you want to clear all of your todos? [y/n]\n\n**This action isn't reversible**",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { sure }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        this.client.u.findOne({userID: message.author.id}, async(err, db) => {
            if(db){
                if(sure.toLowerCase() === "y" || sure.toLowerCase() === "yes"){
                db.todos = []
                db.save().catch(err => console.log(err));
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.guild.color)
                .setTitle(`Todos Cleared`)
                return message.channel.send(e)
                }else{
                return message.channel.send(`Canceled`)
                }
            }else{
                await this.client.f.userdb(this.client, message.author)
                message.channel.send(`Please try again... your database has just been created.`)
            }
        });
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}