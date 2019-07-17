const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
require("moment-duration-format");
const fetch = require('node-fetch');
const {apis} = require('../../../util/config.js')
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "playingstatus",
            memberName: "playingstatus",
            aliases: [`ps`],
            examples: [`${client.commandPrefix}playingstatus @user`],
            description: "Shows the playing status of you or the member id or mention you give.",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "What member do you want to see their playing status?",
                    type: "member",
                    default: message => message.member
                }
            ]
        })
    }
    async run(message, { member }) {
        if(this.client.config.apis.twitch === "") return this.client.error(this.client, message, `No Twitch API key provided!`)
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed().setAuthor(`${member.user.tag}'s Playing Status`, member.user.displayAvatarURL()).setColor(message.guild ? message.member.displayColor : message.guild.color).setTitle(`Status: ${member.presence.status.toUpperCase()}`).setDescription(`**Playing: **Nothing`)
    if(member.presence.activity === null){return message.say(e)}else{
    switch(member.presence.activity.type){
        case "PLAYING":
                if(member.presence.activity.assets === null) {
                e.setDescription(`**Playing: **${member.presence.activity.name}`)
                }else
                if(member.presence.activity.name === "Visual Studio Code") {
                    e.setDescription(`
                    **Playing: **${member.presence.activity.name}
                    **Details: **${member.presence.activity.details || "None"}
                    **State: **${member.presence.activity.state || "None"}
                    **Type: **${member.presence.activity.assets.largeText || "None"}
                    `)
                    e.setThumbnail("https://static1.squarespace.com/static/592e86ee9de4bb6e73d8c154/t/5982162d6a49631135282359/1501756993395/vscode.png")
                }else
                if(member.presence.activity.party !== null) {
                    if(member.presence.activity.name.toLowerCase() === "fortnite"){
                    e.setThumbnail(`https://boop.page.link/CsvY`)
                    e.setDescription(`
                    **Playing: **${member.presence.activity.name}
                    **Game Type: **${member.presence.activity.details || "None"}
                    **Game Mode: **${member.presence.activity.state || "None"}
                    **Party Size: **${member.presence.activity.party === null ? "None" : `${member.presence.activity.party.size[0]}/${member.presence.activity.party.size[1]}`}`) 
                }
                }
                message.say(e)
        break;
        case "STREAMING":
        const body = await fetch(`https://api.twitch.tv/kraken/channels/${encodeURIComponent(member.presence.activity.url.replace("https://www.twitch.tv/", ""))}?client_id=${apis.twitch}`).then(response => response.json()).catch(() => {console.log(`ERROR... Streaming..`) });
        if(body.status === 400){
            e.addField(`Info`, `I couldn't fetch any data on this streamer`)
            return message.say(e)
        }
        if(body.logo !== null) {e.setThumbnail(body.logo)}
        if(body.video_banner !== null) {e.setImage(body.video_banner)}
        e.setDescription(`
        **Name: **${body.display_name || "None"} (${body._id})
        **Status: **${body.status || "None"}
        **Game: **${body.game || "None"}
        **Partnered: **${body.partner ? "Yes" : "No"}
        **Mature: **${body.mature ? "Yes" : "No"}
        **Followers: **${body.followers || "0"}
        **Views: **${body.views || "0"}
        **URL: **${body.url || "None"}
        `)
        .addField(`Streaming`, member.presence.activity.name)
        message.say(e)
        break;
        case "LISTENING":
        e.setDescription(`
        **Listening To: **${member.presence.activity.name}
        ${member.presence.activity.assets ?  `
        **Album: **${member.presence.activity.assets.largeText}
        **Artist: **${member.presence.activity.state}
        **Song: **${member.presence.activity.details}
        **URL: **https://open.spotify.com/track/${member.presence.game.syncID}
        ` : ""}
        `)
        if(member.presence.activity.assets !== null) e.setThumbnail(`https://i.scdn.co/image/${member.presence.activity.assets.largeImage.slice(8)}`)
        message.say(e)
        break;
        case "WATCHING":
        e.setDescription(`**Watching: **${member.presence.activity.name}`)
        message.say(e)
        break;
        default: 
        e.setDescription(`**Game: **Nothing.`)
        message.say(e)
        break;
    }
}
    } catch (e) {
    this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}