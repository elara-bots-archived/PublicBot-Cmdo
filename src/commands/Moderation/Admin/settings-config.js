const { Command } = require('elaracmdo'),
  Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "config",
            memberName: "config",
            aliases: [],
            examples: [`${client.commandPrefix}config <log> [#channel]`],
            description: "Sets the modlogs channel for the server.",
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [
                {
                    key: "type",
                    prompt: "What do you want to change? [`leaves`, `welcome`, `log`, `vclogs`, `action`, `reports`, `ignore`, `commands`]",
                    type: "string",
                    parse: str => str.toLowerCase()
                },
                {
                    key: "channel",
                    prompt: "Please select a channel.",
                    type: "channel"
                },
                {
                    key: "types",
                    prompt: "What do you want to set? [`all`, `joins`, `mod`, `messages`, `server`, `user`]",
                    type: "string",
                    default: "all",
                    parse: str => str.toLowerCase()
                }
            ]
        })
    }
    async run(message, {type, channel, types}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL()).setColor(`#FF0000`).setTitle(`ERROR`)
        
        this.client.db.findOne({ guildID: message.guild.id }, async (err, db) =>{
        let idk = `To clear it use ${message.guild._commandPrefix ? message.guild._commandPrefix : this.client.commandPrefix}clearsettings`
        switch(type){
            case "log":
                switch(types){
                case "all":
                if(db.channels.log.all === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "all" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.all = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "all" events.`)
                    message.channel.send(e)
                }
                break;
                case "user":
                if(db.channels.log.user === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "user" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.user = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "user" events.`)
                    message.channel.send(e)
                }
                break;
                case "messages":
                if(db.channels.log.messages === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "messages" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.messages = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "messages" events.`)
                    message.channel.send(e)
                }
                break;
                case "mod":
                if(db.channels.log.mod === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "all" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.mod = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "mod" events.`)
                    message.channel.send(e)
                }
                break;
                case "server":
                if(db.channels.log.server === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "server" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.server = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "server" events.`)
                    message.channel.send(e)
                }
                break;
                case "joins":
            if(db.channels.log.joins === channel.id){
                e.setTitle(`Info`)
                .setDescription(`${channel}, already is the "joins" logging channel`)
                message.channel.send(e)
                }else{
                    db.channels.log.joins = channel.id;
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Info`)
                    .setDescription(`${channel}, will now log "joins" events.`)
                    message.channel.send(e)
                }
                break;
                }
            break;
            case "action":
            if(db.channels.action === channel.id){
                e.setDescription(`${channel} is already the action logs!`).setFooter(idk)
                message.channel.send(e)
                }else{
                db.channels.action = channel.id;
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`)
                .setDescription(`Alright, I set the action logs for ${channel}`).setFooter(idk)
                .setColor(`#FF000`)
                message.channel.send(e)
                }
            break;
            case "reports":
            if(db.channels.reports === channel.id){
                e.setDescription(`${channel} is already the report logs!`).setFooter(idk)
                message.channel.send(e)
                }else{
                db.channels.reports = channel.id;
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`)
                .setDescription(`Alright, I set the report logs for ${channel}`).setFooter(idk)
                .setColor(`#FF000`)
                message.channel.send(e)
                }
            break;
            case "vclogs":
            if(db.channels.vclogs === channel.id){
                e.setDescription(`${channel} is already the voice chat logs!`).setFooter(idk)
                message.channel.send(e)
                }else{
                db.channels.vclogs = channel.id;
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`)
                .setDescription(`Alright, I set the voice chat logs for ${channel}`).setFooter(idk)
                .setColor(`#FF000`)
                message.channel.send(e)
                }
            break;
            case "ignore":
            if(db.channels.ignore.includes(channel.id)){
                let i = []
                db.channels.ignore.forEach(c => {
                    if(channel.id !== c){
                    i.push(c);
                    }
                })
                db.channels.ignore = i;
                db.save().catch(err => console.log(err));
                e.setTitle(`Success`).setColor(`#FF000`).setDescription(`Alright, I removed ${channel} from being ignored.`)
                message.channel.send(e)
                }else{
                db.channels.ignore.push(channel.id);
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`)
                .setDescription(`Alright, I set ${channel} to be ignored`)
                .setColor(`#FF000`)
                message.channel.send(e)
                }
            break;
            case "commands":
            if(db.channels.commands === channel.id){
                db.channels.commands = "";
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`).setColor(`#FF000`).setDescription(`Alright, I removed ${channel} from being the commands channel.`).setFooter(idk)
                message.channel.send(e)
            }else{
                db.channels.commands = channel.id
                db.save().catch(err => console.log(err))
                e.setTitle(`Success`).setColor(`#FF000`).setDescription(`Alright, I added ${channel} to be the commands channel.`).setFooter(idk)
                message.channel.send(e)
            }
            break;
            case "welcome":
            if(db.welcome.channel === channel.id){
                e.setTitle(`ERROR`)
                .setDescription(`That channel is already set as the welcome.`).setFooter(idk)
                .setColor(`#FF0000`)
                message.channel.send(e)
            }else{
            db.welcome.channel = channel.id;
            db.save().catch(err => console.log(err));
            e.setTitle(`Success`)
            .setColor(message.guild.color)
            .setDescription(`Alright, I set the welcome channel to ${channel}`).setFooter(idk)
            message.channel.send(e)
            }
            break;
            case "leaves":
            if(db.leaves.channel === channel.id){
                e.setTitle(`ERROR`)
                .setDescription(`That channel is already set as the leaves.`).setFooter(idk)
                .setColor(`#FF0000`)
                message.channel.send(e)
            }else{
            db.leaves.channel = channel.id;
            db.save().catch(err => console.log(err));
            e.setTitle(`Success`)
            .setColor(message.guild.color)
            .setDescription(`Alright, I set the leaves channel to ${channel}`).setFooter(idk)
            message.channel.send(e)
            }
            break;
            default:
            e.setDescription(`You didn't choose something to change, \`log\`, \`action\`, \`reports\`, \`vclogs\`, \`ignore\`, \`commands\``)
            message.channel.send(e) 
            break;
        }
        });
}catch(e){
    this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
}
}
}