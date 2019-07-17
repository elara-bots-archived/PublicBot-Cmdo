const {Command} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: "u",
      memberName: 'u',
      aliases: [],
      examples: [`${client.commandPrefix}u [user]`],
      description: 'Views the list of users, or adds/removes them from the list.',
      group: 'owner',
      ownerOnly: true,
      hidden: true,
      args: [
            {
                  key: "type",
                  prompt: 'What user do you want to blacklist/unblacklist?',
                  type: "string",
                  default: ''
            }
      ]
})
}
        async run(message, {type}) {
            
        this.client.dev.findOne({clientID: this.client.user.id}, async (err, db) => {
            if(!db) return message.channel.send(`There is no Developer database! o_o`);
            if(db){
                let e = new MessageEmbed()
                .setColor(message.guild.color);
                if(type === ""){
                if(db.misc.users.length === 0) return message.channel.send(`There is no users blacklisted`);
                let data = [];
                await db.misc.users.forEach(c => {
                    data.push(`<@${c}> - ${c}`)
                })
                e.setDescription(data.join('\n'))
                .setTitle(`Blacklisted Users`)
                return message.channel.send(e)
                }else{
                let user = await this.client.f.mention(this.client, type);
                if(user.bot) return message.channel.send(`${user.tag} is a bot. smh`);
                if(db.misc.users.includes(user.id)){
                db.misc.users = db.misc.users.filter(c => c !== user.id);;
                db.save().catch(err => console.log(err));
                e.setDescription(`${user} \`@${user.tag}\` (${user.id})`)
                .setTitle(`[Blacklist] - User Remove`)
                let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
                .setTitle(`[Action] - Unblacklist User`)
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(`${user} \`@${user.tag}\` (${user.id})`)
                .setThumbnail('https://cdn.discordapp.com/emojis/551617528632180746.gif?v=1')
                .setFooter(`By: @${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                this.client.f.hooks('action', ae)
                return message.channel.send(e)
                }else{
                if(this.client.isOwner(user.id)) return message.channel.send(`You can't blacklist a bot owner.`)
                db.misc.users.push(user.id)
                db.save().catch(err => console.log(err));
                e.setDescription(`${user} \`@${user.tag}\` (${user.id})`)
                .setTitle(`[Blacklist] - User Add`)
                let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
                .setTitle(`[Action] - Blacklisted User`)
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setDescription(`${user} \`@${user.tag}\` (${user.id})`)
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
