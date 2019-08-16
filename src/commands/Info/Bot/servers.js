const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const request = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "servers",
            memberName: "servers",
            aliases: [],
            examples: [`${client.commandPrefix}servers`],
            description: "Gives you the list of servers the bot is in.",
            group: "bot",
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let str = '';
        this.client.guilds.forEach(guild => {str += `
        **Name: **${guild.name}
        **MemberCount: **
        - Total: ${guild.memberCount}
        - Humans: ${guild.members.filter(m => !m.user.bot).size}
        - Bots: ${guild.members.filter(m => m.user.bot).size}\n\n`})
        if(str.length < 2000){
            let e = new Discord.MessageEmbed()
                .setColor(message.guild.color)
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(str)
                .setTitle(`List of Servers`)
            message.channel.send(e)
        }else{
        let string = '';
        this.client.guilds.forEach(guild => { string += `Name: ${guild.name}\nMemberCount: ${guild.memberCount}\nHumans: ${guild.members.filter(m => !m.user.bot).size}\nBots: ${guild.members.filter(m => m.user.bot).size}` + '\n\n'; })
        let link = await this.client.f.bin("List of servers", string);
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
        .setDescription(`List of Servers: [Click Here](${link})`)
        message.channel.send(e)
        }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
