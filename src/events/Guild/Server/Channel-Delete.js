const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "channelDelete",
            enabled: true
        })
    }
    async run(client, channel){
        try{
            if(await client.m(client) === true) return;
        client.db.findOne({guildID: channel.guild.id}, (err, db) => {
            if(db.logchannel === channel.id){
                db.channels.logchannel = ""
                console.log(`[Log Channel Deleted] Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            if(db.channels.vclogs === channel.id){
                db.channels.vclogs = ''
                console.log(`[Voice Chat Logs Channel Deleted] Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            if(db.channels.action === channel.id){
                db.channels.action = ''
                console.log(`[Action Logs Channel Deleted] Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            if(db.channels.reports === channel.id){
                db.channels.reports = ''
                console.log(`[Reports Log Channel Deleted] Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            if(db.suggestions.channel === channel.id){
                db.suggestions.channel = '';
                console.log(`[Suggestions Channel Delete]: Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            if(db.welcome.channel === channel.id){
                db.welcome.channel = "";
                console.log(`Welcome Channel Deleted: ${channel.guild.name}`)
            }
            if(db.leaves.channel === channel.id){
                db.leaves.channel = "";
                console.log(`Leaves channel Deleted: ${channel.guild.name}`)
            }
            if(db.channels.commands === channel.id){
                db.channels.commands = "";
                console.log(`[Commands Channel Deleted]: Guild: ${channel.guild.name} (${channel.guild.id})`)
            }
            db.save().catch(err => console.log(err))
        })
        let e = new MessageEmbed()
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .setColor(client.util.colors.red)
        .setTitle(`${channel.type.startsWith('t') ? "Text" : ""}${channel.type.startsWith('v') ? "Voice" : ""}${channel.type.startsWith('c') ? "Category" : ""} Channel Deleted`)
        .setDescription(`
        #${channel.name} (${channel.id})   
        **Position: **${channel.rawPosition}${channel.nsfw ? "\n**NSFW: **Enabled": ""}${channel.parentID ? `\n**Under Category: **${channel.guild.channels.get(channel.parentID).name}`: ""}
        **Created At: **${moment(channel.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
        `)
        .setTimestamp()
        channel.topic ?  e.addField(`Topic`, channel.topic ? channel.topic : "None") : ""
        let mod = [];
        if(channel.guild.me.hasPermission('VIEW_AUDIT_LOG')){
            let a = await client.f.audit(channel.guild, "CHANNEL_DELETE");
            if(a !== undefined){
            mod.push(` - Deleted by: \`@${a.executor.tag}\` (${a.executor.id})`)
            e.setFooter(`Deleted By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
            }
        }else{
            e.setFooter(`Deleted By: ? Unknown, I can't view audit logs`)
        }
        return client.f.logging(client, 'server', channel.guild, e, `⚙ Channel Deleted: \`#${channel.name}\` (${channel.id})${mod.length !== 0 ? mod[0] : ""}`)
    }catch(e){
        client.f.event(client, "Channel Delete", e.stack, channel.guild)
    }
    }
}