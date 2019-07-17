const { Command, Translate } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'translate',
            memberName: 'translate',
            aliases: [`ts`],
            examples: [`${client.commandPrefix}translate `],
            description: `Translate the text into the one you choose, Do \`${client.commandPrefix}translate list\` to see the available languages!`,
            group: 'info',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "to",
                    prompt: "What do you want it translated to?",
                    type: "string",
                    default: ""
                },
                {
                    key: "content",
                    prompt: "What do you want to translate?",
                    type: "string",
                    default: ""
                }
            ]
        })
    }
    async run(message, args) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        let res = await this.client.f.API('translate');
        if(!res) return message.channel.send(`There was an error while running this command!`);
        if(args.to.toLowerCase() === "list"){
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setDescription(await res.map(c => `${c.name} (${c.value})`))
                .addField(`Note`, `Do \`${this.client.commandPrefix}${this.name} languageto text you want translated here\`\nExample: \`${this.client.commandPrefix}${this.name} fr Hello, how are you?\``)
            try{
            return message.author.send(e)
            }catch(e){
                return message.channel.send(`ERROR:\nI couldn't dm you the list!`)
            }
        }
        Translate(args.content, {from: "auto", to: args.to }).then(async res => {
            let e = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(message.guild.color)
            .setTimestamp()
            .setTitle(`Translation`)
            .setDescription(`From: ${res.from.language.iso.toUpperCase()}\nTo: ${args.to.toUpperCase()}`)
            .addField(`Before`, args.content)
            .addField(`After`, res.text)
            message.channel.send(e);
            // console.log(res)
        }).catch(err => {
            console.error(err);
        });
    }
}