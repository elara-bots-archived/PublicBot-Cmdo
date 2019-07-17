const {Command} = require('elaracmdo');
const Discord = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'custom',
      memberName: 'custom',
      aliases: [],
      examples: [`${client.commandPrefix}custom banner/description <new thing>`],
      description: 'Sets your custom banner or description.',
      group: 'user',
      args: [
          {
            key: "type",
            prompt: "What do you want to change? [banner, description]",
            type: "string"
          },
          {
              key: "content",
              prompt: "What do you want it to change it to?",
              type: "string"
          }
      ]
})
}
        async run(message, {type, content}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setTitle(`Loading...`)
        let m = await message.channel.send(e);
        this.client.u.findOne({userID: message.author.id}, async (err, db) => {
            if(db){
            switch(type){
                case "banner":
                if(!content.startsWith('https://') && !content.startsWith("http://")){
                    e.setTitle(`ERROR`)
                    .setDescription(`You didn't start the banner link with \`https:// \` or \`http://\``)
                    m.edit(e)
                }else{
                    db.custom.image = content
                    db.save().catch();
                    e.setTitle(`Success`)
                    .setDescription(`Alright, I set your custom banner to ${content}`)
                    m.edit(e)
                }
                break;
                case "description":
                    db.custom.desc = content
                    db.save().catch();
                    e.setTitle(`Success`)
                    .setDescription(`Alright, I set your custom description to ${content}`)
                    m.edit(e)
                break;
                default:
                e.setTitle(`ERROR`)
                .setDescription(`You didn't choose \`color, description, banner\``)
                m.edit(e) 
                break;
            }
            return m.edit(e)
            }else{
                await this.client.f.userdb(this.client, message.author)
                e.setTitle(`INFO`).setDescription(`Please try again... Your database has just been created.`)
                return m.edit(e)
            }
        })
};
}
