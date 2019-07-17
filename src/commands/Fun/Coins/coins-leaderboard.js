const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'leaderboard',
             memberName: 'leaderboard',
             aliases: [`lb`],
             examples: [`${client.commandPrefix}leaderboard`],
             description: 'Shows the coins leaderboard for the server.',
             group: 'coins',
             throttling: {
              usages: 1,
              duration: 5
             },
             guildOnly: true
})
}
        async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);;
        
try{
    let c = message.guild.currency
    this.client.dbcoins.find({guildID: message.guild.id}).sort([['coins', 'descending']]).exec(async (err, res) => {
    if (err) console.log(err);

    let embed = new Discord.MessageEmbed().setTitle(`${c} Leaderboard`).setAuthor(message.guild.name, message.guild.iconURL())
    //if there are no results
    let i = 0;
    if (res.length === 0) {
      embed.setColor("#FF0000");
      embed.addField("No data found", `Please type in chat to gain ${c}!`)
    } else if (res.length < 10) {
      //less than 10 results
      embed.setColor(message.guild.color);
      for (i = 0; i < res.length; i++) {
        let member = message.guild.members.get(res[i].userID) || "User Left"
        if (member === "User Left") {
          embed.addField(`${i + 1}. ${member}`, `${c}: ${res[i].coins}`);
        } else {
          embed.addField(`${i + 1}. ${member.user.username}`, `${c}: ${res[i].coins }`);
        }
      }
    } else {
      //more than 10 results
      embed.setColor(message.guild.color);
      for (i = 0; i < 10; i++) {
        let member = message.guild.members.get(res[i].userID) || "User Left"
        if (member === "User Left") {
          embed.addField(`${i + 1}. ${member}`, `${c}: ${res[i].coins }`);
        } else {
          embed.addField(`${i + 1}. ${member.user.username}`, `${c}: ${res[i].coins}`);
        }
      }
    }
    message.channel.send(embed);
  })
} catch (e) {
  this.client.error(this.client, message, e)
  this.client.f.logger(this.client, message, e.stack)
}
}
}