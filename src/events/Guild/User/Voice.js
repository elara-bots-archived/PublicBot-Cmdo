const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "voiceStateUpdate",
            enabled: true
        })
    }
    async run(client, o, n){
    try{
    let member = n.guild.members.get(n.id), guild = n.guild;
    if(await client.m(client) === true || await client.f.logbots(client, guild, member.user)) return;
    const oc = await guild.channels.get(o.channelID), nc = await guild.channels.get(n.channelID)
    let e = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTitle(`Voice Update`)
    .setDescription(`${member.user} \`@${member.user.tag}\` (${member.user.id})`)
    .setColor(guild.members.get(member.user.id).displayColor === "#000000" ? client.util.colors.default : guild.members.get(member.user.id).displayColor)
    if(o.serverMute !== n.serverMute){
        if (guild.me.hasPermission("VIEW_AUDIT_LOG")) {
            let audit = await client.f.audit(guild, "MEMBER_UPDATE");
            if (audit !== undefined) {
                    let auditEntryDate = new Date((audit.id / 4194304) + 1420070400000)
                    if (new Date().getTime() - auditEntryDate.getTime() < 3000) {
                    if(audit.executor.id === member.user.id) return;
                    let eb = new MessageEmbed()
                    .setAuthor(guild.name, guild.iconURL())
                    .setTitle(`[Voice] - ${n.serverMute ? "Muted" : "Unmuted"}`)
                    .setTimestamp()
                    .setDescription(`${member} \`@${member.user.tag}\` (${member.user.id})`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter(`Updated By: @${audit.executor.tag} (${audit.executor.id})`, audit.executor.displayAvatarURL())
                    audit.reason ? eb.addField(`Reason`, audit.reason) : ''
                    n.serverMute ? eb.setColor(`#FF0000`) : eb.setColor(`#FF000`)
                    return client.f.logging(client, 'vclogs', guild, eb, `${n.serverMute ? "🔇" : "🔈"} Voice Update: \`@${member.user.tag}\` (${member.user.id}) has been ${n.serverMute ? "Muted" : "Unmuted"} in ${nc} (${nc.id}) | By: \`@${audit.executor.tag}\` (${audit.executor.id})`)
                    }
                  }
              }
    }
    if(oc === nc) return;
    if(oc === undefined){
        e.addField(`Joined Chat`, `${nc} (${nc ? nc.id : "ID Unknown?"})`, true)
        return client.f.logging(client, 'vclogs', guild, e, `🔊 Voice Update: \`@${member.user.tag}\` (${member.user.id}) has joined ${nc} (${nc.id})`)
    }else
    if(nc === undefined){
        if(oc === undefined) return;
        e.addField(`Left Chat`, `${oc} (${oc ? oc.id : "ID Unknown?"})`, true)
        return client.f.logging(client, 'vclogs', guild, e, `🔊 Voice Update: \`@${member.user.tag}\` (${member.user.id}) has left ${oc} (${oc ? oc.id : "ID Unknown?"})`)
    }else{
        e.addField(`Switched Chats`, `**Old: **${oc} (${oc.id})\n**New: **${nc} (${nc.id})`, true)
        return client.f.logging(client, 'vclogs', guild, e, `🔊 Voice Update: \`@${member.user.tag}\` (${member.user.id}) has switched voice channels\n**Old: **${oc} (${oc.id})\n**New: **${nc} (${nc.id})`)
    }
}catch(e){
    client.f.event(client, "Voice State Update", e.stack)
}
    }
}