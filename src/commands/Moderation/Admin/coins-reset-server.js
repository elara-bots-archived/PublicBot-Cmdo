const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'reset-server',
             memberName: 'reset-server',
             aliases: [],
             examples: [`${client.commandPrefix}reset-server`],
             description: 'Resets the coins databases for the whole server. [Be warned: **This action is not reversible**]',
             group: 'admin',
             guildOnly: true,
             userPermissions: ["ADMINISTRATOR"],
             throttling: {
                usages: 1,
                duration: 50
            },
             args: [
                 {
                     key: "areyousure",
                     prompt: "Are you sure you want to reset the server's coins database? [y/n] [REMEMBER THIS ACTION IS NOT REVERSIBLE]",
                     type: "string"
                 }
             ]
})
}
        async run(message, {areyousure}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
try{
    if(areyousure.toLowerCase() === "y" || areyousure.toLowerCase() === "yes"){
    this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
    message.guild.members.forEach(m => {this.client.dbcoins.findOneAndDelete({ guildID: message.guild.id, userID: m.user.id }).catch((err) => console.log(err));});
    if(db) return message.channel.send(`Alright, I cleared the servers ${db.misc.currency} database....`)
    });
}else{return message.channel.send(`Canceled`)}
} catch (e) {
  this.client.error(this.client, message, e)
  this.client.f.logger(this.client, message, e.stack)
}
}
}