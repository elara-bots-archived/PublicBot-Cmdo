const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rob',
            memberName: 'rob',
            aliases: [],
            examples: [`${client.commandPrefix}rob @user`],
            description: 'Robs the user you mention',
            group: 'coins',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 300
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to rob?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, {user}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(message.guild ? message.member.displayColor : message.guild.color)
        .setTimestamp()
        .setTitle(`ERROR`);
        if(message.author.id === user.id ){
            e.setDescription(`You can't rob yourself!`)
            return message.say(e)
        }
        if(user.bot){
            e.setDescription(`You can't rob a bot.`)
            return message.say(e)
        }
        this.client.dbcoins.findOne({guildID: message.guild.id, userID: message.author.id}, async (err, data) => {
        if(data){
            this.client.dbcoins.findOne({guildID: message.guild.id, userID: user.id}, async (err, db) => {
            if(db){
                if(db.bonus.immunity === true){
                    e.setDescription(`You can't rob ${user}, they have Immunity!`)
                    return message.say(e)
                }
            if(db.coins === 0){
                e.setDescription(`They don't have any ${message.guild.currency} for you to rob!`)
                return message.say(e)
            }
            let amt = await `${db.coins}`
            if(amt.startsWith('-')){
                e.setDescription(`${user} doesn't have any coins for you to rob!!`)
                return message.say(e)
            }
            let amount;
            if(data.bonus.robboost === true){
                amount = Math.floor(Math.random() * 10000)
            }else{
                amount = Math.floor(Math.random() * 5000)
            }
            if(db.coins < amount) amount = db.coins;
            if(amount === 0) {
                e.setDescription(`They don't have any ${message.guild.currency} to rob!`)
                return message.say(e)
            }
            data.coins = data.coins + amount;
            data.save().catch(err => {
                if(err){
                    e.setDescription(`There was an error while saving to the database.`) 
                    return message.say(e)
                }
            })
            db.coins = db.coins - amount;
            db.save().catch(err => {
                if(err){
                    e.setDescription(`There was an error while saving to the database.`) 
                    return message.say(e)
                }
            });
            e.setTitle(`Success`)
            .setDescription(`You have robbed ${user} for **${amount}** ${message.guild.currency}`)
            return message.say(e)
            }else{
                e.setDescription(`${user} doesn't have any ${message.guild.currency} for you to rob!`)
                return message.say(e)
            }
        });
    }else{
        e.setDescription(`You don't have a ${message.guild.currency} database, Please chat in the server to earn ${message.guild.currency}!`)
        return message.say(e)
    }
    });

        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
