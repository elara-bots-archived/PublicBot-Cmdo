const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const DJSUtils = require('discord.js/src/util/Util');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "emote",
            memberName: "emote",
            aliases: ["emojifind", "emojisearch"],
            examples: [`${client.commandPrefix}emote <emoji name here>`],
            description: "This will post information about the emoji you search for.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What emoji do you want me to get the info about?',
                    type: 'string'
                },
                {
                    key: "type",
                    prompt: "What type? [`default`, `link/url`]",
                    type: "string",
                    parse: str => str.toLowerCase(),
                    default: "default"
                }
            ]
        })
    }
    async run(message, { content, type }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        let t = type;
        try{
        let color = message.guild ? message.member.displayColor : message.guild.color;
        const emoji = content.split(/\s+/)[0];
        let parsedEmoji = DJSUtils.parseEmoji(emoji);
        if (/^\d{17,19}/.test(emoji)) {
            parsedEmoji = { id: String(emoji), animated: "unknown" };
        }
    let e = new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL()).setTitle(`Loading...`).setColor(color);
    let msg = await message.channel.send(e)
if(!parsedEmoji){
    e.setTitle(`ERROR`).setColor(`#FF0000`).setDescription(`Nothing found for that...`);
    return msg.edit(e)
} else if (parsedEmoji && !parsedEmoji.id) {
    e.setTitle(`INFO`).setDescription(`That isn't a custom emoji!`).setColor(`#FF0000`).setFooter(`This command only works for custom discord emojis!`);
    return msg.edit(e)
}else if (parsedEmoji && parsedEmoji.id) {
			const globalEmoji = this.client.emojis.get(parsedEmoji.id);
			if (globalEmoji) {
                if(t === 'def' || t === "default"){
                e.setDescription(`
                **Emoji: **${globalEmoji.name}
                **ID: **${globalEmoji.id}
                **Animated: **${globalEmoji.animated ? "Yes" : "No"}
                **URL: **[Click Here](${globalEmoji.url})
                **Managed by a service: **${globalEmoji.managed ? "Yes": "No"}
                **Roles: **${globalEmoji.roles.sort((a, b) => b.position - a.position).map(r => r.toString()).join("\n") ? globalEmoji.roles.sort((a, b) => b.position - a.position).map(r => `@${r.name}`).join("\n» ") : "None"}
                **Server: **${globalEmoji.guild.name} (${globalEmoji.guild.id})
                `)
                .setThumbnail(globalEmoji.url).setTitle(`Emoji`)
                return msg.edit(e)
                }else
                if(t === 'link' || t === "url"){
                    return msg.edit({embed: {description: globalEmoji.url, title: ""}});
                } 
			} else {
                if(t === 'def' || t === "default"){
                let url = `${parsedEmoji.animated !== "unknown" ? `${this.client.options.http.cdn }/emojis/${ parsedEmoji.id }.${ parsedEmoji.animated === true ? "gif" : "png" }` : ""}`
                e.setDescription(`
                **Name: **${parsedEmoji.name ? `${parsedEmoji.name}` : ""}
                **ID: **${parsedEmoji.id}
                **Animated: **${parsedEmoji.animated === "unknown" ? `Unknown.` : parsedEmoji.animated === true ? `Yes` : `No`}
                **URL: **[Click Here](${url})
                `).setThumbnail(url).setTitle(`Emoji`)
                return msg.edit(e)
                }else
                if(t === 'link' || t === "url"){
                    let url = `${parsedEmoji.animated !== "unknown" ? `${this.client.options.http.cdn }/emojis/${ parsedEmoji.id }.${ parsedEmoji.animated === true ? "gif" : "png" }` : ""}`
                    return msg.edit({embed: {description: url, title: ""}});
                }
			}
    }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
}
}