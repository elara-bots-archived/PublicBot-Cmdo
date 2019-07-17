const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class GuildJoin extends Event{
    constructor(client){
        super(client, {
            name: "guildCreate",
            enabled: true
        });
    }
    async run(client, guild){
        if(guild.available !== true) return;
        try{
        if(guild.memberCount < 5){
            let channel = await guild.channels.filter(c => c.type === "text" && c.permissionsFor(guild.me).has("EMBED_LINKS") && c.permissionsFor(guild.me).has("SEND_MESSAGES")).first();
            if(channel){
                let embed = new MessageEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setColor(client.util.colors.red)
                .setTitle(`INFO`)
                .setTimestamp()
                .setDescription(`You need at least 5 members for me to stay in this server!`)
                return channel.send(embed).then(async () => {guild.leave()})
            }else{
                return guild.leave()
            }
            
        }
        let db = await client.dev.findOne({clientID: client.user.id}, async (err, bl) => {bl})
        if(db.misc.servers.includes(guild.id)) return guild.leave();
        if(db.logging.server !== "" && client.channels.get(db.logging.server) !== null){
            let {name, iconURL, members, memberCount, id, owner, createdAt} = guild;
            let e2 = new MessageEmbed()
            .setAuthor(`${name} (${id})`, iconURL())
            .setThumbnail(iconURL())
            .setColor(client.util.colors.green)
            .setFooter(`We now have ${client.guilds.size} servers!`,client.user.displayAvatarURL())
            .setTitle(`[Server] - Joined`)
            .setTimestamp()
            .setDescription(`
            **MemberCount**
            - Humans: ${members.filter(m => !m.user.bot).size}
            - Bots: ${members.filter(m => m.user.bot).size}
            - Total: ${memberCount}
            **Created At: **${moment(createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}`)
            if(owner !== undefined || owner !== null){
                e2.addField(`Owner`, `${owner.user} \`@${owner.user.tag}\` (${owner.user.id})`)
            }
            try{client.channels.get(db.logging.server).send(e2)}catch(e){}
        }
        const e = new MessageEmbed()
            .setColor(`#FF000`)
            .setAuthor(`Owner: ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL())
            .setFooter(guild.name, guild.iconURL() ? guild.iconURL() : guild.owner.user.displayAvatarURL())
            .setThumbnail(guild.iconURL() ? guild.iconURL() : guild.owner.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`Server Joined`)
            .setDescription(`
            **Name: **${guild.name} (${guild.id})
            **Owner: **${guild.owner.user} \`${guild.owner.user.tag}\` (${guild.ownerID})
            **Region: **${client.util.region[guild.region]}
            **Verification Level: **${client.util.verifLevels[guild.verificationLevel]}
            **Member Count: **
            - Total: ${guild.memberCount}
            - Bots: ${guild.members.filter(m => m.user.bot).size}
            - Humans: ${guild.members.filter(m => !m.user.bot).size}
            **Role Count: **${guild.roles.size}
            **Emoji Count: **${guild.emojis.size}
            **Channel Count: **${guild.channels.size}
            **Large: **${guild.large ? "Yes" : "No"}
            **Created At: **${moment(guild.createdAt).format("dddd, MMMM Do YYYY")}
            `)
        client.f.hooks('servers', e)
        client.db.findOne({ guildID: guild.id }, (err, settings) => {
            if (err) console.log(err);
            if (!settings) {
                const newSettings = new client.db({
                    guildName: guild.name,
                    guildID: guild.id,
                    prefix: "",
                    warnings: [],
                    misc: {
                        throws: [],
                        jobs: [],
                        currency: "Coins"
                    },
                    channels: {
                        log: {
                            all: "",
                            user: "",
                            server: "",
                            mod: "",
                            joins: "",
                            messages: ""
                        },
                        reports: "",
                        vclogs: "",
                        action: "",
                        commands: "",
                        ignore: []
                    },
                    toggles: {
                        user: false,
                        mod: true,
                        messages: true,
                        server: true,
                        joins: true,
                        ignore: false
                    },
                    suggestions: {
                        channel: "",
                        reaction1: "",
                        reaction2: ""
                    },
                    welcome: {
                        channel: "",
                        role: "",
                        embed: true,
                        msg: ""
                    },
                    leaves: {
                        channel: "",
                        embed: true,
                        msg: ""
                    }
                });
    
                newSettings.save().catch(err => console.log(err));
            }
        });
        client.warns.findOne({guildID: guild.id}, async (err, db) => {
            if(!db){
                new client.warns({
                    guildID: guild.id,
                    guildName: guild.name, 
                    warnings: []
                }).save().catch(err => console.log(err));
            }
        })
        client.f.stats(client, "join", {name: null, msg: null});
    } catch (e) {
        client.f.event(client, "Guild Create", e.stack, guild)
    }
    }
}