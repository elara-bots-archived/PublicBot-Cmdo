const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'flipcoin',
             memberName: 'flipcoin',
             aliases: [`flip`, `fc`],
             examples: [`${client.commandPrefix}flipcoin amount`],
             description: 'Flips the amount of coins you provide',
             group: 'coins',
             guildOnly: true,
             throttling: {
                usages: 1,
                duration: 10
            },
             args: [
                 {
                     key: "amount",
                     prompt: "How many coins do you want to flip?",
                     type: 'string'
                 }
             ]
})
}
        async run(message, {amount}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            if(amount.startsWith('-')) return this.client.error(this.client, message, `You can't flip a negative amount!`);
        let c = message.guild.currency;
        this.client.dbcoins.findOne({userID: message.author.id, guildID: message.guild.id},async (err, db) => {
            if(!db){
                return this.client.error(this.client, message, `You don't have a ${c} database yet, type in the server.`);
            }else{
                if(amount === "all"){
                    amount = db.coins;
                }else{
                    if(isNaN(amount))return this.client.error(this.client, message, `Please choose an amount to flip!`)
                }
                if(db.coins === 0) return this.client.error(this.client, message, `You don't have any ${c} to flip!`)
                if(db.coins >= amount){
                    let e = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color).setTimestamp()
                    let result = Math.floor(Math.random() * 10);
                    if(result === 5){
                        db.coins = db.coins + amount;
                        db.save().catch(err => console.log(err))
                        e.setDescription(`You won ${amount} ${c}!`)
                        return message.say(e);
                    }else{
                        db.coins = db.coins - amount;
                        db.save().catch(err => console.log(err))
                        e.setDescription(`You lost ${amount} ${c}!`)
                        return message.say(e)
                    }
                }else{
                    return this.client.error(this.client, message, `You don't have enough ${c}!`)
                }
            }
        })
            } catch (e) {
                this.client.error(this.client, message, e)
                this.client.f.logger(this.client, message, e.stack)
            }
}
}