const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "roleCreate",
            enabled: true
        })
    }
    async run(client, role){
        try{
            if(await client.m(client) === true) return;
        let e = new MessageEmbed()
            .setColor("#FF000")
            .setAuthor(role.guild.name, role.guild.iconURL())
            .setTimestamp()
            .setTitle(`Role Created`)
            .setDescription(`${role} \`${role.name}\` (${role.id})`)
            let mod = [];
               if(role.guild.me.hasPermission('VIEW_AUDIT_LOG')){
                let a = await client.f.audit(role.guild, "ROLE_CREATE")
                if(a !== undefined){
                mod.push(` - Created By: \`@${a.executor.tag}\` (${a.executor.id})`)
                e.setFooter(`Created By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
                }else{
                    e.setFooter(`Created By: @Discord Intergration`)
                }
                }else{
                    e.setFooter(`Created By: ? Unknown, I can't view audit logs`)
                }
        client.f.logging(client, 'server', role.guild, e, `🔍 Role Created: \`@${role.name}\` (${role.id})${mod.length !== 0 ? mod[0] : ""}`)
        }catch(e){
            if(e.stack.includes('DiscordAPIError: Missing Permissions')) return;
            client.f.event(client, "Role Create", e.stack, role.guild)
        }
    }
}