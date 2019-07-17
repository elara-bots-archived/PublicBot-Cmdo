const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "channelUpdate",
            enabled: true
        })
    }
    async run(client, oldChannel, newChannel){
        if(await client.m(client) === true) return;
        try{
            let e = new MessageEmbed()
            .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
            .setColor(client.util.colors.yellow)
            .setTimestamp()
            .setTitle(`Channel Updated`)
            .setDescription(`${newChannel} \`#${newChannel.name}\` (${newChannel.id})`)
            let mod = [];
            if(newChannel.guild.me.hasPermission('VIEW_AUDIT_LOG')){
            let a = await client.f.audit(newChannel.guild, "CHANNEL_UPDATE")
            if(a !== undefined){
            if(await client.f.logbots(client, newChannel.guild, a.executor) === true) return;
            mod.push(` - Updated By: \`@${a.executor.tag}\` (${a.executor.id})`)
            e.setFooter(`Updated By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
            }
            }else{
                e.setFooter(`Updated By: ? Unknown, I can't view audit logs`)
            }
            oldChannel.topic ? e.addField(`Old Topic`, oldChannel.topic || "None"): "";
            newChannel.topic ? e.addField(`New Topic`, newChannel.topic || "None"): "";
            if(oldChannel.name !== newChannel.name) e.addField(`Name`, `**Old: **${oldChannel.name}\n**New: **${newChannel.name}`)
            if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser){
                const time = {
                    "0": "Off",
                    "5": "5 Seconds",
                    "10": "10 Seconds",
                    "15": "15 Seconds",
                    "30": "30 Seconds",
                    "60": "1 Minute",
                    "120": "2 Minutes",
                    "300": "5 Minutes",
                    "600": "10 Minutes",
                    "900": "15 Minutes",
                    "1800": "30 Minutes",
                    "3600": "1 Hour",
                    "7200": "2 Hours",
                    "21600": "6 Hours"
                    }
                e.addField(`Rate Limit Per User`, `
                **Old: **${time[oldChannel.rateLimitPerUser]}
                **New: **${time[newChannel.rateLimitPerUser]}
                `)
            }
            if(oldChannel.nsfw !== newChannel.nsfw) e.addField(`NSFW`, `**Old: **${oldChannel.nsfw ? "Enabled" : "Disabled"}\n**New: **${newChannel.nsfw ? "Enabled" : "Disabled"}`)
            if(e.fields.length === 0) return;
            if(oldChannel.topic === newChannel.topic && oldChannel.name === newChannel.name && oldChannel.nsfw === newChannel.nsfw && oldChannel.rateLimitPerUser === newChannel.rateLimitPerUser) return;
            return client.f.logging(client, 'server', newChannel.guild, e, `⚙ Channel Updated: \`#${newChannel.name}\` (${newChannel.id})${mod.length !== 0 ? mod[0] : ""}`)
    }catch(e){
        client.f.event(client, "Channel Update", e.stack, newChannel.guild)
    }
    }
}