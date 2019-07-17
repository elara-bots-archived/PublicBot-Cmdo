const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const { Canvas } = require("canvas-constructor");
const { get } = require('superagent');

module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "wanted",
            memberName: "wanted",
            aliases: [],
            examples: [],
            description: "Makes a wanted photo of someones profile photo",
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to make beautiful? xd',
                    type: 'user'
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
                let avatar = await get(await user.displayAvatarURL().replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, `${user.displayAvatarURL().includes('.gif') ? ".gif": ".png"}?size=256`));
                let {body} = await get('https://i.imgur.com/kCh9KN7.gif');
                let canvas = new Canvas(400, 562)
                        .setColor(`#000000`)
                        .addRect(0, 0, 400, 562)
                        .addImage(body, 0, 0, 400, 562)
                        .addImage(avatar.body, 86, 178, 228, 228)
                        let i = new Discord.MessageAttachment(await canvas.toBuffer(), `boop${user.displayAvatarURL().includes(".gif") ? ".gif": ".png"}`);
                        let e = new Discord.MessageEmbed()
                        .attachFiles(i)
                        .setImage(`attachment://boop.png`)
                        .setColor(message.guild.color)
                        .setAuthor(user.tag, user.displayAvatarURL())
                        .setFooter(`Wanted By: ${message.author.tag}`, message.author.displayAvatarURL())
                        message.channel.send(e)
        
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}