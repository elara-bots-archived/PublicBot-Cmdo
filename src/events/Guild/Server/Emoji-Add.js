const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "emojiCreate",
            enabled: true
        })
    }
    async run(client, emoji){
        try{
            if(await client.m(client) === true) return;
            let e = new MessageEmbed()
            .setAuthor(emoji.guild.name, emoji.guild.iconURL())
            .setColor(client.util.colors.default)
            .setTitle(`Emoji Created`)
            .setDescription(`
            **Emoji:** ${emoji}
            **Name:** ${emoji.name}
            **ID:** ${emoji.id}
            **Animated: **${emoji.animated ? "Yes": "No"}
            `)
            .setTimestamp()
            .setThumbnail(emoji.url)
        let mod = [];
        if (emoji.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
            let audit = await client.f.audit(emoji.guild, "EMOJI_CREATE")
            if(audit !== undefined){
            mod.push(` - Created By: \`@${audit.executor.tag}\` (${audit.executor.id})`)
            e.setFooter(`Created By: @${audit.executor.tag} (${audit.executor.id})`, audit.executor.displayAvatarURL())
            }
        } else {
            e.setFooter(`Created By: ? Unknown, I can't view audit logs`, "https://cdn.discordapp.com/emojis/563495918649868289.png?v=1")
        }
        return client.f.logging(client, 'server', emoji.guild, e, `🔧 Emoji Created: ${emoji} \`:${emoji.name}:\`${mod.length !== 0 ? mod[0] : ""}`)
    }catch(e){
        client.f.event(client, "Emoji Create", e.stack, emoji.guild)
    }
    }
}