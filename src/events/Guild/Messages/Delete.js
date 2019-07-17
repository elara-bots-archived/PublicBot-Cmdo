const {Event, util: {SystemJoinMessages}} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "messageDelete",
            enabled: true
        })
    }
    async run(client, m){
        if (m.channel.type === "dm" || m.author.bot) return;
        if(await client.m(client) === true) return;
        if(await client.f.ignore(client, m.guild, m.channel.id) === true) return;
        try{
            let attachments = [], text = [], i = 0;
            await m.attachments.forEach(c => {i++;text.push(`${i}. [Attachment](${c.proxyURL})`); attachments.push(c.proxyURL)});
            let emoji = `<:Boost:586883798550052864>`;
            let type = {
                "GUILD_MEMBER_JOIN": `${SystemJoinMessages[~~(m.createdAt % SystemJoinMessages.length)].replace(/%user%/g, m.author)}`,
                "PINS_ADD": `${m.author} pinned a message to this channel. **See all the pins.**`,
                "DEFAULT": `${m.content.replace("||", "\\|\\|").replace("||", "\\|\\|")}`,
                'USER_PREMIUM_GUILD_SUBSCRIPTION': `${emoji} ${m.author} just boosted the server!`,
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1': `${emoji} ${m.author} just boosted the server. **${m.guild.name}** has achieved Level 1!`,
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2': `${emoji} ${m.author} just boosted the server. **${m.guild.name}** has achieved Level 2!`,
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3': `${emoji} ${m.author} just boosted the server. **${m.guild.name}** has achieved Level 3!`,
                "undefined": "[None] - Content unknown??..."
            }
            let e = new MessageEmbed()
            .setAuthor(m.guild.name, m.guild.iconURL())
            .setColor(client.util.colors.red)
            .setTitle(`Message Deleted`)
            .setTimestamp()
            if(m.pinned === true) e.setFooter(`This message was pinned`)
            if(attachments.length !== 0){
            e.setDescription(text.join('\n'))
            try{e.setImage(attachments[0])}catch(e){}
            if(m.content.length !== 0) e.addField(`Content`, type[m.type])
            }else{
            e.setDescription(type[m.type])
            }
            e.addField(`\u200b`, `
            **Message ID: **${m.id}
            **Author: **${m.author} \`@${m.author.tag}\` (${m.author.id})
            **Channel: **${m.channel} \`#${m.channel.name}\` (${m.channel.id})
            `)
    
            
            client.f.logging(client, "messages", m.guild, e, `🗑 Message Deleted in ${m.channel} by \`@${m.author.tag}\` (${m.author.id})\nContent: ${m.type === "DEFAULT" ? m.cleanContent.replace("||", "\\|\\|").replace("||", "\\|\\|") : type[m.type]}`)
    
        }catch(e){ 
            client.f.event(client, "Message Delete", e.stack, m.guild)
        }
    }
}