const {Command, RichDisplay} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'serverlist',
             memberName: 'serverlist',
             aliases: [],
             examples: [`${client.commandPrefix}serverlist`],
             description: 'Bot Owner Command',
             group: 'owner',
             ownerOnly: true,
             hidden: true,
})
}
        async run(message) {
          
        try{
        message.delete(100).catch()
        let data = [];
        let icons = [];
        let server = [];
        let color = [];
        this.client.guilds.forEach(g =>{ 
          color.push(g.members.get(this.client.user.id).displayColor)
          server.push(`${g.name}`)
          icons.push(g.iconURL() || null)
        data.push(`
        **Name: **${g.name}
        **ID: **${g.id}
        **Icon: **[Link](${g.iconURL() ? g.iconURL() : "None"})
        **Region: **${this.client.util.region[g.region]}
        ${this.client.util.verifLevels[g.verificationLevel] === "None" ? "" : `**Verification Level: **${this.client.util.verifLevels[g.verificationLevel].replace('\n', ' ').replace('\n', ' ')}`}${g.features.length === 0 ? '' : `\n**Features: ** ${g.features.map(feature => `\`${feature}\``).join(', ')}`}

        **Count Stats**
        - Roles: ${g.roles.size}
        - Channels: ${g.channels.size}
        - Emojis: ${g.emojis.size}
        - Total: ${g.memberCount}
        - Bots: ${g.members.filter(c => c.user.bot).size}
        - Humans: ${g.members.filter(c => !c.user.bot).size}


        **Member Statues**
        - ${g.members.filter(o => o.presence.status === 'online').size} Online
        - ${g.members.filter(i => i.presence.status === 'idle').size} Idle
        - ${g.members.filter(dnd => dnd.presence.status === 'dnd').size} DND
        - ${g.members.filter(off => off.presence.status === 'offline').size} Offline
        

        **Owner**
        - Mention: ${g.owner.user}
        - Tag: ${g.owner.user.username}#${g.owner.user.discriminator}
        - ID: ${g.ownerID}
        `) 
      })

        let e = new Discord.MessageEmbed()
        let display = new RichDisplay(e)
        
        for (let i = 0; i < data.length; i++) {
          display.addPage(db => db.setThumbnail(icons[i]).setDescription(data[i]).setAuthor(server[i], icons[i]).setColor(color[i]));
      }
    display.run(await message.channel.send(`Loading....`))
        } catch (e) {
        this.client.f.logger(this.client, message, e.stack)
        }
}
}