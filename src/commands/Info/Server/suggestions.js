const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "suggest",
            memberName: "suggest",
            aliases: ["suggestion"],
            examples: [`${client.commandPrefix}suggest <suggestion>`],
            description: "Posts your suggestion in the suggestions channel!",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "suggestion",
                    prompt: "What do you want to suggest?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {suggestion}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const settings = this.client.db;
        let e = new Discord.MessageEmbed().setAuthor(`Suggestion`, message.author.displayAvatarURL()).setColor(message.member.displayColor).setTimestamp();
        settings.findOne({guildID: message.guild.id}, async (err, data) => {
            if(data){
                if(data.suggestions.channel === "") return message.channel.send(`The server doesn't have a suggestions channel setup..`)
                let channel = this.client.channels.get(data.suggestions.channel);
                if(!channel) return message.channel.send(`I can't seem to find the suggestions channel for the server...`);
                let r1 = data.suggestions.reaction1;
                let r2 = data.suggestions.reaction2;
                e.setDescription(suggestion)
                if(message.attachments.map(c => c.proxyURL).length !== 0){
                    e.setImage(message.attachments.map(c => c.proxyURL).join(' '))
                }
                channel.send(e).then(async (m) => {
                    m.react(r1 ? r1 : "✅").then(async () => m.react(r2 ? r2 : "❌"))
                    return message.channel.send(`Alright, your suggestion has been posted to ${channel}!`)
                })
            }else{
                e.setAuthor(`ERROR`, message.author.displayAvatarURL()).setDescription(`There isn't a suggestions channel setup for the server.`);
            }
        })
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}