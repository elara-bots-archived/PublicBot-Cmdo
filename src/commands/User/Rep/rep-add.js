const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'rep+',
             memberName: 'rep+',
             aliases: [`rep`],
             examples: [`${client.commandPrefix}rep @user`],
             description: 'Gives a Reputation Point to the user you mention',
             group: 'fun',
             throttling: {
                usages: 1,
                duration: 1000
             },
             args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to give reputation point to?',
                    type: 'user'
                }
              ]
})
}
        async run(message, {user}) {
            if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
            
            try{
        if(!this.client.isOwner(message.author.id) && message.author.id === user.id) return message.channel.send(`You can't give reputation points yourself...`);
        if(user.bot) return message.channel.send(`You can't give a reputation point to a bot!.`)
        await this.client.u.findOne({userID: user.id}, async (err, db) => {
            if(db){
                db.reps = db.reps + 1;
                db.save().catch(err => console.log(err));
                let embed = new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL())
                .setColor(message.guild.color)
                .setTimestamp()
                .setTitle(`Success`)
                .setDescription(`You have given ${user} a reputation point!`).setFooter(`Now they have ${db.reps} reputation points.`)
                return message.channel.send(embed)
            }else{
                await this.client.f.userdb(this.client, user)
                message.channel.send(`Please try again... ${user.tag}'s database has just been created.`)
            }
        })
    } catch(e) {
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
    }
}
}
