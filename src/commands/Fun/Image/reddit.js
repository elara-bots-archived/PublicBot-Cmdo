const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const {get} = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reddit",
            memberName: "reddit",
            aliases: ["rd"],
            examples: [`${client.commandPrefix}reddit Pug`],
            description: "Gives you a random reddit post from the thing you search for.",
            group: "image",
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
        if(content.includes('meme') || content.includes('porn')){
            if(!message.channel.nsfw)return message.channel.send(`You can't search that in this channel.`)
        }
        const {body} = await get(`https://www.reddit.com/r/${content}/random.json`)
        let data;
        try{
            data = body[0].data.children[0].data;
        }catch(e){
           data = body.data.children[0].data
        }
        if (!data.url || data.url === ("https://www.reddit.com/r/cats/comments/9ko0du/please_do_us_mods_a_favor_and_if_you_report/" || "https://www.reddit.com/r/cat/comments/aql3cj/iso_behavioral_advice/")) return message.say(`Nothing, please try again.`)
        if (data.over_18 && !message.channel.nsfw) {
            if (message.channel.type === "dm") return message.say(`I can't post a NSFW Image in dms.`)
            message.say('I cant post a NSFW image in this channel unless you mark it as NSFW!');
        } else {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`Photos from Reddit.`, `http://i.imgur.com/sdO8tAw.png`)
                .setColor(message.guild ? message.member.displayColor : message.guild.color)
                .setDescription(`Here is your **${content}**\nLink to photo [Click Here](${data.url})`)
                .setImage(data.url)
                .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL())
            message.embed(embed)
        }
} catch (e) {
    this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
    }
}