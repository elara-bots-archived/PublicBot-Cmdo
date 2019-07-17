const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildBanRemove",
            enabled: true
        })
    }
    async run(client, guild, user){
        try{
            if(await client.m(client) === true) return;
            let e = new MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor(`#FF0000`)
            .setTitle(`Member Unbanned`)
            .setTimestamp()
            .setDescription(`${user} \`@${user.tag}\` (${user.id})`)
            .setThumbnail(user.displayAvatarURL())
            let mod = [];
            if(guild.me.hasPermission('VIEW_AUDIT_LOG')){
                let a = await client.f.audit(guild, "MEMBER_BAN_REMOVE")
                if(a !== undefined){
                mod.push(`\n**Reason: **${a.reason ? a.reason : "None"}\n**Mod: **\`@${a.executor.tag}\` (${a.executor.id})`)
                e.setFooter(`Unbanned By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL()).addField(`Reason`, a.reason ? a.reason : "No Reason Provided")
                }
            }else{
                e.setFooter(`Unbanned By: ? Unknown... I can't view audit logs`);
            }
            return client.f.logging(client, "mod", guild, e, `🛠 Membed Unbanned: \`@${user.tag}\` (${user.id})${mod.length !== 0 ? mod[0] : ""}`)
            
        }catch(e){
            client.f.event(client, "Guild Ban Remove", e.stack, guild)
        }
    }
}