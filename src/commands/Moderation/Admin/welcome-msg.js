const { Command } = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "set-message",
            memberName: "set-message",
            aliases: [],
            examples: [`${client.commandPrefix}set-message [type] [Message]`],
            description: "Sets the welcome message for the server..",
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "type",
                    prompt: "What is the message you want to set, `joins` or `leaves`",
                    type: "string",
                    parse: str => str.toLowerCase()
                },
                {
                    key: "msg",
                    prompt: "What do you want to set the join/leave message to? Do ",
                    type: "string",
                    default: ""
                }
            ]
        })
    }
    async run(message, {type, msg}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        
        try{
            
        let e = new Discord.MessageEmbed().setColor(message.guild.color)
if(msg !== ""){        
this.client.db.findOne({ guildID: message.guild.id }, async (err, db) => {
    if(db){
        switch(type){
            case "joins":
            db.welcome.msg = msg;
            db.save().catch(err => console.log(err));
            e.setTitle(`Success`)
            .setDescription(`Alright, I set the welcome message to\n\n${msg}`)
            .setColor(`#FF000`)
            message.channel.send(e)
            break;
            case "leaves":
            db.leaves.msg = msg;
            db.save().catch(err => console.log(err));
            e.setTitle(`Success`)
            .setDescription(`Alright, I set the leaves message to\n\n${msg}`)
            .setColor(`#FF000`)
            message.channel.send(e)
            break;
        }
    }else{
        e.setTitle(`ERROR`)
        .setDescription(`This server doesn't have a server database!`)
        .setColor(`#FF0000`)
        return message.channel.send(e)
    } 
    });
}else{
    e.setDescription("`{user}` - for the new members username\n`{mention}` - for the mention of the new member\n`{server}` - for the server name\n`{mc}` - for the server's membercount").setTitle(`Welcome/Leave Message Help`)
    .setColor(`#FF000`)
    return message.channel.send(e)
}
}catch(e){
    this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
}
}
}