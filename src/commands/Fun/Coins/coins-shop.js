const {Command, RichMenu} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'shop',
      memberName: 'shop',
      aliases: [],
      examples: [`${client.commandPrefix}shop`],
      description: 'Posts the menu to buy from the shop.',
      throttling: {
        usages: 1,
        duration: 5
      },
      group: 'coins'
})
}
        async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
            this.client.dbcoins.findOne({userID: message.author.id, guildID: message.guild.id}, async (err, db) => {
            if(db){
            message.delete(100).catch()
            const p = async function(e){
                e.fields = [];
            }
            let searchResult = ['Command', "Message", "Rob"]
            const e = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle('Bonus Shop')
            .setDescription(`Click on the reaction to buy the item.\nYour current balance: **${db.coins}** ${message.guild.currency}`)
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            const menu = new RichMenu(e);
            menu.addOption(`Command Boost`, `Cost: **100,000** ${message.guild.currency}`, true);
            menu.addOption(`Message Boost`, `Cost: **500,000** ${message.guild.currency}`, true)
            menu.addOption(`Rob Boost`, `Cost: **1,000,000** ${message.guild.currency}`, true);
            let msg = await message.channel.send(`Loading...`)
            const collector = await menu.run(msg, { filter: (reaction, user) => user.id === message.author.id });
            const choice = await collector.selection;
            if (choice === null) return collector.message.delete();
            if(searchResult[choice] === "Message"){
            if(db.bonus.msgboost === true){
                e.setDescription(`You have already bought the \`message\` boost`).setColor(`#FF0000`).setTitle(`ERROR`)
                p(e)
                return msg.edit(e)
            }
            if(db.coins >= 500000){
                db.coins = db.coins - 500000;
                db.bonus.msgboost = true;
                db.save().catch()
                e.setDescription(`You have bought the \`message\` boost bonus!`).setTitle(`Success`)
                p(e)
                return msg.edit(e)
            }else{
                e.setDescription(`You don't have enough for the \`message\` boost`).setTitle(`ERROR`)
                p(e)
                return msg.edit(e)
            }
            }else
            if(searchResult[choice] === "Rob"){
                if(db.bonus.robboost === true){
                    e.setDescription(`You have already bought the \`rob\` boost`).setColor(`#FF0000`).setTitle(`ERROR`)
                    p(e)
                    return msg.edit(e)
                }
                if(db.coins >= 1000000){
                    db.coins = db.coins - 1000000;
                    db.bonus.robboost = true;
                    db.save().catch()
                    e.setDescription(`You have bought the \`rob\` boost bonus!`).setTitle(`Success`)
                    p(e)
                    return msg.edit(e)
                }else{
                    e.setDescription(`You don't have enough for the \`rob\` boost`).setTitle(`ERROR`)
                    p(e)
                    return msg.edit(e)
                }
            }else
            if(searchResult[choice] === "Command"){
                if(db.bonus.cmdboost === true){
                    e.setDescription(`You have already bought the \`command\` boost`).setColor(`#FF0000`).setTitle(`ERROR`)
                    p(e)
                    return msg.edit(e)
                }
                if(db.coins >= 100000){
                    db.coins = db.coins - 100000;
                    db.bonus.cmdboost = true;
                    db.save().catch()
                    e.setDescription(`You have bought the \`command\` boost bonus!`).setTitle(`Success`)
                    p(e)
                    return msg.edit(e)
                }else{
                    e.setDescription(`You don't have enough for the \`command\` boost`).setTitle(`ERROR`)
                    p(e)
                    return msg.edit(e)
                }
            }
        }else{
            message.delete(100).catch()
            return message.channel.send(`You don't have a ${message.guild.currency} database yet!`);
        }
        })
};
}
