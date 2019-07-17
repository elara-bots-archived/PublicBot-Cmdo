const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildMemberUpdate",
            enabled: true
        })
    }
    async run(client, o, m){
        try{
            let e = new MessageEmbed()
            .setAuthor(m.guild.name, m.guild.iconURL())
            .setTitle(`Member Update`)
            .setTimestamp()
            .setColor(client.util.colors.default)
            .setDescription(`${m} \`@${m.user.tag}\` (${m.user.id})`)
            if(o.nickname !== m.nickname) {
                e.addField(`Nickname`, `
                **Old: **${o.nickname ? o.nickname : o.user.username}
                **New: **${m.nickname ? m.nickname : m.user.username}
                `)
                let mod = [];
                if(m.guild.me.hasPermission('VIEW_AUDIT_LOG')){
                let mu = await client.f.audit(m.guild, "MEMBER_UPDATE")
                if(mu.executor !== undefined){
                if(mu.executor.id !== m.user.id){
                if(await client.f.logbots(client, m, mu.executor) === true) return;
                mod.push(` | Updated By: \`@${mu.executor.tag}\` (${mu.executor.id})`)
                e.setFooter(`Updated By: @${mu.executor.tag} (${mu.executor.id})`, mu.executor.displayAvatarURL())
                }
                }
            }else{
                e.setFooter(`Updated By: ? Unknown, I can't view audit logs`)
                }
                return client.f.logging(client, 'server', m.guild, e, `📝 Nickname Updated: \`@${m.user.tag}\` (${m.user.id})${mod.length !== 0 ? mod[0] : ""}\n**Old: **${o.displayName}\n**New: **${m.displayName}`)
            }else
            if (o.roles !== m.roles) {
                let oldRoles = o.roles.map(role => role.id)
                let newRoles = m.roles.map(role => role.id)
                if (oldRoles == newRoles) return;
                let data = [], c = [];
                oldRoles.forEach(async role => {
                if(!newRoles.includes(role)){
                    let r = m.guild.roles.get(role);
                    c.push(r.hexColor);
                    data.push(`❌ ${r} \`@${r.name}\` (${r.id})`)
                }
                }) 
                newRoles.forEach(async role => {
                    if(!oldRoles.includes(role)) {
                        let r = m.guild.roles.get(role);
                        c.push(r.hexColor);
                        data.push(`✅ ${r} \`@${r.name}\` (${r.id})`)
                    }
                });
                if(data.length === 0) return;
                e.setColor(c[0] === "#000000" ? client.util.colors.default : c[0])
                if(data.join("\n").length >= 1020){
                e.addField(data.length > 1 ? "Multiple Roles Manipulated" : "Roles Manipulated", data.slice(0, 10).join('\n'))
                if(data.slice(10, 20).join('\n').length !== 0) e.addField(`\u200b`, data.slice(10, 20).join('\n'))
                if(data.slice(20, 30).join('\n').length !== 0) e.addField(`\u200b`, data.slice(20, 30).join('\n'))
                if(data.slice(30, 40).join('\n').length !== 0) e.addField(`\u200b`, data.slice(30, 40).join('\n'))
                if(data.slice(40, 50).join('\n').length !== 0) e.addField(`\u200b`, data.slice(40, 50).join('\n'))
                }else{
                e.addField(data.length > 1 ? "Multiple Roles Manipulated" : "Roles Manipulated", data.join('\n'))
                }
                if(m.guild.me.hasPermission('VIEW_AUDIT_LOG')){
                let a = await client.f.audit(m.guild, "MEMBER_ROLE_UPDATE")
                if(a !== undefined){
                if(await client.f.logbots(client, m.guild, a.executor) === true) return;
                if(a.executor.id !== m.user.id){
                    e.setFooter(`Updated By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
                }
                }else{
                    e.setFooter(`Updated By: @Discord Intergration`)
                }
                }else{
                e.setFooter(`Updated By: ? Unknown, I can't view audit logs`)
                }
                return client.f.logging(client, 'server', m.guild, e)
        }
    }catch(e){
        if(e.stack.includes('DiscordAPIError: Missing Permissions')) return;
        client.f.event(client, "Member Update", e.stack, m.guild)
    }
    }
}
