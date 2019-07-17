const {Command} = require('elaracmdo');
const Discord = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'currency',
      memberName: 'currency',
      aliases: [],
      examples: [`${client.commandPrefix}currency <new currency>`],
      description: 'Sets the currency for the server.',
      group: 'admin', 
      userPermissions: ["MANAGE_GUILD"],
      throttling: {
        usages: 1,
        duration: 5
    },
      args: [
          {
              key: "currency",
              prompt: "What do you want to set the currency to?",
              type: "string",
              min: 1,
              max: 150
          }
      ]
})
}
        async run(message, {currency}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        let e = new Discord.MessageEmbed()
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
                db.misc.currency = currency;
                db.save().catch(err => console.log(err));
            e.setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle(`Success`)
            .setColor(message.guild.color)
            .setDescription(`Alright, I set the currency to **${currency}**`)
            return message.channel.send(e)
            }else{
                e.setTitle(`ERROR`).setDescription(`This server does't have a settings database!`).setColor(`#FF0000`)
                return message.channel.send(e)
            }
        })
};
}
