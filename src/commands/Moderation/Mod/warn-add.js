const {Command} = require('elaracmdo'),
Discord = require('discord.js');
const moment = require('moment');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'warn',
             memberName: 'warn',
             aliases: [`strike`],
             examples: [`${client.commandPrefix}warn @user reason`],
             description: 'Warns the user that you mention',
             userPermissions: ["MANAGE_MESSAGES"],
             group: 'mod',
             args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to warn?',
                    type: 'member'
                },
                {
                    key: "reason",
                    prompt: "What is the reason for this warn?",
                    type: "string"
                }
              ]
})
}
        async run(message, {member, reason}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
            try{
            if(message.author.id === member.id) return message.channel.send(`You can't warn yourself! :face_palm:`);
            let e = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(this.client.util.colors.red)
            .setDescription(`You can't warn a bot! ${this.client.util.emojis.robot}`)
            .setTitle(`ERROR`)
            .setTimestamp()
            .setThumbnail("https://vgy.me/1SuBGQ.gif")
            if(member.user.bot) return message.channel.send(e);
        this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
                let warning = {
                    case: db.warnings.length + 1,
                    id: member.id,
                    mid: message.author.id,
                    user: member.user.tag,
                    mod: `@${message.author.tag} (${message.author.id})`,
                    reason: reason,
                    date: moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ssa')
                }
                db.warnings.push(warning);
                db.save().catch(err => console.log(err));
                let emb = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle(`Case: ${warning.case} | Warn`)
                .setColor(`#FF0000`)
                .setThumbnail(member.user.displayAvatarURL())
                .addField(`User`, `${member} (${member.id})`, true)
                .addField(`Moderator`, `${message.author} (${message.author.id})`, true)
                .addField(`Reason`, reason)
                .setTimestamp()
                this.client.f.logging(this.client, 'actionlog', message.guild, emb)
                let embed = new Discord.MessageEmbed()
                    .setDescription(`${this.client.util.emojis.semoji} ${member} has been warned.`)
                    .setColor(message.guild.color)
                    .setAuthor(message.guild.name, message.guild.iconURL())
                let m = await message.channel.send(embed)
                let e = new Discord.MessageEmbed()
                .setColor(`#FF0000`)
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`You have been warned in ${message.guild.name}`)
                .addField(`Reason`, reason)
                member.send(e).catch(err => {
                if(err){
                let e = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor(`#FF0000`)
                .setDescription(`${this.client.util.emojis.nemoji} ${member}'s dms are off, The warning has been logged`)
                m.edit(e)
                }
                });
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
}
}