const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'report',
             memberName: 'report',
             aliases: [],
             examples: [`${client.commandPrefix}report @user reason here`],
             description: 'Reports the user you mention to the servers staff',
             group: 'server',
             guildOnly: true,
             throttling: {
                usages: 1,
                duration: 2
            },
             args: [
                 {
                     key: "member",
                     prompt: "What member do you want to report?",
                     type: "member"
                 },
                 {
                     key: "reason",
                     prompt: "What is the reason for this report?",
                     type: "string"
                 }
             ]
})
}
        async run(message, {member, reason}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
            try{
        this.client.db.findOne({guildID: message.guild.id}, async (err, settings)  => {
            if(!settings.channels.reports){
                let e  = new Discord.MessageEmbed()
                .setColor(`#FF0000`)
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(`This server doesn't have a reports channel set!`).setTitle(`ERROR`)
                if(message.member.hasPermission("MANAGE_GUILD")){
                e.addField(`Note`, `To add one do \`${this.client.commandPrefix}config reports #channel\``)
                }
                return message.channel.send(e)
            }else{
                let reportEmbed = new Discord.MessageEmbed()
                    .setTitle("Reason")
                    .setColor(message.guild.color)
                    .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
                    .setTimestamp()
                    .setAuthor(`User Reported`, message.author.displayAvatarURL())
                    .addField(`Info`, `**Reported User: **${member} (${member.id})\n**Reported By: **${message.author} (${message.author.id})\n**Channel: **${message.channel} (${message.channel.id})`)
                    .setDescription(reason)
                let dmEmbed = new Discord.MessageEmbed()
                    .setTitle("Reason")
                    .setDescription(reason)
                    .setAuthor(`Your Report`, message.author.displayAvatarURL())
                    .setColor(message.guild.color)
                    .addField(`Info`, `**Reported User: **${member}\n**Server: **${message.guild.name}`)
                    .setTimestamp()
                message.delete().catch();
                this.client.channels.get(settings.channels.reports).send(reportEmbed);
                message.author.send(dmEmbed);
            }
        });
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
}
}