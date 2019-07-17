const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reverse",
            memberName: "reverse",
            aliases: [],
            examples: [`${client.commandPrefix}reverse <text here>`],
            description: "Reverses the text you give the bot.",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What do you want me to reverse?',
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
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
        let sreverse = reverseString(content)
        const reverseEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setColor(0xFFF000)
            .addField('Input: ', '```' + `${content}` + '```')
            .addField('Output: ', '```' + `${sreverse}` + '```')
        message.channel.send({ embed: reverseEmbed })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}