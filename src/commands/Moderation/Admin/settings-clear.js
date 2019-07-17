const {Command, RichMenu} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'clearsetting',
      memberName: 'clearsetting',
      aliases: [`clearsettings`, `clearconf`, `clearconfig`,"cs"],
      examples: [`${client.commandPrefix}clearsettings`],
      description: 'Clears a log channel/prefix',
      group: 'admin',
      guildOnly: true,
      userPermissions: ["MANAGE_GUILD"],
      throttling: {
        usages: 1,
        duration: 5
    },
})
}
        async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
            let channels = {
                all: db.channels.log.all,
                user: db.channels.log.user,
                messages: db.channels.log.messages,
                mod: db.channels.log.mod,
                joins: db.channels.log.joins,
                server: db.channels.log.server,


                report: db.channels.reports,
                voice: db.channels.vclogs,
                action: db.channels.action,
                suggest: db.suggestions.channel,
                commands: db.channels.commands
            }
            let prefix = db.prefix;
            let c = message.guild.channels;
            const pop = async function(e){
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
                e.fields.pop()
            };
            message.delete(100).catch()
            let searchResult = ['log', "report", "voice", "action", "suggest", "prefix", "commands", "wc", "wr", "leaves"]
            const e = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle('Clear Settings')
            .setDescription(`Click on the reaction to clear a setting`)
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            const menu = new RichMenu(e)
            .addOption(`Log Channels`, `[New Menu]`, true)
            .addOption(`Reports logchannel`, `${channels.report ? `${c.get(channels.report)}` : "None"}`, true)
            .addOption(`Voice chat logchannel`, `${channels.voice ? `${c.get(channels.voice)}` : "None"}`, true)
            .addOption(`Action logchannel`, `${channels.action ? `${c.get(channels.action)}` : "None"}`, true)
            .addOption(`Suggestions Channel`, `${channels.suggest ? c.get(channels.suggest) : "None"}`, true)
            .addOption(`Prefix`, `${prefix ? prefix : `Default: ${this.client.commandPrefix}`}`, true)
            .addOption("Commands", `${channels.commands ? c.get(channels.commands): "None"}`, true)
            .addOption("Welcome - Channel", db.welcome.channel ? c.get(db.welcome.channel) : "None", true)
            .addOption(`Welcome - Role`, db.welcome.role ? message.guild.roles.get(db.welcome.role) : "None", true)
            .addOption(`Leaves - Channel`, db.leaves.role ? message.guild.roles.get(db.leaves.role) : "None", true)

            let msg = await message.channel.send(`Loading...`)
            const collector = await menu.run(msg, { filter: (reaction, user) => user.id === message.author.id });
    
            const choice = await collector.selection;
            if (choice === null) return collector.message.delete();
            let def = searchResult[choice];
            if(def  === "log"){
                let sr = ['all', "mod", "messages", "user", "joins", "server"]
                const e = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle('Clear Settings')
                .setDescription(`Click on the reaction to clear a setting`)
                .setColor(message.guild ? message.member.displayColor : message.guild.color)
                const menus = new RichMenu(e)
                .addOption(`All`, channels.all ? c.get(channels.all) : "None", true)
                .addOption(`Mod`, channels.mod ? c.get(channels.mod) : "None", true)
                .addOption(`Messages`, channels.messages ? c.get(channels.messages) : "None", true)
                .addOption(`User`, channels.user ? c.get(channels.user) : "None", true)
                .addOption(`Joins`, channels.joins ? c.get(channels.joins) : "None", true)
                .addOption(`Server`, channels.server ? c.get(channels.server) : "None", true)
                await msg.delete()
                let m = await message.channel.send(`Loading...`)
                const collect = await menus.run(m, { filter: (reaction, user) => user.id === message.author.id });
                const eh = await collect.selection;
                if (eh === null) return collect.message.delete();
                let def = sr[eh];
                switch(def.toLowerCase()){
                    case "all":
                    if(db.channels.log.all !== ""){
                    pop(e)
                    db.channels.log.all = ""
                    db.save().catch(err => console.log(err))
                    e.setTitle(`Success`)
                    .setDescription(`Cleared the "all" log channel`)
                    m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "all" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                    case "mod":
                    if(db.channels.log.mod  !== ""){
                        pop(e)
                        db.channels.log.mod = ""
                        db.save().catch(err => console.log(err))
                        e.setTitle(`Success`)
                        .setDescription(`Cleared the "mod" log channel`)
                        m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "mod" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                    case "messages":
                    if(db.channels.log.messages !== ""){
                        pop(e)
                        db.channels.log.messages = ""
                        db.save().catch(err => console.log(err))
                        e.setTitle(`Success`)
                        .setDescription(`Cleared the "messages" log channel`)
                        m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "message" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                    case "user":
                    if(db.channels.log.user !== ""){
                        pop(e)
                        db.channels.log.user = ""
                        db.save().catch(err => console.log(err))
                        e.setTitle(`Success`)
                        .setDescription(`Cleared the "user" log channel`)
                        m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "user" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                    case "joins":
                    if(db.channels.log.joins !== ""){
                        pop(e)
                        db.channels.log.joins = ""
                        db.save().catch(err => console.log(err))
                        e.setTitle(`Success`)
                        .setDescription(`Cleared the "joins" log channel`)
                        m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "joins" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                    case "server":
                    if(db.channels.log.server !== ""){
                        db.channels.log.server = ""
                        db.save().catch(err => console.log(err))
                        e.setTitle(`Success`)
                        .setDescription(`Cleared the "server" log channel`)
                        pop(e)
                        m.edit(e)
                    }else{
                        pop(e)
                        e.setTitle(`INFO`).setColor("#FF0000")
                        .setDescription(`The "server" log channel isn't set!`)
                        m.edit(e)
                    }
                    break;
                }
            }else
            if(def === "report"){
                if(channels.report === ""){
                    e.setDescription(`There isn't a reports log for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.channels.reports = ""
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the reports log channel!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "voice"){
                if(channels.voice === ""){
                    e.setDescription(`There isn't a vc log channel for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.channels.vclogs = ""
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the vc log channel!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "action"){
                if(channels.action === ""){
                    e.setDescription(`There isn't a action logs channel for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.channels.action = ""
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the action logs channel!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "prefix"){
                if(prefix === "" || prefix === this.client.commandPrefix){
                    e.setDescription(`There isn't a prefix set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.prefix = ""
                    message.guild._commandPrefix = this.client.commandPrefix;
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the prefix for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "suggest"){
                if(channels.suggest === ""){
                    e.setDescription(`There isn't a suggestions channel set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.suggestions.channel = '';
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the suggestions channel for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "commands"){
                if(channels.commands === ""){
                    e.setDescription(`There isn't a commands channel set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.channels.commands = '';
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the commands channel for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }
            else
            if(def === "wc"){
                if(db.welcome.channel === ""){
                    e.setDescription(`There isn't a welcome channel set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.welcome.channel = '';
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the welcome channel for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "wr"){
                if(db.welcome.role === ""){
                    e.setDescription(`There isn't a autorole set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.welcome.role = '';
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the autorole for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }else
            if(def === "leaves"){
                if(db.leaves.channel === ""){
                    e.setDescription(`There isn't a leaves channel set for the server!`)
                    .setColor(`#FF0000`)
                    .setTitle(`ERROR`)
                    pop(e)
                    return msg.edit(e)
                }else{
                    db.leaves.channel = '';
                    db.save().catch(err => console.log(err));
                    e.setDescription(`Alright, I cleared the leaves channel for the server!`)
                    .setTitle(`Success`)
                    .setColor(`#FF000`)
                    pop(e)
                    return msg.edit(e)
                }
            }
            }else{
                return message.channel.send(`There isn't a settings database for this server, Please contact the bot developers in the support server.`)
            }
        })
};
}