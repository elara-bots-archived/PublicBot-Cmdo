const {Command} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'diagnose',
      memberName: 'diagnose',
      aliases: [`dn`],
      examples: [`${client.commandPrefix}diagnose [server id] <user/channel id>`],
      description: 'Diagnoses the server/channel/user id you provide',
      group: 'owner',
      hidden: true,
      ownerOnly: true,
      args: [
          {
              key: "server",
              prompt: "What is the server ID?",
              type: "string"
          },
          {
              key: "args",
              prompt: "Please provide a user id",
              type: "string",
              default: ''
          }
      ]
})
}
        async run(message, {server, args}) {
            let e = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(`Loading...`)
            .setColor(message.guild.color)
            let msg = await message.channel.send(e)
            try{
        let guild = await this.client.guilds.get(server);
        if(!guild){
            e.setTitle(`ERROR`).setDescription(`Server not found.`).setColor(this.client.util.colors.red)
            return msg.edit(e)
        }
        if(args !== ""){
            let user = await this.client.f.mention(this.client, args)
            if(!user){
                e.setTitle(`ERROR`).setDescription(`[User] - Not found`).setColor(this.client.util.colors.red);
                return msg.edit(e)
            }
            let member = await guild.members.get(user.id)
            e.setTitle(`Member Info for ${guild.name}`)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`${user} \`@${user.tag}\` (${user.id})`)
            if(member.hasPermission("ADMINISTRATOR")){
            e.addField(`Permissions?`, `${this.client.util.emojis.semoji} Has all permissions`)
            }else{
            e.addField(`Permissions?`, `
            **Administrator: **${member.hasPermission('ADMINISTRATOR') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Manage Server: **${member.hasPermission('MANAGE_GUILD') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Ban Members: **${member.hasPermission('BAN_MEMBERS') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Kick Members: **${member.hasPermission('KICK_MEMBERS') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Manage Roles: **${member.hasPermission('MANAGE_ROLES') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Manage Nicknames: **${member.hasPermission('MANAGE_NICKNAMES') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Manage Emojis: **${member.hasPermission('MANAGE_EMOJIS') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            **Manage Messages: **${member.hasPermission('MANAGE_MESSAGES') ? this.client.util.emojis.semoji : this.client.util.emojis.nemoji}
            `)
            }
            if(guild.ownerID === member.id) e.setFooter(`Server Owner`, member.user.displayAvatarURL())
            msg.edit(e)
        }else{
            await this.client.db.findOne({guildID: guild.id}, async (err, db) => {
            if(db){
            let data = [];
            let types = [];
            let channels = [
                {
                    channel: db.channels.log.all,
                    name: "Modlogs-All"
                },
                {
                    channel: db.channels.log.mod,
                    name: "Modlogs-Mod"
                },
                {
                    channel: db.channels.log.user,
                    name: "Modlogs-User"
                },
                {
                    channel: db.channels.log.server,
                    name: "Modlogs-Server"
                },
                {
                    channel: db.channels.log.messages,
                    name: "Modlogs-Messages"
                },
                {
                    channel: db.channels.log.joins,
                    name: "Modlogs-Joins"
                },
                {
                    channel: db.channels.reports,
                    name: "Reports"
                },
                {
                    channel: db.channels.vclogs,
                    name: "Voice"
                },
                {
                    channel: db.channels.action,
                    name: "Action"
                },
                {
                    channel: db.channels.commands,
                    name: "Commands"
                },
                {
                    channel: db.welcome.channel, 
                    name: "Welcome-Channel"
                },
                {
                    channel: db.leaves.channel,
                    name: "Leaves-Channel"
                }
            ]
            await channels.forEach(async channel => {
                if(channel.channel !== ""){
                    let ca = await guild.channels.get(channel.channel);
                    types.push(channel.name)
                    if(ca !== null && ca !== undefined){
                        data.push(ca.permissionsFor(guild.me).has(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES'])  ? `${this.client.util.emojis.semoji} Good` : `${this.client.util.emojis.nemoji}Missing Permissions`)
                    }else{
                        data.push(`${this.client.util.emojis.eplan} Not Set`)
                    }
                }
            })
            if(db.welcome.role !== ""){
                let role = await guild.roles.get(db.welcome.role);
                if(role !== null || role !== undefined){
                    if(role.editable === false){
                        e.addField(`Welcome-Role`, `${this.client.util.emojis.nemoji}Missing Permissions`, true)
                    }else{
                        e.addField(`Welcome-Role`, `${this.client.util.emojis.semoji} Good`, true)
                    }
                }
            }
            e.setTitle(`Server Diagnosis`)
            .setAuthor(guild.name, guild.iconURL())
            .setTimestamp()
            .setFooter(`Requested By: @${message.author.tag}`, message.author.displayAvatarURL())
            let num = -1;
            await data.forEach(async t => {
                num++
                e.addField(types[num], t, true)
            })
            return msg.edit(e)
        }
        }).catch(err => {
            e.setTitle(`ERROR`)
            .setDescription(err).setColor(`#FF0000`)
            return msg.edit(e)
        })
        }
    }catch(err){
        e.setTitle(`ERROR`)
        .setDescription(err).setColor(`#FF0000`)
        return msg.edit(e)
    }
};
}