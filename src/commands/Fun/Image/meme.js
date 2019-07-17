const { Command,randomPuppy } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "meme",
            memberName: "meme",
            aliases: [],
            examples: [`${client.commandPrefix}meme`],
            guildOnly: true,
            description: "Gives you a meme",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "image"
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const color = message.guild.color;
        if(message.guild){
        if(!message.channel.nsfw){
            return message.channel.send(`You can't do the command in this channel`)
        }
        const subreddits = [
            "meme"
        ]
        var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

        randomPuppy(sub)
            .then(async url => {
                if (!url) return message.say(`Didn't find one try again.`)
                let user = message.author;
                let userurl = message.author.displayAvatarURL();
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`<a:Dots:426956230582599690> Loading......`)
                message.channel.send(embed).then(async message => {
                    embed.setColor(color)
                    embed.setDescription(`Here is your meme!\n[Click Here](${url})`)
                    embed.setImage(url)
                    embed.setFooter(`Requested By ${user.tag}`, userurl)
                    message.edit(embed);
                })
            })
        }else{
            const subreddits = [
                "meme"
            ]
            var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

            randomPuppy(sub)
                .then(async url => {
                    if (!url) return message.say(`Didn't find one try again.`)
                    let user = message.author;
                    let userurl = message.author.displayAvatarURL();
                    const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`<a:Dots:426956230582599690> Loading......`)
                    message.channel.send(embed).then(async message => {
                        embed.setColor(color)
                        embed.setDescription(`Here is your meme!\n[Click Here](${url})`)
                        embed.setImage(url)
                        embed.setFooter(`Requested By ${user.tag}`, userurl)
                        message.edit(embed);
                    })
                })
        }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}