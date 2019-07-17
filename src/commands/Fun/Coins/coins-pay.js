const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pay',
            memberName: 'pay',
            aliases: [`give`],
            examples: [`${client.commandPrefix}pay @user amount`],
            description: 'Pays the user you mention.',
            group: 'coins',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to pay?",
                    type: "user"
                },
                {
                    key: "amount",
                    prompt: "How many coins do you want to pay that user?",
                    type: 'integer',
                    min: 1,
                    max: 100000000
                }
            ]
        })
    }
    async run(message, {user, amount }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(message.author.id === user.id ) return message.channel.send(`You can't pay yourself! :face_palm:`)
        if(user.bot) return this.client.error(this.client, message, `Bot users don't have a database.`);
        let c = message.guild.currency;
        this.client.dbcoins.findOne({guildID: message.guild.id, userID: message.author.id}, async (err, db) => {

            if(db){
               if(db.coins <= amount){
                   return message.channel.send(`You don't have enough ${c}!`)
               }else{
                   db.coins = db.coins - amount
                   db.save().catch(err => console.log(err.stack))
               }
            }
            this.client.dbcoins.findOne({guildID: message.guild.id, userID: user.id}, async (err,data) => {
             if(!data){
                    let newdb = new this.client.dbcoins({
                        userTag: user.tag,
                        userID: user.id,
                        guildID: message.guild.id,
                        coins: amount,
                        bank: 0,
                        daily: "",
                        bonus: {
                            cmdboost: false,
                            msgboost: false,
                            robboost: false,
                            immunity: false
                        }
                    });
                    newdb.save().catch(err => console.log(err.stack));
                    let embed = new Discord.MessageEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL())
                    .setColor(message.guild.color)
                    .setTitle(`Success`)
                    .setDescription(`Amount given to ${user} **${amount}** ${c}`)
                    .setTimestamp()
                    return message.channel.send(embed)
                }else{
                    data.coins = data.coins + amount
                    data.save().catch(err => console.log(err.stack));
                    let embed = new Discord.MessageEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL())
                    .setColor(message.guild.color)
                    .setTitle(`Success`)
                    .setDescription(`Amount given to ${user} **${amount}** ${c}`)
                    .setTimestamp()
                    return message.channel.send(embed)
                }
            })
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}