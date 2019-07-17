const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'repleaderboard',
             memberName: 'repleaderboard',
             aliases: [`rlb`,'replb'],
             examples: [`${client.commandPrefix}repleaderboard`],
             description: 'Shows the Reputation leaderboard.',
             throttling: {
              usages: 1,
              duration: 5
          },
             group: 'fun'
})
}
        async run(message) {
          if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
          
try{
  //Grab all of the users in said server
  this.client.u.find().sort([['reps', 'descending']]).exec(async (err, res) => {
    if (err) console.log(err);
    let embed = new Discord.MessageEmbed()
    .setTitle("The Top 25 Reputation Leaderboard")
    .setColor(message.guild.color)
  // if there are no results
  let i;
  if(res.length > 25){
  for(i=0;i < 25;i++){
    if(res[i].reps !== 0){
    let user = await this.client.users.fetch(res[i].userID)
    embed.addField(`${i + 1}. ${user.username} (${user.id})`, `${res[i].reps ? `**Reputation Points: **${res[i].reps}`: "0"}`)
    }
  }
}else{
  for(i=0;i<res.length;i++){
    if(res[i].reps !== 0){
      let user = await this.client.users.fetch(res[i].userID)
    embed.addField(`${i + 1}. ${user.username} (${user.id})`, `${res[i].reps ? `**Reputation Points: **${res[i].reps}`: "0"}`)
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
