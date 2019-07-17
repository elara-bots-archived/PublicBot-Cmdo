const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const request = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "roles",
            memberName: "roles",
            aliases: ["serverroles"],
            examples: [`${client.commandPrefix}roles`],
            description: "Gives you a list of all of the roles in the server.",
            group: "server",
            guildOnly: true,
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
            
            let e = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(message.member.displayColor)
            .setTimestamp()
            .setTitle(`Server Roles`)
            let data = [];
            message.guild.roles.sort((a,b) => b.position - a.position).forEach(r => {
                if(r.id === message.guild.id) return;
                data.push(`${r} (${r.id})`)
            });
            if(data.join('\n').length < 2048){
            e.setDescription(data.join('\n'))
            return message.channel.send(e)
            }else{
            let db = [];
            message.guild.roles.sort((a,b) => b.position - a.position).forEach(r => {
                if(r.id === message.guild.id) return;
                db.push(`${r.name} (${r.id}) [${r.hexColor}]`)
            })
            let link = await this.client.f.bin("Server Roles", db.join('\n'))
            e.setDescription(`To many roles in the server. [List](${link})`)
            return message.channel.send(e)
            }
            
}catch(e){
    this.client.error(this.client, message, e);
  this.client.f.logger(this.client, message, e.stack)
}
    }
}