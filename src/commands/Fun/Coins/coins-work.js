const {Command, eutil: {jobs}} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'work',
             memberName: 'work',
             aliases: [],
             examples: [`${client.commandPrefix}work`],
             description: 'Work and get coins.',
             group: 'coins',
             throttling: {
                 usages: 1,
                 duration: 10
             }

})
}
        async run(message) {
            if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
            try{
        this.client.dbcoins.findOne({guildID: message.guild.id, userID: message.author.id}, async (err, db) => {
            if(!db){return this.client.error(this.client, message, `${message.guild.currency} database for the server!`)}else{
        this.client.db.findOne({guildID: message.guild.id}, async (err, data) => {
            if(data){
            if(data.misc.jobs.length !== 0){
                let random = Math.floor(Math.random() * data.misc.jobs.length);
                let mo;
                if(db.bonus.cmdboost === true){
                    mo = Math.ceil(Math.random() * 3000);
                }else{
                    mo = Math.ceil(Math.random() * 1000);
                }
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setTitle(`Fetching Work..`)
                .setColor(message.guild.color)
                let m = await message.channel.send(e)
                let eb = new Discord.MessageEmbed()
                .setColor(message.guild.color)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${data.misc.jobs[random]} and got ${mo} ${message.guild.currency}`)
                setTimeout(async () => {
                await m.edit(eb)
                }, 100)
                db.coins = db.coins + mo
                db.save().catch(err => console.log(err))
            }else{
                let random = Math.floor(Math.random() * jobs.length);
                let mo;
                if(db.bonus.cmdboost === true){
                    mo = Math.ceil(Math.random() * 3000);
                }else{
                    mo = Math.ceil(Math.random() * 1000);
                }
                let e = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setTitle(`Fetching Work..`)
                .setColor(message.guild.color)
                let m = await message.channel.send(e)
                let eb = new Discord.MessageEmbed()
                .setColor(message.guild.color)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${jobs[random]} and got ${mo} ${message.guild.currency}`)
                setTimeout(async () => {
                await m.edit(eb)
                }, 100)
                db.coins = db.coins + mo
                db.save().catch(err => console.log(err))
            }
            }
})
}
        });
            } catch (e) {
                this.client.error(this.client, message, e)
                this.client.f.logger(this.client, message, e.stack)
            }
}
}
