const { Command } = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "set-role",
            memberName: "set-role",
            aliases: [],
            examples: [`${client.commandPrefix}set-role @role/name/id`],
            description: "Sets the welcome role for the server..",
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "role",
                    prompt: "What role do you want me to set the join role to?",
                    type: "role"
                }
            ]
        })
    }
    async run(message, {role}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        
        try{
        let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
        this.client.db.findOne({ guildID: message.guild.id }, async (err, db) => {
    if(db){
    if(db.welcome.role === role.id){
        e.setTitle(`ERROR`)
        .setDescription(`That role is already set as the autorole.`)
        .setColor(`#FF0000`)
        return message.channel.send(e)
    }else{
    db.welcome.role = role.id;
    db.save().catch(err => console.log(err));
    e.setTitle(`Success`)
    .setColor(message.guild.color)
    .setDescription(`Alright, I set the autorole to ${role}`)
    return message.channel.send(e)
    }
    }else{
        e.setTitle(`ERROR`)
        .setDescription(`This server doesn't have a server database!`)
        .setColor(`#FF0000`)
        return message.channel.send(e)
    } 
    });
}catch(e){
    this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
}
}
}