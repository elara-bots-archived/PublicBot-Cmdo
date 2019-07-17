const { Command } = require('elaracmdo'),
    superagent = require("superagent"),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "gif",
            memberName: "gif",
            aliases: ["giphy"],
            examples: [`${client.commandPrefix}gif <Search here>`],
            description: "Searchs for a gif on Giphy",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "image",
            args: [
                {
                    key: 'content',
                    prompt: 'Please provide a search for the gif!',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(this.client.apis.giphy === "") return this.client.error(this.client, message, `Command Disabled, no Giphy API key provided!`)
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let { body } = await superagent.get(`https://api.giphy.com/v1/gifs/random?api_key=${this.client.apis.giphy}&tag=${encodeURIComponent(content)}`, { json: true });
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
        e.setDescription(`API is Broke <a:Dots:426956230582599690> Please Contact ${this.client.owners}`)
        if (!body) return message.channel.send(e).then(async () => {this.client.f.logger(this.client, message.guild, "GIPHY API IS BROKE", message, message.channel)});
        if (!body.data.image_url) return message.channel.send({embed: {
            description: `Nothing for that.`,
            color: 0xFF0000
        }});
        e.setDescription(`${this.client.util.emojis.eload} Loading the GIF, Please Wait.`)
        let msg = await message.channel.send(e);
        e.setDescription(`Here is your **${content}** GIF`)
        e.setImage(body.data.image_url)
        msg.edit(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}