const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class hugCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hug",
            memberName: "hug",
            aliases: ["hugs"],
            examples: [`${client.commandPrefix}hug @user/userid`],
            description: "Hugs the user you mention/userid",
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to hug?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
    try{
         let api = await this.client.f.API('hugs')
         if(!api) return message.channel.send(`Couldn't fetch a hug gif... oof`);
         let e = new MessageEmbed()
         .setAuthor(`${user.username} HUGS!`, 'https://cdn.discordapp.com/emojis/538685610324525088.gif')
         .setImage(api[Math.floor((Math.random() * api.length))] + "?size=2048")
         .setColor(message.guild.color);
         return message.channel.send(e)
    } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
    }
}