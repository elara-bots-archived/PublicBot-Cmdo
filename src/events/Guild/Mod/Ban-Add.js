const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildBanAdd",
            enabled: true
        })
    }
    async run(client, guild, user){
        try{
            if(await client.m(client) === true) return;
            setTimeout(async () => {
            let e = new MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setColor(`#FF0000`)
            .setTitle(`Member Banned`)
            .setTimestamp()
            .setDescription(`${user} \`@${user.tag}\` (${user.id})`)
            .setThumbnail(user.displayAvatarURL())
            let mod = [];
            if(guild.me.hasPermission('VIEW_AUDIT_LOG')){
            await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async audit => {
                let a = await audit.entries.first()
                if(a !== undefined){
                mod.push(`\n**Reason: **${a.reason ? a.reason : "None"}\n**Mod: **\`@${a.executor.tag}\` (${a.executor.id})`)
                e.setFooter(`Banned By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL()).addField(`Reason`, a.reason ? a.reason : "No Reason Provided")
                }else{
                    e.setFooter(`Banned By: ? Unknown`)
                }
            })
            }else{
                e.setFooter(`Banned By: ? Unknown... I can't view audit logs`);
            }
            await client.f.logging(client, "mod", guild, e, `🔨 Membed Banned: \`@${user.tag}\` (${user.id})${mod.length !== 0 ? mod[0] : ""}`)
        }, 1500)
        }catch(e){
            client.f.event(client, "Guild Ban Add", e.stack, guild)
        }
    }
}