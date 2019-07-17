const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "job+",
            memberName: "job+",
            aliases: [`addjob`],
            examples: [`${client.commandPrefix}job+ [job]`],
            description: "Adds a job to the database.",
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "newjob",
                    prompt: "What do you want to add to the jobs database?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { newjob }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let embed = new Discord.MessageEmbed()
        this.client.db.findOne({ guildID: message.guild.id}, (err, db) => {
            if(db){
                if(db.misc.jobs.includes(newjob)){
                    embed.setTitle(`ERROR`)
                    .setDescription(`That is already in the jobs database.`)
                    .setColor(`#FF0000`)
                    return message.channel.send(embed)
                }
                db.misc.jobs.push(newjob)
                db.save().catch(err => console.log(err));
                embed.setTitle(`Success`)
                .setColor(`#FF000`)
                embed.setDescription(`Added: ${newjob}`);
                return message.channel.send(embed)
            }else{
                embed.setTitle(`ERROR`)
                .setDescription(`This server doesn't have a database!`)
                .setColor(`#FF0000`)
                return message.channel.send(embed)
            }
        });
        } catch (e) {
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}