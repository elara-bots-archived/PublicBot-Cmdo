const {Command} = require('elaracmdo'),
Discord = require('discord.js');
const superagent = require('superagent');
const moment = require('moment');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'status',
             memberName: 'status',
             aliases: [],
             examples: [`${client.commandPrefix}status`],
             description: `Checks discord's status`,
             group: 'info',
             throttling: {
              usages: 1,
              duration: 5
          },
             args: [
               {
                 key: "site",
                 prompt: "What site do you want to check the status of? `paladins`, `discord`",
                 type: "string",
                 default: "discord"
               }
             ]
})
}
        async run(message, {site}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
        .setTimestamp()
        if(site.toLowerCase() === "discord" || site.toLowerCase() === "d"){  
        let {body} = await superagent.get("https://srhpyqt94yxb.statuspage.io/api/v2/status.json");
        let un = await  superagent.get("https://srhpyqt94yxb.statuspage.io/api/v2/incidents/unresolved.json");
           e.setAuthor(body.page.name, "https://cdn.discordapp.com/emojis/483118381650804747.gif?v=1")
           .addField(`Status Page`, body.page.url)
           .addField(`Last Updated`, moment(body.page.updated_at).format("dddd, MMMM Do YYYY, h:mm:ssa"), true)
           if(un.body.incidents.length !== 0){
          let i = un.body.incidents[0];
          e.setDescription(`${i.name ? `**Issue: **${i.name}`: ``}${i.status ? `\n**Status: **${i.status}`: ""}${i.created_at ? `\n**Started At: **${moment(i.created_at).format('dddd, MMMM Do YYYY, h:mm:ssa')}` : ""}${i.impact ? `\n**Impact: **${i.impact}` : ""}${i.shortlink ? `[Click Here](${i.shortlink})` : ""}`)
          let res = await i.incident_updates;
          let n = 0;
          res.forEach(c => {
            n++
            e.addField(`${n}. Update`, `**Status: **${c.status}\n${c.body}`)
          })
           }else{
          e.fields.pop()
           e.addField(`Status [${body.status.indicator}]`, `${body.status.description}`, true).addField(`Last Updated`, moment(body.page.updated_at).format("dddd, MMMM Do YYYY, h:mm:ssa"), true)
           }
          return message.channel.send(e)
          }else
          if(site.toLowerCase() === "paladins" || site.toLowerCase() === "p"){
          let {body} = await superagent.get(`https://stk4xr7r1y0r.statuspage.io/api/v2/status.json`);
          e.setAuthor("Paladins", "https://vignette.wikia.nocookie.net/logopedia/images/5/53/Paladins_Icon.png/revision/latest?cb=20180325064228", "https://www.paladins.com/")
          .addField(`Status Page`, body.page.url, false)
          .addField(`Status [${body.status.indicator}]`, body.status.description, true)
          .addField(`Last Updated`, moment(body.page.updated_at).format("dddd, MMMM Do YYYY h:mm:ssa"), true)
          return message.channel.send(e)
          }
          } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
          }
}
}