const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment')
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "wiki",
            memberName: "wiki",
            aliases: ["wikipedia"],
            examples: [`${client.commandPrefix}wiki Discord`],
            description: "Gives you the wikipedia result for what you search for.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What do you want to search for?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(content)}`)
            .then(response => response.json())
            .catch(() => { message.say(`Can't find anything with that name.`) });
        if (article.title === "Not found.") return message.say(`Nothing for that.`)
        const embed = new Discord.MessageEmbed()
            .setColor(4886754)
            .setThumbnail((article.thumbnail && article.thumbnail.source) || 'https://i.imgur.com/fnhlGh5.png')
            .setURL(article.content_urls.desktop.page)
            .setTitle(article.title)
            .setDescription(`**${article.description}**\n\n${article.extract}`)
            .addField(`Article Written at`, `${moment(article.timestamp).format('dddd, MMMM Do YYYY')}`, true)
            .addField(`Link`, `[Click Here](${article.content_urls.desktop.page})`, true)
            .setTimestamp()
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL())
            .setAuthor(`Wikipedia`, `https://i.imgur.com/fnhlGh5.png`)

        message.embed(embed);
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}