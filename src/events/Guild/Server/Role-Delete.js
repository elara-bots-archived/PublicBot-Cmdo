const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "roleDelete",
            enabled: true
        })
    }
    async run(client, role){
        if(await client.m(client) === true) return;
        try {
            client.db.findOne({guildID: role.guild.id}, async (err, db) => {if(db){ if(db.welcome.role === role.id){db.welcome.role = ""; db.save().catch(err => console.log(err));console.log(`Welcome Role Deleted: ${role.guild.name}`)}}})
            let s = "**";
            let e = new MessageEmbed()
                .setColor(role.hexColor ? role.hexColor : "PURPLE")
                .setAuthor(role.guild.name, role.guild.iconURL())
                .setFooter(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
                .setTimestamp()
                .setTitle(`Role Deleted`)
                .setDescription(`
                ${s}Role: ${s}@${role.name} \`${role.name}\` (${role.id})
                ${s}Position: ${s}${role.position}${role.hoist ? `\n${s}Hoisted: ${s}Yes` : ""}${role.mentionable ? `\n${s}Mentionable: ${s}Yes` : ""}${role.hexColor !== "#000000" ? `\n${s}Color: ${s}${role.hexColor}` : ""}
                ${s}Role Created At: ${s}${moment(role.createdAt).format('dddd, MMMM Do YYYY')}`)
                let mod = [];
                if(role.guild.me.hasPermission('VIEW_AUDIT_LOG')){
                    let a = await client.f.audit(role.guild, "ROLE_DELETE")
                    if(a === undefined) {
                    e.setFooter(`Deleted By: Discord Integration`, 'https://www.logolynx.com/images/logolynx/1b/1bcc0f0aefe71b2c8ce66ffe8645d365.png')
                    }else{
                        mod.push(` - Deleted By: \`@${a.executor.tag}\` (${a.executor.id})`)
                    e.setFooter(`Deleted By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
                    }
                    }else{
                        e.setFooter(`Deleted By: ? Unknown, I can't view audit logs`)
                    }
                client.f.logging(client, 'server', role.guild, e, `🔍 Role Deleted: \`@${role.name}\` (${role.id})${mod.length !== 0 ? mod[0] : ""}`)
        } catch (e) {
            if(e.stack.includes("TypeError: Cannot read property 'hasPermission' of null")) return;
            if(e.stack.includes('DiscordAPIError: Missing Permissions')) return;
            client.f.event(client, "Role Delete", e.stack, role.guild)
        }
    }
}