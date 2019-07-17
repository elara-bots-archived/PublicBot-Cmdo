const { Command, Morse } = require('elaracmdo'),
    Discord = require('discord.js');
const morse = Morse.create('ITU');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "encode",
            memberName: "encode",
            aliases: [],
            examples: [`${client.commandPrefix}encode <text here>`],
            description: "Turns the text you give into morse code",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Please Provide the text you want me to turn into morse code?!',
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
        let color;
        if(message.guild){
            color = message.member.displayColor;
        }else{
            color = "RANDOM";
        }
        const e = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(color)
        .setTitle(`Morse Code Translator`)
        .setTimestamp()
            let translated = morse.encode(content);
            e.addField('📥 Original 📥', content, false)
            .addField('📤 Encoded 📤', translated, false)
        return message.channel.send(e)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}