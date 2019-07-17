const { Command, RichDisplay } = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client,{
                name: "emojis",
                memberName: "emojis",
                group: "server",
                description: "Shows servers emojis",
                examples: [`${client.commandPrefix}emojis`],
                guildOnly: true,
                aliases: ["emotes"],
                throttling: {
                    usages: 1,
                    duration: 5
                },
            });
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(message.guild.emojis.size === 0) return message.say(`This server doesn't have any emojis.`)
            let a = [];
            let b = [];
            message.guild.emojis.forEach(e => {
                if(e.animated){
                    a.push(e)
                }else{
                    b.push(e)
                }
            })
            let e = new MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            const display = new RichDisplay(e);
            display.addPage(e => e.setDescription(a.join(' ')).setTitle(`Animated Emojis [${message.guild.emojis.filter(e => e.animated).size}]${message.guild.emojis.filter(e => e.animated).size >= 50 ? " - Max Emojis" : ""}`)).setFooterPrefix(`Emojis `).setFooterSuffix(' ')
            display.addPage(e => e.setDescription(b.join(' ')).setTitle(`Normal Emojis [${message.guild.emojis.filter(e => !e.animated).size}]${message.guild.emojis.filter(e => !e.animated).size >= 50 ? " - Max Emojis" : ""}`))
        
          display.run(await message.channel.send('Loading...'));

        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}