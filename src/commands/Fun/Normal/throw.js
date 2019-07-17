const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "throw",
            memberName: "throw",
            aliases: [],
            examples: [`${client.commandPrefix}throw @user/userid`],
            description: "Throw something at the user",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to throw something at?",
                    type: "user"
                },
                {
                    key: "object",
                    prompt: "What do you want to throw?",
                    type: "string",
                    default: "random"
                }
            ]
        })
    }
    async run(message, { user, object }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            let random = async function(m){
                let random = await Math.floor(Math.random() * m.length)
                return random
            }
        let e = new Discord.MessageEmbed();
        if(object === "random"){
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
            let t;
            if(db.misc.throws.length === 0){
            t = this.client.util.throws[await random(this.client.util.throws)]
            }else{
            t = db.misc.throws[await random(db.misc.throws)]
            }
            e.setDescription(`Threw **${t}** at ${user}`)
            .setColor(message.guild.color)
            return message.channel.send(e)
            }else{
                e.setDescription(`Threw **${this.client.util.throws[random(this.client.util.throws)]}** at ${user}`)
                .setColor(message.guild.color)
                return message.channel.send(e)
            }
        })
        }else{
            e.setDescription(`Threw **${object}** at ${user}`)
            .setColor(message.guild.color)
            return message.channel.send(e)
        }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}