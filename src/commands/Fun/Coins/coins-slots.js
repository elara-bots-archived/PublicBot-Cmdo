const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'slot',
             memberName: 'slot',
             aliases: [`slots`],
             examples: [`${client.commandPrefix}slot <amount>`],
             description: 'Play the slot machine.',
             group: 'coins',
             throttling: {
                 usages: 1,
                 duration: 10
             },
             args: [
                 {
                     key: "bet",
                     prompt: "How much do you want to bet?",
                     type: "integer",
                     min: 1,
                     max: 9999999999999
                 }
             ]

})
}
        async run(message, {bet}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);;
        
        try{
        this.client.dbcoins.findOne({guildID: message.guild.id, userID: message.author.id}, async (err, db) => {
            if(!db){
            return this.client.error(this.client, message, `${message.guild.currency} database for the server!`)
            }else{
            if(db.coins >= bet){
            let slots = [`<:Black:554409164911411250>`, `<:Green:554409003652874240>`, `<:Light_Blue:554409158896648204>`, `<:Dark_Blue:554409043272269844>`, `<:Grey:554409022552539161>`];
            let r1 = Math.floor(Math.random() * slots.length);
            let r2 = Math.floor(Math.random() * slots.length);
            let r3 = Math.floor(Math.random() * slots.length);
            let e = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color).setTimestamp();
            if(slots[r1] === slots[r2] && slots[r2] === slots[r3]){
                db.coins = db.coins + bet * 2
                db.save().catch(err => console.log(err));
                e.setTitle(`You Won! ${bet * 2} ${message.guild.currency}`)
                .setDescription(`:slot_machine: Slots :slot_machine:`)
                .addField(`Results`, slots[r1] + slots[r2] + slots[r3], true)
                return message.channel.send(e)
            }else{
                db.coins = db.coins - bet;
                db.save().catch(err => console.log(err))
                e.setTitle(`You Lost! ${bet} ${message.guild.currency}`)
                .setDescription(`:slot_machine: Slots :slot_machine:`)
                .addField(`Results`, slots[r1] + slots[r2] + slots[r3], true)
                return message.channel.send(e)
            }

            }else{
                return this.client.error(this.client, message, `You don't have enough to place this bet!\n\n**You only have ${db.coins} ${message.guild.currency} on you.**`)
            }
        }
        });
            } catch (e) {
                this.client.error(this.client, message, e)
                this.client.f.logger(this.client, message, e.stack)
            }
}
}
