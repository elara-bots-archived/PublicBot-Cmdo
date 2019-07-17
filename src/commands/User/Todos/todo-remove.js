const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "todo-",
            memberName: "todo-",
            aliases: [`removetodo`, 'todoremove', 't-'],
            examples: [`${client.commandPrefix}todo-`],
            description: "Remove a todo from your list.",
            group: "user",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "number",
                    prompt: `What todo do you want to remove?\n\nIf you ain't sure of the todo number use the \`todos\` command!`,
                    type: "integer",
                    min: 0
                }
            ]
        })
    }
    async run(message, {number}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setTitle(`Loading...`)
            let msg = await message.channel.send(e);
            this.client.u.findOne({ userID: message.author.id }, async (err, db) => {
            if (db) {
            if(db.todos.length === 0){
                e.setTitle(`INFO`).setDescription(`You don't have any todos to remove.`).setColor(`#FF0000`);
                return msg.edit(e)
            }
            let c = [];
            let hm = [];
            let i = 0;
            await db.todos.forEach(w => {
            if(w.num === number){
                hm.push(`
                ${w.num}. ${w.args}
                `)
            }
            if(w.num !== number){
            i++
            c.push({
                num: i,
                args: w.args
            })
            }
            });
            if(hm.length === 0){
                e.setTitle(`ERROR`)
                .setColor(`#FF0000`)
                .setDescription(`There isn't a todo **${number}**`)
                return msg.edit(e)
            }
            db.todos = c;
            db.save().catch(err => console.log(err));
            e.setTitle(`Todo Removed`)
            .setDescription(hm.join('\n'));
            return msg.edit(e)
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