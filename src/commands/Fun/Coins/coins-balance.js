const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'balance',
             memberName: 'balance',
             aliases: [`bal`],
             examples: [`${client.commandPrefix}balance @user/id/name`],
             description: 'Checks the balance of you or another user.',
             group: 'coins',
             guildOnly: true,
             throttling: {
                usages: 1,
                duration: 2
            },
             args: [
                {
                    key: 'user',
                    prompt: "What user do you want to check the balance for?",
                    type: 'user',
                    default: message => message.author
                }
              ]
})
}
        async run(message, {user}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let c = message.guild.currency;
        if(user.bot) return this.client.error(this.client, message, `Bots don't get a ${c} database!`);
        this.client.dbcoins.findOne({userID: user.id, guildID: message.guild.id}, async (err, db) => {
            if(!db){
                return this.client.error(this.client, message, `${user.tag} doesn't have any ${c}!`);
            }else{
                let total = db.bank + db.coins;
                let e = new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL())
                .setColor(message.guild.color)
                .addField(c, db.coins ? db.coins : "0", true)
                .addField(`Bank`, db.bank ? db.bank : `0`, true)
                .addField(`Total ${c}`, total ? total : "0", true)
                .addField(`Bonus`, `
                **Command: **${db.bonus.cmdboost ? "Yes": "No"}
                **Message: **${db.bonus.msgboost ? "Yes": "No"}
                **Rob: **${db.bonus.robboost ? "Yes" :"No"}
                ${db.bonus.immunity ? "**Immunity: ** Yes": ""} 
                `)
            return message.channel.send(e)
        }})
    } catch(e) {
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
    }
}
}