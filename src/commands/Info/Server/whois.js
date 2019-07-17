const {Command} = require('elaracmdo'), Discord = require('discord.js'), moment = require('moment');
require('moment-duration-format');
let types = [
    "Playing",
    "Streaming",
    "Listening",
    "Watching"
],
    status = {
    "online": "Online",
    "idle": "Idle",
    "dnd": "DND",
    "offline": "Offline"
},
    st = {
    "desktop": "🖥 Desktop",
    "mobile": "📱 Mobile",
    "web": "🌐 Web"
}
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'whois',
             memberName: 'whois',
             aliases: [`whoami`, "wi", "userinfo", "ui"],
             examples: [`${client.commandPrefix}whois @user/userid`],
             description: 'Posts the information about the user you mention',
             group: 'server',
             guildOnly: true,
             throttling: {
                   usages: 2,
                   duration: 3
            },
            args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to checkout?',
                    type: 'user',
                    default: message => message.author
                }
              ]
})
}
        async run(message, {user}) {
            if(await this.client.b(this.client, message) === true) return;
            if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
            if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
            
            const client = this.client;
            try{
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp()
            .addField(`User`, `${user} \`@${user.tag}\` (${user.id})`, true)
            .addField(`Discriminator`, `#${user.discriminator}`, true)
            .addField(`Avatar`, `[Click Here](${user.displayAvatarURL()})`, true)
            if(user.displayAvatarURL().toLowerCase().includes('.gif')){
                e.addField(`Nitro/Partner`, `Nitro/Partner User`, true)
            }else{
                e.addField(`Nitro/Partner`, `Normal User`, true)
            }
            if(user.bot === true){
                e.addField(`Bot`, user.bot ? `Bot Account` : "User Account", true)
            }
            let createweek = await client.f.weeks(user.createdAt), createday = await client.f.days(user.createdAt);


            if(message.guild.members.get(user.id)){
            let member = await message.guild.members.get(user.id), joinweek = await client.f.weeks(member.joinedAt), joinday = await client.f.days(member.joinedAt);
            
            
            if(member.nickname !== null) e.addField(`Nickname`, member.nickname, true)   
            if(member.presence.clientStatus !== null){
            let active;
            if(member.presence.clientStatus.desktop) active = "desktop"
            if(member.presence.clientStatus.mobile) active = "mobile"
            if(member.presence.clientStatus.web) active = "web"
            if(st[active] !== undefined){
            e.addField(`Active on`, st[active], true)
            }
            }
            if (member.presence.activity !== null) { 
                e.addField(`Playing Status`, 
                `**Status:** ${status[member.presence.status]}
                ${member.presence.game ? `**Game:** ${member.presence.activity.name}` : ''}
                **Type:** ${types[member.presence.activity.type]}
                `, true) 
            }
            e.addField(`Joined At`, `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}, ${joinweek !== "0 weeks ago" ? joinweek : joinday}`)
            e.addField(`Created Account`, `${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}, ${createweek !== "0 weeks ago" ? createweek : createday}`)
            e.addField('Highest Role', `${member.roles.size > 1 ? `**Name: **${member.roles.highest}` : 'None'}${member.roles.size > 1 ? `\n**ID: **${member.roles.highest.id}` : ""}${member.roles.size > 1 ? `\n**Hoisted: **${member.roles.highest.hoist ? "Yes" : "No"}` : ""}`, true)
            .addField(`Permissions`, `Do \`${message.guild ? message.guild._commandPrefix ? message.guild._commandPrefix: client.commandPrefix : client.commandPrefix}perms ${message.author.id === user.id ? `` : `@${user.tag}`}\``, true)
            .addField(`Role${member.roles.size-1 === 1 ? "" : "s"}`, member.roles.sort((a, b) => b.position - a.position).filter(c => c.id !== member.guild.id).map(c => c).join(' | ') || "None", true)
            }else{
                    if(user.presence.clientStatus !== null){
                    let active;
                    if(user.presence.clientStatus.desktop) active = "desktop"
                    if(user.presence.clientStatus.mobile) active = "mobile"
                    if(user.presence.clientStatus.web) active = "web"
                    if(st[active] !== undefined){
                    e.addField(`Active on`, st[active], true)
                    }
                    }
                    e.addField(`Created Account`, `${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}, ${createweek !== "0 weeks ago" ? createweek : createday}`)
            }
            message.channel.send(e);
            } catch (e) {
                
                this.client.error(this.client, message, e);
                this.client.f.logger(this.client, message, e.stack)
            }
}
}