const { Command } = require('elaracmdo'),
    Discord = require('discord.js'),
    superagent = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ship",
            memberName: "ship",
            aliases: ["shipit"],
            group: "fun",
            guildOnly: true,
            examples: [`${client.commandPrefix}ship <@user> <@user>`],
            description: "Ships two members",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "shipper",
                    prompt: "Who do you want to ship?",
                    type: "member"
                },
                {
                    key: "shipped",
                    prompt: "Who do you want to ship with the first person?",
                    type: "member"
                }
            ]
        })
    }
    async run(message, {shipper ,shipped}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const first_length = Math.round(shipper.user.username.length / 2);
        const first_half = shipper.user.username.slice(0, first_length);
        const second_length = Math.round(shipped.user.username.length / 2);
        const second_half = shipped.user.username.slice(second_length);
        const final_name = first_half + second_half;
        const score = Math.random() * (0, 100);
        const prog_bar = Math.ceil(Math.round(score) / 100 * 10);
        const counter = "▰".repeat(prog_bar) + "▱".repeat(10 - prog_bar);
        message.say({
            embed: {
                title: `${shipper.user.username} <a:BlobHeart:495434217652617216> ${shipped.user.username}`,
                description: `**Love %**\n${counter}\n\n${final_name}`,
                color: 6192321,
                footer: {
                    icon_url: message.author.displayAvatarURL(),
                    text: `Requested by ${message.author.tag}`
                }
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}