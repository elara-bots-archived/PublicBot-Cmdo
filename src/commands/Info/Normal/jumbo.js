const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "jumbo",
            memberName: "jumbo",
            aliases: [],
            examples: [`${client.commandPrefix}jumbo <emoji name here>`],
            description: "Makes the emoji you provide bigger",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What emoji do you want me to make jumbo size?',
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
        let parsedEmoji = await Discord.Util.parseEmoji(content.split(/\s+/)[0]);
        if (/^\d{17,19}/.test(content.split(/\s+/)[0])) {parsedEmoji = { id: String(content.split(/\s+/)[0]), animated: "unknown" };}
    if(!parsedEmoji) return this.client.error(this.client, message, `That isn't an emoji!`);
    if (parsedEmoji && !parsedEmoji.id)return this.client.error(this.client, message, `That is a unicode emoji!\n\n**This best words with custom emojis**`)
    if (parsedEmoji && parsedEmoji.id) {
            let e = new Discord.MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
			const globalEmoji = this.client.emojis.get(parsedEmoji.id);
			if(globalEmoji){e.setImage(globalEmoji.url); return message.channel.send(e);}else{e.setImage(`${parsedEmoji.animated !== "unknown" ? `${this.client.options.http.cdn }/emojis/${ parsedEmoji.id }.${ parsedEmoji.animated === true ? "gif" : "png" }` : ""}`); return message.channel.send(e)}

    }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
}
}
