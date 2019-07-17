const { Command } = require("elaracmdo");
const { get } = require("superagent");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
module.exports = class YTStatsCMD extends Command {

    constructor(client) {
        super(client, {
            name: "ytstats",
            group: "info",
            aliases: ["youtubestats", "youtubesubs", "youtubeinfo", "ytinfo"],
            memberName: "ytstats",
            description: "Get YouTube Channel Statisitcs Directly From YouTube.",
            usage: ["<prefix>ytstats <channel name or URL>"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [{
                key: "ytname",
                prompt: "Please enter a YouTube Channel Name or URL?\n",
                type: "string"
            }]
        });
    }
    async run(message, { ytname }) {
        if(this.client.apis.youtube === "") return message.channel.send(`Command Disabled, YouTube API key not provided!`)
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
            if (ytname === ("G" || "Deeter")) ytname = "DeeterPlays";
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${ytname}&key=${this.client.apis.youtube}&maxResults=1&type=channel`;
            const a = await get(url).then(res => res.body).catch(e => message.reply(e));
            const subcount = await get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${a.items[0].id.channelId}&key=${this.client.apis.youtube}`).then(res => res.body).catch(e => message.reply(e));
            let ch = a.items[0];
            const embed = new MessageEmbed()
                .setFooter(`YouTube Channel Statistics - ${this.client.user.tag}`, this.client.user.displayAvatarURL())
                .setTimestamp()
                .setColor(message.guild ? message.member.displayColor : message.guild.color)
                .setAuthor(ch.snippet.channelTitle, ch.snippet.thumbnails.high.url, `https://www.youtube.com/channel/${ch.id.channelId}`)
                .setDescription(`
                **Name: **${ch.snippet.channelTitle}
                **ID: **${ch.id.channelId}
                **Created At: **${moment(ch.snippet.publishedAt).format("MMMM Do YYYY")}
                **Subscriber Count:** ${parseInt(subcount.items[0].statistics.subscriberCount).toLocaleString()}
                **View Count: **${parseInt(subcount.items[0].statistics.viewCount).toLocaleString()}
                **Video Count: **${parseInt(subcount.items[0].statistics.videoCount).toLocaleString()}
                **Channel Link: **https://www.youtube.com/channel/${subcount.items[0].id}${subcount.items[0].snippet.customUrl ? `\n**Custom Link: **https://www.youtube.com/c/${subcount.items[0].snippet.customUrl}`:""}
                `).setThumbnail(ch.snippet.thumbnails.high.url);
            if(ch.snippet.description.length !== 0){
                embed.addField(`Description`, ch.snippet.description)
            }
            if (subcount.items[0].brandingSettings.image.bannerImageUrl === "http://s.ytimg.com/yts/img/channels/c4/default_banner-vfl7DRgTn.png") {
            } else {
                embed.setImage(subcount.items[0].brandingSettings.image.bannerImageUrl)
            }
            return message.embed(embed);
        } catch (e) {
            this.client.f.logger(this.client, message, e.stack)
            return message.reply("❌ There was an error, please try again with a valid URL or Channel Name.");
        }
    }

};