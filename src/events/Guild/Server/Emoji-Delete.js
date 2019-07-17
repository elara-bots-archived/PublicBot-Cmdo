const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "emojiDelete",
            enabled: true
        })
    }
    async run(client, emoji){
        try{
            if(await client.m(client) === true) return;
            let e = new MessageEmbed()
            .setAuthor(emoji.guild.name, emoji.guild.iconURL())
            .setColor(client.util.colors.default)
            .setTitle(`Emoji Deleted`)
            .setDescription(`
            **Name:** ${emoji.name}
            **ID:** ${emoji.id}
            **URL: **[Emoji](${emoji.url})
            **Animated: **${emoji.animated ? "Yes" : "No"}
            **Created At: **${moment(emoji.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
            `)
            .setTimestamp()
            .setThumbnail(emoji.url)
            let mod = [];
            if (emoji.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
                let audit = await client.f.audit(emoji.guild, "EMOJI_DELETE")
                if(audit !== undefined){
                mod.push(` - Deleted By: \`@${audit.executor.tag}\` (${audit.executor.id})`)
                e.setFooter(`Deleted By: @${audit.executor.tag} (${audit.executor.id})`, audit.executor.displayAvatarURL())
                }
            } else {
                e .setFooter(`Deleted By: ? Unknown, I can't view audit logs`, "https://cdn.discordapp.com/emojis/563495918649868289.png?v=1")
            }
            client.f.logging(client, 'server', emoji.guild, e, `🔧 Emoji Deleted: \`:${emoji.name}:\` (${emoji.id}) Link: <${emoji.url}>${mod.length !== 0 ? mod[0] : ""}`)
    }catch(e){
        client.f.event(client, "Emoji Delete", e.stack, emoji.guild)
    }
    }
}