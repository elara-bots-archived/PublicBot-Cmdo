const { Command } = require('elaracmdo'),
    Discord = require('discord.js'),
    figlet = require('figlet');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ascii",
            memberName: "ascii",
            aliases: ["ac"],
            examples: [`${client.commandPrefix}ascii <Text Here>`],
            description: "Turns the text you provide into ascii text.",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Please provide the text to make into ascii text!',
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
        figlet(content, (err, data) => {
            message.channel.send(data,{code: 'ascii'})
            })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}