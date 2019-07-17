const {Command} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: "s",
      memberName: 's',
      aliases: [],
      examples: [`${client.commandPrefix}s [id]`],
      description: 'Views the list of servers, or adds/removes them from the list.',
      group: 'owner',
      ownerOnly: true,
      hidden: true,
      args: [
            {
                  key: "server",
                  prompt: 'What server do you want to blacklist/unblacklist?',
                  type: "string",
                  default: ''
            }
      ]
})
}
        async run(message, {server}) {
        message.delete()
        this.client.dev.findOne({clientID: this.client.user.id}, async (err, db) => {
            if(!db) return message.channel.send(`There is no Developer database! o_o`);
            if(db){
                let e = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.guild.color);
                if(server === ""){
                if(db.misc.servers.length === 0) return message.channel.send(`There is no servers blacklisted`);
                let data = [];
                await db.misc.servers.forEach(c => {
                    data.push(c)
                })
                e.setDescription(data.join('\n'))
                .setTitle(`Blacklisted Servers`)
                return message.channel.send(e)
                }else{
                if(db.misc.servers.includes(server)){
                db.misc.servers = db.misc.servers.filter(c => c !== server);
                db.save().catch(err => console.log(err));
                e.setDescription(server)
                .setTitle(`[Blacklist] - Server Remove`)
                let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
                .setTitle(`[Action] - Unblacklist Server`)
                .setDescription(server)
                .setThumbnail('https://cdn.discordapp.com/emojis/551617528632180746.gif?v=1')
                .setFooter(`By: @${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                this.client.f.hooks('action', ae)
                return message.channel.send(e)
                }else{
                db.misc.servers.push(server)
                db.save().catch(err => console.log(err));
                e.setDescription(server)
                .setTitle(`[Blacklist] - Server Add`)
                let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
                .setTitle(`[Action] - Blacklisted Server`)
                .setDescription(server)
                .setThumbnail('https://i.imgur.com/Mmnp11o.gif')
                .setFooter(`By: @${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                this.client.f.hooks('action', ae)
                return message.channel.send(e)
                }
            }
        }
        })
};
}
