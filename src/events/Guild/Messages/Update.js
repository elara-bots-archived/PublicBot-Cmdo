const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "messageUpdate",
            enabled: true
        })
    }
    async run(client, o, m){
        if (o.channel.type === "dm" || o.content === m.content || o.content.length === 0 || m.author.bot) return;
        if(await client.m(client) === true) return;
        try{
        if(await client.f.ignore(client, m.guild, m.channel.id) === true) return;
        let e = new MessageEmbed()
        .setAuthor(m.guild.name, m.guild.iconURL())
        .setColor(client.util.colors.yellow)
        .setTitle(`Message Update`)
        .setTimestamp()
        .setDescription(`${m.author} \`@${m.author.tag}\` (${m.author.id})\n**Channel: **${m.channel} \`#${m.channel.name}\` (${m.channel.id})\n[**Jump To Message**](${m.url})`)
        if(o.content.length >= 1020){
            e.addField(`Before`, o.content.slice(0, 1020)).addField(`\u200b`, o.content.slice(1020, 2048))
        }else{
            e.addField(`Before`, o.content || "None")
        }
        if(m.content.length >= 1020){
            e.addField(`After`, m.content.slice(0, 1020)).addField(`\u200b`, m.content.slice(1020, 2048))
        }else{
            e.addField(`After`, m.content || "None")
        }
        client.f.logging(client, "messages", m.guild, e, `🗒 Message Edited in ${m.channel} by \`@${m.author.tag}\` (${m.author.id})\n**Old:** ${o.cleanContent.slice(0, 1000)}\n**New: **${m.cleanContent.slice(0, 1000)}`)
        }catch(e){
            client.f.event(client, "Message Update", e.stack, m.guild)
        }
    }
}