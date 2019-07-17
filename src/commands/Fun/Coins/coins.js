const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coins',
            memberName: 'coins',
            aliases: [`money`],
            examples: [`${client.commandPrefix}coins [add/remove] <@user/id> (amount)`],
            description: 'Gives or removes the coins from the user you mention',
            group: 'admin',
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "type",
                    prompt: "Do you want to add or remove their coins?",
                    type: "string"
                },
                {
                    key: "user",
                    prompt: "What user?",
                    type: "user"
                },
                {
                    key: "amount",
                    prompt: `How many coins?`,
                    type: 'integer',
                    min: 1,
                    max: 10000000000000000
                }
            ]
        })
    }
    async run(message, {type, user, amount }) {
        try{
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        if (user.bot) return message.channel.send(`You can't give or remove coins from a bot.`);
        if (!this.client.isOwner(message.author.id)){
        if (message.author.id === user.id) return message.channel.send(`You can't add or remove ${message.guild.currency} from yourself.`);
        }
        
        const e = new Discord.MessageEmbed().setAuthor(user.tag, user.displayAvatarURL()).setColor(message.guild.color).setTimestamp()
        this.client.dbcoins.findOne({ userID: user.id, guildID: message.guild.id }, async  (err, db) => {
        if(db){
        let t = type.toLowerCase();
        if(t === "add" || t === "give"){
                db.coins = db.coins + amount;
                db.save().catch(err => console.log(err));
                e.setTitle(`Success`)
                .setDescription(`Alright, I added ${amount} amount of ${message.guild.currency} to ${user}!`)
                return message.channel.send(e)
        }else
        if(t === "remove" || t === "take"){
            if(db.coins >= amount){
                db.coins = db.coins - amount
                db.save().catch(err => console.log(err));
                e.setTitle(`Success`)
                .setDescription(`Alright, I removed ${amount} amount of ${message.guild.currency} from ${user}!`)
                return message.channel.send(e)
            }else{
                e.setTitle(`ERROR`)
                .setDescription(`${user} doesn't have that amount of ${message.guild.currency}!`)
                .setColor(`#FF0000`)
                return message.channel.send(e)
            }
        }else{
            e.setTitle(`ERROR`)
            .setColor(`#FF0000`)
            .setDescription(`You didn't select \`add\` or \`remove\``)
            return message.channel.send(e)
        }
        }else{
            e.setTitle(`ERROR`)
            .setDescription(`${user} doesn't have a ${message.guild.currency} database!`);
            return message.channel.send(e)
        }
        })



}catch(e){
this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
    }
}