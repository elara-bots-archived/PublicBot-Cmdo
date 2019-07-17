const {Command, Gar} = require('elaracmdo'),
Discord = require('discord.js');
const sa = require('superagent');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'garfield',
             memberName: 'garfield',
             aliases: [],
             examples: [`${client.commandPrefix}garfield`],
             description: 'Posts a random garfield comic',
             throttling: {
              usages: 1,
              duration: 5
          },
             group: 'image'
})
}
        async run(message) {
          if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
          
        let url = await Gar.random()
        if(!url) return message.channel.send(`ERROR Fetching a garfield comic, Try again.`);
        try{
        this.body = await sa.get(url)
        }catch(e){
          return message.channel.send(`ERROR Fetching a garfield comic, Try again.`)
        }
           let e = new Discord.MessageEmbed()
           .setColor(message.guild.color)
           .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
           .setTimestamp()
           .setDescription(`Here is you're Garfield Comic`)
           .setImage(this.body.request.url)
           message.channel.send(e)
}
}