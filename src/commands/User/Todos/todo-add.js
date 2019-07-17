const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "todo",
            memberName: "todo",
            aliases: [`addtodo`, "t+", "todo+"],
            examples: [`${client.commandPrefix}todo+ New todo`],
            description: "Adds a todo for your clipboard.",
            group: "user",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "content",
                    prompt: "What do you want to add to your todo list?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        this.client.u.findOne({userID: message.author.id}, async(err, db) => {
            if(db){
                let todo = {
                    num: db.todos.length + 1,
                    args: content
                }
                db.todos.push(todo);
                db.save().catch(err => console.log(err));
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.guild.color)
                .setDescription(`${todo.num}. ${content}`)
                .setFooter(`Now you have ${db.todos.length} todo${db.todos.length === 1 ? "" : "s"}`)
                .setTitle(`Todo added`)
                .setTimestamp()
                return message.channel.send(e)
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