const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deposit',
            memberName: 'deposit',
            aliases: [`dep`],
            examples: [`${client.commandPrefix}deposit [amount]`],
            description: 'Deposits the money from your bank account',
            group: 'coins',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "amount",
                    prompt: "How many coins do you want to deposit?",
                    type: 'string'
                }
            ]
        })
    }
    async run(message, {amount }) {
        try{
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);        
        if(amount.startsWith('-')) return this.client.error(this.client, message, `You can't deposit a negative amount!`);
        let currency = message.guild.currency;
this.client.dbcoins.findOne({ userID: message.author.id, guildID: message.guild.id }, async (err, db) => {
    if (!db) return this.client.error(this.client, message, `You don't have a ${currency} database yet, please chat in the server to gain ${currency}!`)
    if(amount === "all"){
        amount = db.coins;
    }else{
    if(isNaN(amount)) return this.client.error(this.client, message, `You didn't choose \`all\` or a number`)
    }
    if(db.coins === 0) return this.client.error(this.client, message, `You don't have any ${currency} to deposit.\n\nYour currenct balance is **${db.coins ? db.coins : "0"}** ${currency}`)
    if(db.coins + 1 > amount){
        db.coins = db.coins - amount;
        db.bank = db.bank + amount;
        db.save().catch(err => console.log(err.stack));
        let e = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.guild.color)
        .setDescription(`You have deposited **${amount}** into your bank account.\n\nNow you have **${db.bank}** ${currency} in your bank account`).setTitle(`Success`)
        return message.channel.send(e)
    }else{
        return this.client.error(this.client, message, `You don't have that amount of ${currency}, you only have **${db.coins}** ${currency}`)
    }
})
}catch(e){
this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
}
}