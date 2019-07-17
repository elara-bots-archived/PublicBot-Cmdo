const { Command, YT } = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class YtSearchCommand extends Command {
constructor(client){
    super(client, {
        name: "youtube",
        group: "info",
        aliases: ['yt'],
        description: "Searchs for a youtube video",
        memberName: "youtube",
        examples: [`${client.commandPrefix}yt <Video Search Name here>`],
        throttling: {
            usages: 1,
            duration: 5
        },
        args:[{
            key: 'content',
            prompt: 'Which video do you want to find?',
            type: 'string',
            default: ""
        }]
    })
}
async run (message, {content}) {
    if(this.client.apis.youtube === "") return message.channel.send(`Command Disabled, YouTube API key not provided!`)
    if(await this.client.b(this.client, message) === true) return;
    if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
    if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
    
    try{
        let color = message.guild.color
        var opts = {
            maxResults: 15,
            key: this.client.apis.youtube,
            type: 'video'
        };
    if (content !== "") {
        message.react('476629550797684736')
        let nm = content
        YT(nm, opts, async function (err, results) {
            let random = await Math.floor((Math.random() * 15));
            const embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(results[random].title)
                .setDescription(`${results[random].description}`)
                .addField(`Link`, `${results[random].link}`)
                .setImage(results[random].thumbnails.high.url)
                .setTimestamp(results[random].publishedAt)
                .setFooter(`[YouTube] Search ${random}/15`, `http://www.creditlenders.info/wp-content/uploads/youtube-gaming-or-something-like-it-endgame-viable-youtube-gaming-logo.png`)
            message.say(embed2);
        });
    } else {
        message.react('482868924573155349')
        return this.client.error(this.client, message, `What video do you want to search for? ${this.client.commandPrefix}yt (search)`)
    }
    } catch (e) {
        this.client.error(this.client, message, e);
        this.client.logger(this.client, message.guild, e.stack, message, message.channel)
    }
}
}