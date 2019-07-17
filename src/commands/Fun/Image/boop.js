const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "boop",
            memberName: "boop",
            aliases: [],
            examples: [`${client.commandPrefix}boop @user/userid`],
            description: "Posts a boop gif",
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to boop?",
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
        if (user.id === message.author.id) return message.say(`You can't boop yourself Silly :wink:`)
        let api = await this.client.f.API('photos')
        if(!api) return message.channel.send(`Error while running this command, please try again.`);
        let link = api.boops[Math.floor((Math.random() * api.boops.length))]
        let e = new MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .setTitle(`BOOP!`)
        .setURL(link)
        .setImage(link)
        .setColor(message.guild.color)
        .setFooter(`Booped By: @${message.author.tag}`, message.author.displayAvatarURL())
        return message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}