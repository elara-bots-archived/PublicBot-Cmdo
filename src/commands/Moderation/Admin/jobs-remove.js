const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "job-",
            memberName: "job-",
            aliases: [`removejob`, "jobremove"],
            examples: [`${client.commandPrefix}job- [job]`],
            description: "Remove a job from the database.",
            group: "admin",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "job",
                    prompt: "What is the job you want to remove?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {job}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL());
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
        if(db){
        if(db.misc.jobs.length === 0){
            e.setTitle(`ERROR`)
            .setDescription(`There is no jobs in the servers database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        if(!db.misc.jobs.includes(job)){
            e.setTitle(`ERROR`)
            .setDescription(`That isn't a job in the servers database.`)
            .setColor(`#FF0000`)
            return message.channel.send(e)
        }
        let data = [];
        db.misc.jobs.forEach(g => {
            if(g.toLowerCase() !== job.toLowerCase()){
                data.push(g)
            };
        });
        db.misc.jobs = data
        db.save().catch(err => console.log(err));
        e.setTitle(`Success`)
        .setDescription(`Alright, I removed **${job}** from the throw list.`)
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
