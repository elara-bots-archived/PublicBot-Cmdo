const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildMemberRemove",
            enabled: true
        })
    }
    async run(client, member){
        if(await client.m(client) === true) return;
        try{
            let {id, tag, createdAt} = member.user;
            let e = new MessageEmbed()
            .setColor(client.util.colors.red)
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor(member.guild.name, member.guild.iconURL())
            .setTitle(`Member Left${client.isOwner(id) ? " - 🛡 Bot Developer" : ""}`)
            .setDescription(`${member} \`@${tag}\` (${id})`)
            .addField('\u200b', `${member.nickname ? `**Nickname: **${member.nickname}\n` : ""}**Joined: **${moment(member.joinedAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}\n**Created: **${moment(createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}\n**Member Count: **${member.guild.memberCount}`)
            .setTimestamp()
            let roles = []
            await member.roles.filter(c => c.id !== member.guild.id).map(c => roles.push(c.name));
            if(roles.length !== 0){e.addField(`Had Role${roles.length === 1 ? "" : "s"}`, roles.join(', '), false)}
        await client.f.logging(client, 'joins', member.guild, e, `:x: Member Left: \`@${member.user.tag}\` (${member.user.id})`)
    
    
        // Kick Member
        if (member.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
            let audit = await client.f.audit(member.guild, "MEMBER_KICK");
            if (audit !== undefined) {
                    let auditEntryDate = new Date((audit.id / 4194304) + 1420070400000)
                    if (new Date().getTime() - auditEntryDate.getTime() < 3000) {
                    let mod = audit.executor
                    let reason = audit.reason ? audit.reason : 'None provided.'
                    let eb = new MessageEmbed()
                    .setAuthor(member.guild.name, member.guild.iconURL())
                    .setColor(client.util.colors.orange)
                    .setTitle(`Member Kicked`)
                    .setTimestamp()
                    .setDescription(`${member} \`@${member.user.tag}\` (${member.user.id})`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .addField(`Moderator`, `${mod} \`@${mod.tag}\` (${mod.id})`)
                    .addField(`Reason`, reason)
                    client.f.logging(client, "mod", member.guild, eb, `👢 Member Kicked: \`@${member.user.tag}\` (${member.id}) - Reason: ${reason} | Mod: \`@${mod.tag}\` (${mod.id})`)
                    }
                  }
              }
              client.db.findOne({guildID: member.guild.id}, async (err, db) => {
                if(db){
                    if(db.leaves.channel !== ''){
                        let channel = member.guild.channels.get(db.leaves.channel);
                        if(!channel) return;
                        let msg = await db.leaves.msg ? db.leaves.msg.replace("{user}", member.user.username).replace("{mention}", member).replace("{server}", member.guild.name).replace("{mc}", member.guild.memberCount) : `Goodbye **${member.user.tag}**, ${member.guild.name} won't miss you!!`;
                        if(db.leaves.embed === true){
                        let e = new MessageEmbed()
                        .setAuthor(member.user.tag, member.user.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(msg)
                        .setColor(`#FF0000`)
                        return channel.send(e).catch(o_O => {})
                        }else{
                        return channel.send(db.leaves.msg ? db.leaves.msg.replace("{user}", member.user.username).replace('{mention}', member).replace("{server}", member.guild.name).replace("{mc}", member.guild.memberCount) : `Goodbye **${member.user.tag}**, ${member.guild.name} won't miss you!!`).catch(o_O => {})
                        }
                    }
                }
            });
        }catch(e){
            if(e.stack.includes("TypeError: Cannot read property 'hasPermission' of null")) return;
            client.f.event(client, "Member Remove", e.stack, member.guild)
        }
    }
}