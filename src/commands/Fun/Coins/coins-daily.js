const {Command} = require('elaracmdo'),
      Discord = require('discord.js'),
      {get} = require('superagent'),
      {apis: {dbl}} = require('../../../util/config');
const moment = require('moment');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'daily',
             memberName: 'daily',
             aliases: [],
             examples: [`${client.commandPrefix}daily`],
             description: 'Collect your daily reward',
             group: 'coins',
             guildOnly: true

})
}
        async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let c = message.guild.currency;
        let e = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
        this.client.dbcoins.findOne({guildID: message.guild.id, userID: message.author.id}, async (err, db) => {
        if(!db){
            return this.client.error(this.client, message, `You need to chat in the server before you can claim your daily reward!`)
        }else{
                if(db.daily.date != moment().format('L')){
                    db.daily.date = moment().format("L")
                    let coins;
                    if(db.bonus.cmdboost === true){
                        db.daily.bonus = db.daily.bonus + 1
                        if(db.daily.bonus >= 5) { db.daily.bonus = 0; coins = 3000 * 2}else{coins = 3000}
                        if(moment(new Date()).format('dddd') === "Friday" || moment(new Date()).format('dddd') === "Saturday" || moment(new Date()).format('dddd') === "Sunday"){
                            coins = coins * 2;e.setTitle(`Daily Reward Claimed - Weekend Bonus x2`)
                        }else{e.setTitle(`Daily Reward Claimed`)}
                    }else{
                        db.daily.bonus = db.daily.bonus + 1
                        if(db.daily.bonus >= 5){db.daily.bonus = 0; coins = 1500 * 2 }else{coins = 1500}
                        if(moment(new Date()).format('dddd') === "Friday" || moment(new Date()).format('dddd') === "Saturday" || moment(new Date()).format('dddd') === "Sunday" ){
                        coins = coins * 2; e.setTitle(`Daily Reward Claimed - Weekend Bonus x2`)
                        }else{e.setTitle(`Daily Reward Claimed`)}
                    }
                    let {body} = await get(`https://discordbots.org/api/bots/455166272339181589/check?userId=${message.author.id}`).set("Authorization", dbl);
                    if(body.voted === 2){coins = coins * 3}else if(body.voted === 1){oins = coins * 2}
                    db.coins = db.coins + coins
                    db.save().catch(err => console.log(err));
                    e.setDescription(` You have claimed your daily reward of **${coins}** ${c}!`)
                    .setFooter(`Next Reward in: ${moment().endOf('day').fromNow().replace('in', '')}`)
                    return message.say(e)
                }else{
                    e.setTitle(`Daily Reward Already Claimed!`)
                    .setColor(`#FF0000`)
                    .setFooter(`Next Reward in: ${moment().endOf('day').fromNow().replace('in', '')}`)
                    return message.channel.send(e)
                }
}
        });
            } catch (e) {
                this.client.error(this.client, message, e)
                this.client.f.logger(this.client, message, e.stack)
            }
}
}