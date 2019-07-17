const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "emojiUpdate",
            enabled: true
        })
    }
    async run(client, oldEmoji, emoji){
        try{
            if(await client.m(client) === true) return;
            let e = new MessageEmbed()
            .setAuthor(emoji.guild.name, emoji.guild.iconURL())
            .setColor(client.util.colors.default)
            .setTitle(`Emoji Updated`)
            .setDescription(`
            **Emoji:** ${emoji}
            **ID:** ${emoji.id}`)
            .setTimestamp()
            .setThumbnail(emoji.url)
            if(oldEmoji.name !== emoji.name) e.addField(`Name`, `**Old: **${oldEmoji.name}\n**New: **${emoji.name}`)
            if(oldEmoji === emoji && oldEmoji.name === emoji.name) return;
            let mod = [];
            if (emoji.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
                let audit = await client.f.audit(emoji.guild, "EMOJI_UPDATE")
                if(audit !== undefined){
                mod.push(` - Updated By: \`@${audit.executor.tag}\` (${audit.executor.id})`)
                e .setFooter(`Updated By: @${audit.executor.tag} (${audit.executor.id})`, audit.executor.displayAvatarURL())
                }
            } else {
                e .setFooter(`Updated By: ? Unknown, I can't view audit logs`, "https://cdn.discordapp.com/emojis/563495918649868289.png?v=1")
            }
            client.f.logging(client, 'server', emoji.guild, e, `🔧 Emoji Updated: ${emoji} **__Name:__** Old: ${oldEmoji.name} | New: ${emoji.name}\n${mod.length !== 0 ? mod[0] : ""}`)
    }catch(e){
        client.f.event(client, "Emoji Update", e.stack, emoji.guild)
    }
    }
}