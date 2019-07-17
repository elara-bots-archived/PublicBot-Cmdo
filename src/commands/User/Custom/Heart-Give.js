const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'heart',
            memberName: 'heart',
            aliases: [],
            examples: [`${client.commandPrefix}heart @user`],
            description: `Gives a user a heart.`,
            group: 'user',
            guildOnly: true,
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to give the heart to?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if (user.bot) return;
        if(message.author.id === user.id) return message.channel.send(`You can't give yourself a heart!`)
        this.client.u.findOne({ userID: user.id}, async (err, db) => {
            if (db) {
                db.hearts = db.hearts + 1;
                db.save().catch(err => {
                    console.log(err)
                    return message.channel.send(`ERROR:\n${err}`)
                })
                let e = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(message.guild.color)
                    .setTimestamp()
                    .setDescription(`${message.author} has given ${user} a heart!`)
                return message.channel.send(e)
            }else{
                let newdb = new this.client.u({
                    userTag: user.tag,
                    userID: user.id,
                    reps: 0,
                    hearts: 1,
                    todos: [],
                    custom: {
                    image: "",
                    desc: "",
                    },
                    afk: {en: false, message: ""}
                });
                newdb.save().catch(err => console.log(err));
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.guild.color)
                .setTimestamp()
                .setDescription(`${message.author} has given ${user} a heart!`)
                return message.channel.send(e)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}