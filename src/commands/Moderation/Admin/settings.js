const { Command } = require('elaracmdo'),
      Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "settings",
            memberName: "settings",
            aliases: ["setting"],
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            examples: [`${client.commandPrefix}settings`],
            description: "Shows you the current settings for the server",
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
    try{
    this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
        if(!db) {
            return message.channel.send(`There is no database for this server, Please contact the bot owner!`)
        }else{
            let jobs;
            let throws;
            if(db.misc.jobs.length !== 0){
            jobs = await this.client.f.bin(`${message.guild.name}'s Jobs`, db.misc.jobs.join('\n'));
            }
            if(db.misc.throws.length !== 0){
            throws = await this.client.f.bin(`${message.guild.name}'s Throws`, db.misc.throws.join('\n'));
            }
            let e = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(message.member.displayColor)
            .setTimestamp()
            .setTitle(`Server Settings`)
            .addField(`Misc`, `
            **Prefix: **${db.prefix ? db.prefix : `Default: ${this.client.commandPrefix}`}
            **Currency: **${db.misc.currency === "" ? message.guild.currency : db.misc.currency}
            ${db.misc.jobs.length === 0 ? "" : `**Jobs: **[Link](${jobs})`}${db.misc.throws.length === 0 ? "" : `\n**Throws: **[Link](${throws})`}`)
            
            .addField(`Log Channels`, `
            **Action: **${db.channels.action ? `<#${db.channels.action}>` : "None"}
            **Reports: **${db.channels.reports ? `<#${db.channels.reports}>` : "None"}
            **Voice: **${db.channels.vclogs ? `<#${db.channels.vclogs}>` : "None"}
            **Logs:**
            - All: ${db.channels.log.all ? `<#${db.channels.log.all}>`: "None"}
            - Server: ${db.channels.log.server ? `<#${db.channels.log.server}>`: "None"}
            - Mod: ${db.channels.log.mod ? `<#${db.channels.log.mod}>`: "None"}
            - Joins: ${db.channels.log.joins ? `<#${db.channels.log.joins}>`: "None"}
            - Messages: ${db.channels.log.messages ? `<#${db.channels.log.messages}>`: "None"}
            - User: ${db.channels.log.user ? `<#${db.channels.log.user}>`: "None"}
            `)

            .addField(`Welcome`, `
            **Role: **${db.welcome.role ? `<@&${db.welcome.role}>` : "None"}
            **Channel: **${db.welcome.channel ? `<#${db.welcome.channel}>` : "None"}
            **Message: **${db.welcome.msg ? db.welcome.msg : `Welcome {user} to {server}!`}
            **Embed: **${db.welcome.embed ? "Enabled" : "Disabled"}`)
            .addField(`Leaves`, `
            **Channel: **${db.leaves.channel ? `<#${db.leaves.channel}>` : "None"}
            **Message: **${db.leaves.msg ? db.leaves.msg : `Goodbye {user}, {server} won't miss you!!`}
            **Embed: **${db.leaves.embed ? "Enabled" : "Disabled"}`)
            
            .addField(`Suggestions`, `
            **Channel: **${db.suggestions.channel ? `<#${db.suggestions.channel}>` : "None"}
            **Reactions: **${db.suggestions.reaction1 ? this.client.emojis.get(db.suggestions.reaction1) :  "✅"}, ${db.suggestions.reaction2 ? this.client.emojis.get(db.suggestions.reaction2) : "❌"}`)
            
            .addField(`Event Modules`, `
            **Server: **${db.toggles.server ? "Enabled" : "Disabled"}
            **Mod: **${db.toggles.mod ? "Enabled" : "Disabled"}
            **Messages: **${db.toggles.messages ? "Enabled": "Disabled"}
            **Joins: **${db.toggles.joins ? "Enabled": "Disabled"}
            **User: **${db.toggles.user ? "Enabled": "Disabled"}
            **Logbots: **${db.toggles.logbots ? "Enabled" : "Disabled"}
            `)
            .setDescription(`${db.channels.ignore.length !== 0 ? `**Ignored Channels**\n${db.channels.ignore.map(c => `<#${c}>`).join('\n')}` : ""}`)
            .addField(`Note`, `To enable/disable a feature. Do \`${message.guild._commandPrefix ? message.guild._commandPrefix : this.client.commandPrefix}toggle\``)
            .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
            message.channel.send(e)
        }
    });  
    } catch (e) {
    this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}