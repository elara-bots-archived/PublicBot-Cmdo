const { Command, CPU } = require('elaracmdo'), moment = require("moment"), Discord = require('discord.js');
require("moment-duration-format");
let pl = {"win32": "Windows", "linux": "Linux", "darwin": "Darwin", "undefined": "Unknown"}, info = {0: "Ready", 1: "Connecting", 2: "Reconnecting", 3: "Idle", 4: "Nearly", 5: "Disconnected"}
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            memberName: "stats",
            aliases: [],
            examples: [`${client.commandPrefix}stats`],
            description: "Gives you the stats for the bot",
            group: "bot",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{ 
        if(message.guild){
        let stat = await this.client.dev.findOne({ clientID: this.client.user.id }, async (err, db) => { db })
        let embed = new Discord.MessageEmbed()
            .setColor(this.client.util.colors.default)
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField(`System Info`, `
            **CPU: **${CPU.totalCores()} Cores ${CPU.avgClockMHz()}MHz
            **Memory Used: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            **Operating System: **${pl[process.platform]}`)

            .setAuthor(`${this.client.user.tag}`, this.client.user.displayAvatarURL())
            .addField(`Info`, `
            **Ping: **${Math.round(this.client.ws.ping)}ms
            **Uptime: **${moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")}
            **Servers: **${this.client.guilds.size}\n**Users: **${this.client.users.size}
            **Channels: **${this.client.channels.size}
            **Emojis: **${this.client.emojis.size}
            **Shard: **${message.guild.shard.id}
            - ${info[message.guild.shard.status]}
            
            **Stats: **
             - Commands Used: ${stat.stats.cmdrun}
             - Commands Total: ${this.client.registry.commands.size}
             `, true)
        if(this.client.isOwner(message.author.id)){
            embed.addField(`\u200b`, `
            **Servers Joined: **${stat.stats.guildsjoin}
            **Servers Left: **${stat.stats.guildsleft}
            **Starts: **${stat.stats.starts}
            **Restarts: **${stat.stats.restarts}
            **Shutdowns: **${stat.stats.shutdowns}
            `, true)
        }
        if(message.member.hasPermission("MANAGE_GUILD") || this.client.isOwner(message.author.id)){
            embed.addField(`Settings`, `Do \`${message.guild._commandPrefix ? message.guild._commandPrefix : this.client.commandPrefix}settings\` to view the current settings!`)
        }
        message.say(embed)
        }else{
            let stat = await this.client.dev.findOne({ clientID: this.client.user.id }, async (err, db) => { db })
            
            let pl = {"win32": "Windows", "linux": "Linux", "darwin": "Darwin", "undefined": "Undefined"}
        let embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField(`System Info`, `
            **CPU: **${CPU.totalCores()} Cores ${CPU.avgClockMHz()}MHz
            **Memory Used: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
            **Operating System: **${pl[process.platform]}`)
            .setAuthor(`${this.client.user.tag}`, this.client.user.displayAvatarURL())
            .addField(`Info`, `
            **Ping: **${Math.round(this.client.ws.ping)}ms
            **Uptime: **${moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")}
            **Servers: **${this.client.guilds.size}\n**Users: **${this.client.users.size}
            **Channels: **${this.client.channels.size}\n**Emojis: **${this.client.emojis.size}
            **Shard: **${message.guild.shard.id}: ${info[message.guild.shard.status]}
            **Stats: **
             - Commands Used: ${stat.stats.cmdrun}
             - Commands Total: ${this.client.registry.commands.size}
            `)
        message.say(embed)
        }
    }catch(e){
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
    }
}