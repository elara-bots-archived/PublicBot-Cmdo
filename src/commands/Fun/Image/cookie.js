const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "cookie",
            memberName: "cookie",
            aliases: ["cookies"],
            examples: [`${client.commandPrefix}cookie @user/userid`],
            description: "Gives a Cookie to a user",
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to give a cookie to?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
        if(user.bot) return this.client.error(this.client, message, `Bots don't get cookies! <:nom:555847203084697625>`)
        if(user.id === message.author.id) return this.client.error(this.client, message, `${this.client.util.emojis.nemoji} You can't give yourself a cookie! <:nom:555847203084697625>`);
        let api = await this.client.f.API('photos')
        if(!api) return message.channel.send(`Couldn't fetch a Cookie photo/gif :(`);
        let e = new MessageEmbed()
        .setColor(message.guild.color)
        .setTitle(`${message.author.username} has given ${user.username} a cookie! <:nom:555847203084697625>`)
        .setImage(api.cookies[Math.floor((Math.random() * api.cookies.length))]);
        return message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}