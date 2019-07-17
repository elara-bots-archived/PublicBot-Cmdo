const { Command } = require('elaracmdo'),
    re = require('discord.js').MessageEmbed
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'withdraw',
            memberName: 'withdraw',
            aliases: [`with`],
            examples: [`${client.commandPrefix}withdraw [amount]`],
            description: 'Withdraws the money from your bank account',
            group: 'coins',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "amount",
                    prompt: "How many coins do you want to withdraw?",
                    type: 'string'
                }
            ]
        })
    }
    async run(message, {amount}) {
        try{
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        


        if(amount.startsWith('-')) return this.client.error(this.client, message, `You can't withdraw a negative amount!`);
        let currency = message.guild.currency;
this.client.dbcoins.findOne({ userID: message.author.id, guildID: message.guild.id }, async (err, db) => {
    if(!db) return this.client.error(this.client, message, `There isn't a ${currency} database for you yet, Please chat in the server to gain ${currency}!`);
    if(amount === "all" || amount === "everything"){ 
        amount = db.bank;
    }else{
        if(isNaN(amount)) return this.client.error(this.client, message, `You didn't choose \`all\` or a number`)
    }
    if(db.bank === 0) return this.client.error(this.client, message, `You don't have any ${currency} in your bank account!`);
       if(db.bank >= amount){
        db.coins = db.coins + amount;
        db.bank = db.bank - amount;
        db.save().catch(err => console.log(err.stack));
        let e = new re()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(message.guild.color)
        .setTimestamp()
        .setTitle(`Success`)
        .setDescription(`You have withdrew **${amount}** from your bank account.\n\nNow you have **${db.bank}** ${currency} in your bank account.`)
        return message.channel.send(e)
       }else{
           return this.client.error(this.client, message, `You don't have that amount in your bank account.\n\nYou only have **${db.bank}** ${currency} in your bank account`); 
        }
})
}catch(e){
this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack);
}
}
}