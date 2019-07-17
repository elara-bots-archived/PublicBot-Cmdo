const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "messageDeleteBulk",
            enabled: true
        })
    }
    async run(client, msgs){
        if(await client.m(client) === true) return;
        const c = msgs.first().channel, g = c.guild;
        if(await client.f.ignore(client, g, c.id) === true) return;
        try{
      const link = await client.f.bin(`Messages from ${c.name}`, await msgs.map(m => m.author ? `
      Author: @${m.author.tag} (${m.author.id})
      Content: ${m.content ? m.content : "None"}
      Attachments: ${m.attachments.map(c => c).length !== 0 ? m.attachments.map(c => c.proxyURL).join('\n') : `None`}
    
      Misc
      - ID: ${m.id}
      - Created At: ${moment(m.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
      - Embed: ${m.embeds.map(c => c).length !== 0  ? "Yes": "No"}
      - Channel: #${c.name} (${c.id})
      ------------------------------------------------------------------------------------------------------------------------------------
      ` : "-- Not Cached Message --").join('\n\n'));
      let e = new MessageEmbed()
      .setAuthor(g.name, g.iconURL())
      .setColor(client.util.colors.orange)
      .setDescription(`
      **Messages Deleted: **${link}
      **Channel: **${c} \`#${c.name}\` (${c.id})
      `)
      .setFooter(`${msgs.map(c=>c).length} Message${msgs.map(c => c).length === 1 ? "" : "s"} Deleted.`)
      .setTitle(`Message Bulk Delete`)
      .setTimestamp()
        client.f.logging(client, "messages", g, e, `🗑 Message Bulk Delete: <${link}> | Channel: ${c} \`#${c.name}\``)
    }catch(e){
        client.f.event(client, "Message Delete Bulk", e.stack, g)
    }
    }
}