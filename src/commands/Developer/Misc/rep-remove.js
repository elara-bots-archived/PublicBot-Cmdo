const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'repremove',
             memberName: 'repremove',
             aliases: [],
             examples: [`${client.commandPrefix}rep- @user`],
             description: 'Removes the rep from a user.',
             group: 'owner',
             ownerOnly: true,
             hidden: true,
             args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to give reputation point to?',
                    type: 'user'
                },
                {
                    key: "amount",
                    prompt: "How much rep do you want to remove?",
                    type: "integer",
                    min: 1,
                    max: 100000000
                }
              ]
})
}
        async run(message, {user, amount}) {
        
        if(user.bot) return message.channel.send(`That is a bot not a user....`)
        this.client.u.findOne({userID: user.id}, async (err, db) => {
            if(!db){
                return message.channel.send(`That user doesn't have any rep points.`)
            }else{
                if(amount + 1 > db.reps) {
                    let e = new Discord.MessageEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL())
                    .setColor(message.guild.color)
                    .setTitle(`ERROR`)
                    .setDescription(`${user} only has ${db.reps} Rep Points`)
                    return message.channel.send(e)
                }
                db.reps = db.reps - amount;
                db.save().catch(err => console.log(err));
                let embed = new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL())
                .setColor(message.guild.color)
                .setTimestamp()
                .setDescription(`${this.client.util.emojis.semoji} Removed ${amount} from ${user}\nNow ${user} has ${db.reps} Reputation Points`)
                return message.channel.send(embed)
            }
        })
}
}