const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "todo=",
            memberName: "todo=",
            aliases: [`todolist`, "t=", 'todos'],
            examples: [`${client.commandPrefix}todo=`],
            description: "View the todo list you currently have.",
            group: "user",
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
            this.client.u.findOne({userID: message.author.id}, async(err,db) => {
            if(db){
                let data = []
                await db.todos.forEach(c => {
                data.push({num: c.num, args: c.args});
                });
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.guild.color)
                .setTitle(`You have ${db.todos.length} todo${db.todos.length === 1 ? "" : "s"}`)
                data.splice(0, 25).forEach(c => {
                    e.addField(`${c.num} Todo`, c.args, true)
                });
                if(data.length > 25) e.setFooter(`This will only show up to 25 todos`)
                return message.channel.send(e)
            }else{
                await this.client.f.userdb(this.client, message.author)
                message.channel.send(`Please try again... your database has just been created.`)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}