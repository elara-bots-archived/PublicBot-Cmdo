const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const { Canvas } = require("canvas-constructor");
const {get} = require("superagent");

module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "beautiful",
            memberName: "beautiful",
            aliases: [`admire`],
            examples: [],
            description: "Admires someone profile photo",
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
        
        try{
            let avatar = await get(user.displayAvatarURL().replace('.gif', '.png'));
            // Wanted: https://i.imgur.com/kCh9KN7
            let {body} = await get('https://i.imgur.com/YOVFg2Z.png');
                    let canvas = new Canvas(634, 675)
                        .setColor("#363940")
                        .addRect(0, 0, 634, 675)
                        .addImage(avatar.body, 423, 45, 168, 168)
                        .addImage(avatar.body, 426, 382, 168, 168)
                        .addImage(body, 0, 0, 634, 675);
                    let i = new Discord.MessageAttachment(await canvas.toBuffer(), "boop.png");
                    let e = new Discord.MessageEmbed()
                    .attachFiles(i)
                    .setImage("attachment://boop.png")
                    .setColor(message.guild.color)
                    .setAuthor(user.tag, user.displayAvatarURL())
                    .setFooter(`Admired By: ${message.author.tag}`, message.author.displayAvatarURL())
                    message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
