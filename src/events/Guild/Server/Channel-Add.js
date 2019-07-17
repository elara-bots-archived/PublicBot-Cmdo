const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "channelCreate",
            enabled: true
        })
    }
    async run(client, channel){
        if (channel.type === "dm" || channel.type === "group") return;
        try{
            if(await client.m(client) === true) return;
            let e = new MessageEmbed()
            .setAuthor(channel.guild.name, channel.guild.iconURL())
            .setColor(client.util.colors.green)
            .setTitle(`${channel.type.startsWith('t') ? "Text" : ""}${channel.type.startsWith('v') ? "Voice" : ""}${channel.type.startsWith('c') ? "Category" : ""} Channel Created`)
            .setDescription(`${channel} \`#${channel.name}\` (${channel.id})`)
            let mod = [];
            if(channel.guild.me.hasPermission('VIEW_AUDIT_LOG')){
            let a = await client.f.audit(channel.guild, "CHANNEL_CREATE");
            if(a !== undefined){
            let key = await a.changes.find(c => c.key === "name");
            if(key.new === channel.name === true){
            mod.push(` - Created By: \`@${a.executor.tag}\` (${a.executor.id})`)
            e.setFooter(`Created By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
            }else{
                return;
            }
            }else{
                e.setFooter(`Created By: @Discord Intergration`)
            }
            }else{e.setFooter(`Created By: ? Unknown, I can't view audit logs`)}
            return client.f.logging(client, 'server', channel.guild, e, `⚙ Channel Added: \`#${channel.name}\` (${channel.id})${mod.length !== 0 ? mod[0] : ""}`)
        }catch(e){client.f.event(client, "Channel Create", e.stack, channel.guild)}
    }
}