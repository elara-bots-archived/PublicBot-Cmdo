const {MessageEmbed, WebhookClient, Collection} = require('discord.js'), {post, get} = require('superagent'), {Haste, eutil: {colors}} = require('elaracmdo'), config = require('./config.js'), {readdir} = require('fs'), {log} = console, moment = require('moment'), cooldown = new Set();
class Functions{
    constructor(){
        this.coins = async function(client, message) {
            if (message.author.bot || message.webhookID !== null) return;
            let addcoins = Math.ceil(Math.random() * 25);
            client.dbcoins.findOne({ userID: message.author.id, guildID: message.guild.id }, async (err, db) => {
                if (err) return log(err)
                if (!db) {
                    let user;
                    await client.isOwner(message.author.id) ? user = true : user = false;
                    const newdb = new client.dbcoins({
                        userTag: message.author.tag,
                        userID: message.author.id,
                        guildID: message.guild.id,
                        coins: addcoins,
                        bank: 0,
                        daily: {date: "", bonus: 0},
                        bonus: {cmdboost: user, msgboost: user, robboost: user, immunity: user}
                    });
                    newdb.save().catch(err => log(err));
                } else {
                    
                    if(db.bonus.msgboost === true){
                    let coinsadd = Math.ceil(Math.random() * 1000)
                    db.coins = db.coins + coinsadd
                    }else{
                    db.coins = db.coins + addcoins;
                    }
                    db.save().catch(err => log(err));
                }
            });
        };
        this.commands = async function(client, message){
            if(message.channel.type === "dm") return;
            client.dbs.config.findOne({guildID: message.guild.id}).exec((err, data) => {
                if(data){
                    data.commands.forEach(async db => {
                        if(message.content.toLowerCase().startsWith(db.cmd)){
                            message.channel.send(db.response
                                .replace('{user}', message.author).replace("{user.avatar}", message.author.displayAvatarURL()).replace("{user.id}", message.author.id).replace("{user.tag}", message.author.tag).replace("{user.createdAt}", moment(message.author.createdAt).format("dddd MMMM Do YYYY h:mm:ssa"))
                                .replace('{server}', message.guild.name).replace("{server.icon}", message.guild.iconURL()).replace('{server.id}', message.guild.id).replace("{server.createdAt}", moment(message.guild.createdAt).format("dddd, MMMM Do YYYY h:mm:ssa"))
                                .replace('{channel}', message.channel).replace("{channel.id}", message.channel.id).replace("{channel.type}", message.channel.type).replace("{channel.topic}", message.channel.topic ? message.change.topic : "None").replace("{channel.name}", message.channel.name))
                        }
                    })
                }
            })
        };
        this.main = async function(client, message){
            if(message.channel.type === "dm" || message.webhookID !== null) return;
            client.db.findOne({guildID: message.guild.id}, async (err, db) => {
                if(db){
                if(message.channel.id === db.suggestions.channel){
                    if(client.isOwner(message.author.id)) return;
                    if(db.toggles.ignore === true){if(message.author.id === message.guild.ownerID) return;}
                    let channel = await message.guild.channels.get(db.suggestions.channel)
                    if(!channel) return;
                    if(!channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                        if(db.suggestions.reaction1 !== ""){
                            message.react(db.suggestions.reaction1)
                        }else{
                            message.react("✅")
                        }
                        if(db.suggestions.reaction2 !== ""){
                            message.react(db.suggestions.reaction2)
                        }else{
                            message.react("❌")
                        }
                }
                if(!message.content.startsWith(db.prefix || client.commandPrefix)){
                if(message.channel.name.includes("spam")) return;
                if(message.guild.id === "264445053596991498" || message.guild.id === "524405023283740676") return;
                    if(cooldown.has(message.author.id)) return;
                    if(!client.isOwner(message.author.id)) cooldown.add(message.author.id)
                    setTimeout(() => {cooldown.delete(message.author.id);}, 6 * 10000)
                    client.f.coins(client, message);
                }
                if(db.misc.color !== "") message.guild.color = db.misc.color
                if(db.misc.currency !== "") message.guild.currency = db.misc.currency
                if(db.prefix === "") message.guild._commandPrefix = client.commandPrefix;
                if(db.prefix !== "") message.guild._commandPrefix = db.prefix;
                }
            })
        };
        this.pings = async function(client, message){
            if(message.channel.type === "dm") return;
            if(message.mentions.users){
                message.mentions.users.forEach(u => {
                    if(u.bot) return;
                    client.u.findOne({userID: u.id}, async (err, db) => {
                        if(db){
                            if(db.afk.en === true){
                                if(message.author.id === db.userID) return;
                                if(message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")){
                                let e = new MessageEmbed()
                                .setAuthor(`${u.tag} is currently AFK`, u.displayAvatarURL())
                                .setColor(message.guild.members.get(u.id).displayColor)
                                if(db.afk.message){
                                    e.setDescription(db.afk.message)
                                    .setTitle(`Message`)
                                }
                                return message.channel.send(message.author, {embed: e})
                                }else{
                                return message.reply(`**${u.username}** is currently AFK${db.afk.message ? `\n**Message: **${db.afk.message}` : ""}`)
                                }
                            }
                        }
                    })
                })
            }
        };
        this.back = async function(client, message){
            client.u.findOne({userID: message.author.id}, async (err,data) => {
                if(data){
                    if(data.afk.en === true){
                        data.afk.en = false;
                        data.afk.message = "";
                        data.save().catch(err => log(err));
                        return message.reply(`Welcome back, I have removed your afk status!`).then(m=>m.delete(30000).catch())
                    }
                }
            })
        };
        this.logbots = async function(client, guild, user){
            try{
            let db = await client.db.findOne({guildID: guild.id}, async (err, db) => {db})
            if(!db) return false;
            if(db.toggles.logbots === false && user.bot) return true;
            if(db.toggles.logbots === true) return false;
            }catch(e){
                return false;
            }
        };
        this.ignore = async function(client, guild, channel){
            let db = await client.db.findOne({guildID: guild.id}, async (err, db) => {db});
            if(!db) return false;
            if(db.channels.ignore.includes(channel)) return true;
            if(db.channels.log.all === channel) return true
            if(db.channels.log.user === channel) return true
            if(db.channels.log.server === channel) return true
            if(db.channels.log.mod === channel) return true
            if(db.channels.log.joins === channel) return true
            if(db.channels.log.messages === channel) return true
        };
        this.cmdschannel = async function(message){
            message.delete(100).catch()
            let db = await require('./Schemas').settings.findOne({guildID: message.guild.id}, async (err, db) => {db})
            let e = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`You can't do commands in this channel! Go to <#${db.channels.commands}>!`)
            .setTitle(`INFO`)
            .setColor(`#FF0000`)
            .setFooter(`This message will delete in 15 seconds`)
            return message.channel.send(message.author, {embed: e}).then(m => m.delete(15000).catch())
        }; 
        this.channel = async function(client, message){
            if(message.channel.type === "dm") return false
            let db = await client.db.findOne({guildID: message.guild.id}, async (err, db) => {db});
            if(!db) return false;
            if(db.channels.commands === "") return false
            if(db.channels.commands !== message.channel.id && !message.member.hasPermission("MANAGE_MESSAGES") && !client.isOwner(message.author.id)) return true
        };
        this.blacklist = async function(client, message){
            let data = await client.dev.findOne({clientID: client.user.id}, async (err, db) => {db});
            if(!data) return false
            if(data.misc.users.includes(message.author.id)) return true
        
        };
        this.maint = async function(client){
            let db = await client.dev.findOne({clientID: client.user.id}, async(err, db) => {db})
            if(!db) return false
            if(db.misc.maintenance === true) return true
        };
        this.msg = async function(msg){
            let e = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setColor(`#FF0000`)
            .setTitle(`The bot is currently in maintenance. Please wait.`)
            .setDescription(`Join the support server to keep up with the maintenance.\nhttps://discord.gg/qafHJ63`)
            .setTimestamp()
            return msg.channel.send(e)
        };
        this.audit = async function(guild, type){
            let audit = await guild.fetchAuditLogs({type: type})
            return audit.entries.first()
        };
        this.event = async function(client, event, error, guild){
            let e = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setColor(`#FF0000`)
            .setDescription(error.replace(new RegExp(__dirname, "g"), "Home/"))
            .setTitle(`${event} Event Error`)
            .setTimestamp()
            if(guild){
                e.addField(`Server`, `${guild.name} (${guild.id})`)
            }
            client.f.hooks('error', e)
        };
        this.userdb = async function(client, user){
            await client.u.findOne({userID: user.id}, async (err,db) => {
                if(!db){
                let dev = await client.dev.findOne({clientID: client.user.id}, async(err, db) => {db})
                if(dev.misc.users.includes(user.id) === true) return;
                    let newdb = new client.u({
                        userTag: user.tag,
                        userID: user.id,
                        reps: 0,
                        hearts: 0,
                        todos: [],
                        custom: {
                        image: "",
                        desc: ""
                        },
                        afk: {en: false, message: ""}
                    });
                    newdb.save().catch(err => log(err));
                };
            })
        };
        this.days = async function(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        this.weeks = async function(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let weeks = Math.floor(diff / 604800000);
            return weeks + (weeks == 1 ? " week" : " weeks") + " ago";
        };
        this.mention = async function(client, args){
            const matches = args.match(/^(?:<@!?)?([0-9]+)>?$/);
            const user = await client.users.fetch(matches[1])
            return user
        };
        this.logger = async function(client, message, error, shard = null) {
            let err = await config.rexexp(error);
            if(shard === null){
            let e = new MessageEmbed()
            .setColor(client.util.colors.default)
            .setTitle(`[Logger] - **Error**`)
            .setDescription(err)
            .setTimestamp()
            .setFooter(`Reported At`)
            .setAuthor(`${message.guild ? `Server: ${message.guild.name} (${message.guild.id})` : `DM: @${message.author.tag} (${message.author.id})`}`, message.guild ? message.guild.iconURL() : message.author.displayAvatarURL());
            message.guild ? e.addField(`Server`, `${message.guild.name} (${message.guild.id}) [Shard: ${message.guild.shardID}]`) : e.addField(`DM`, `@${message.author.tag} (${message.author.id})`);
            message.channel.type === "text" ? e.addField(`Channel`, `${message.channel} \`#${message.channel.name}\` (${message.channel.id})`) : null;
            e.addField(`User`, `${message.author} \`@${message.author.tag}\` (${message.author.id})`)
            client.f.hooks('error', e)
            }else{
                let e = new MessageEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setColor(`#FF0000`)
                .setTitle(`Shard: ${shard}: Error`)
                .setDescription(err)
                client.f.hooks('error', e)
            }
        };
        this.stats = async function(client, type, {name = null, msg = null}){
            if(name !== null && msg !== null){
                if(config.webhooks.cmds === "") return null;
                        log(`Command: "${name}" was used by user: ${msg.author.tag} (${msg.author.id}) in ${msg.guild ? `server: ${msg.guild.name} (${msg.guild.id})`: "dms"}`)
                        let e = new MessageEmbed()
                        .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL())
                        .setColor(client.util.colors.cyan)
                        .setTimestamp()
                        .setTitle(`Command Used: ${name}`)
                        if(msg.guild){
                            e.setFooter(`Server: ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL())
                        }else{
                            e.setFooter(`DMs`)
                        }
                        this.webhook(config.webhooks.cmds, e)
            }
            client.dev.findOne({clientID: client.user.id}, async (err, db) => {
                if(db){
                    switch(type){
                        case "cmd":
                        db.stats.cmdrun = db.stats.cmdrun + 1;
                        db.save().catch(err => log(err));
                        break;
                        case "join":
                        db.stats.guildsjoin = db.stats.guildsjoin + 1;
                        db.save().catch(err => log(err));
                        break;
                        case "leave":
                        db.stats.guildsleft = db.stats.guildsleft + 1;
                        db.save().catch(err => log(err));
                        break;
                        case "starts":
                        db.stats.starts = db.stats.starts + 1;
                        db.save().catch(err => log(err));
                        break;
                        case "restarts":
                        db.stats.restarts = db.stats.restarts + 1;
                        db.save().catch(err => log(err));
                        break;
                        case "shutdowns":
                        db.stats.shutdowns = db.stats.shutdowns + 1;
                        db.save().catch(err => log(err));
                        break;
                    }
                }
            })
        };
        this.embed = async function(client, message, title, desription){
            let e = new MessageEmbed()
            e.setAuthor(message.author.tag, message.author.displayAvatarURL());
            e.setFooter(client.user.tag, client.user.displayAvatarURL());
            e.setColor(client.util.colors.cyan);
            if(title){
                e.setTitle(title);
            }
            if(desription){
                e.setDescription(desription);
            }
            message.channel.send(e)
        };
        this.error = async function(client, msg, error){
            let e = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setColor(client.util.colors.default)
            .setDescription(error)
            .setTimestamp()
            .setTitle(`INFO`)
            if(msg.channel.permissionsFor(client.user.id).has(['EMBED_LINKS']) == true){
                msg.channel.send(e)
            }else{
                msg.channel.send(`ERROR:\n\`\`\`js\n${error}\`\`\``)
            }
        };
        this.bin = async function(title, args, ext = "txt"){
            let link;
            let hbin = await Haste(`${title}\n\n${args}`, {url: "https://hasteb.in", extension: ext}).catch(async err => {
                if(err){
                    let { body } = await post(`https://paste.lemonmc.com/api/json/create`).send({data: `${args}`,language: 'text',private: false,title: `${title}`, expire: '2592000'}).catch(err => {log(err)})
                    link = `https://paste.lemonmc.com/${body.result.id}/${body.result.hash}`
                }
            })
            if(hbin.includes('https://hasteb.in/')) link = hbin
            if(!hbin.includes('https://hasteb.in/')){
                let { body } = await post(`https://paste.lemonmc.com/api/json/create`).send({data: `${args}`,language: 'text',private: false,title: `${title}`, expire: '2592000'}).catch(err => {log(err)})
                link = `https://paste.lemonmc.com/${body.result.id}/${body.result.hash}`
            }
            return link;
        };
        this.dembed = async function(msg, args){
            let embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            .setColor(65509)
            .setDescription(args)
            .setTimestamp()
            return msg.channel.send(embed)
        };
        this.starting = async function(client){
            await client.dev.findOne({clientID: client.user.id}, async(err,db) => {
                if(!db){
                    new client.dev({
                        clientTag: client.user.tag,
                        clientID: client.user.id,
                        misc: {
                            maintenance: false,
                            servers: [],
                            users: []
                        },
                        logging: {
                            status: "",
                            server: ""
                        },
                        dms: {
                            enabled: false,
                            hook: ""
                        },
                        cmdlog: {
                            enabled: false,
                            hook: ""
                        },
                        stats: {cmdrun: 0, guildsjoin: 0, guildsleft: 0, restarts: 0, shutdowns: 0, starts: 1},
                        change: {time: "", args: ""},
                        logs: {connect: `[Connected]: Time: ${moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss:a")}`, reconnect: "", disconnect: ""}
                    }).save().catch(err => log(err.stack))
                }else{
                    db.logs.connect = `[Connected]: Time: ${moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss:a")}`
                    db.stats.starts = db.stats.starts + 1;
                    db.save().catch(err => log(err.stack));
                }
            })
            await client.guilds.forEach(async guild => {
                await client.custom.findOne({guildID: guild.id}, async (err, db) => {
                    if(!db){
                        new client.custom({
                            guildID: guild.id,
                            guildName: guild.name, 
                            warnings: [],
                            commands: []
                        }).save().catch(err => log(err));
                    }
                })
                client.db.findOne({ guildID: guild.id }, (err, settings) => {
                        if (err) log(err);
                        if (!settings) {
                            new client.db({
                                guildName: guild.name,
                                guildID: guild.id,
                                prefix: "",
                                misc: {
                                    throws: [],
                                    jobs: [],
                                    currency: "",
                                    color: ""
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
                                    ignore: false,
                                    logbots: false
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
                            }).save().catch(err => log(err));
                        }else{
                        if(settings.prefix !== ''){
                            guild._commandPrefix = settings.prefix;
                        }
                    }
                    });
            });
                let stats = await client.dev.findOne({clientID: client.user.id}, async(err, db) => {db})
                let e = new MessageEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setColor(client.util.colors.cyan)
                .setTitle(`Connected`)
                .setDescription(`${client.user} \`@${client.user.tag}\` (${client.user.id})`)
                .addField(`**Stats**`, `
                **Commands Used: **${stats.stats.cmdrun}
                **Emojis: **${client.emojis.size}
                **Servers: **${client.guilds.size}
                **Channels: **${client.channels.size}
                **Restarts: **${stats.stats.restarts}
                **Shutdowns: **${stats.stats.shutdowns}
                **Starts: **${stats.stats.starts}
                **Users**
                - Humans: ${client.users.filter(c => !c.bot).size}
                - Bots: ${client.users.filter(c => c.bot).size}
                - Total: ${client.users.size}
                **Servers**
                - Join: ${stats.stats.guildsjoin}
                - Leave: ${stats.stats.guildsleft}
                **Blacklist**
                - Users: ${stats.misc.users.length}
                - Servers: ${stats.misc.servers.length}
                `, false)
                client.f.hooks('log', e)
                let roles = 0;
                await client.guilds.forEach(g => {roles = roles + g.roles.size})
                let perroles = new Collection();
                await client.guilds.forEach(g => {
                    g.roles.forEach(c => {
                        perroles.set(c.id, c)
                    })
                });
                client.roles = perroles;
                await log(`[Client] - Connected`)
                await log(`[Stats] - ${client.guilds.size} Servers, ${client.channels.size} Channels, ${client.users.size} Users, ${client.emojis.size} Emojis, ${roles} Roles`)
                await log(`[Setup] - Finished`)
                await log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            if(config.presence.random.enabled === true){
                client.user.setPresence({ status: "online", activity: { name: `${client.commandPrefix}help`, type: "STREAMING", url: "https://www.twitch.tv/elarabots_discord" } });
                let status =  [
                    `Serving: ${client.guilds.size} Servers, ${client.users.size} Users, ${client.channels.size} Channels.`, 
                    `My Support Server: ${client.options.invite}`,
                    `👀`
                  ]
                client.setInterval(() => {client.user.setPresence({ status: "online", activity: { name: `${client.commandPrefix}help | ${status[Math.floor((Math.random() * status.length))]}`, type: "STREAMING", url: "https://www.twitch.tv/elarabots_discord" } })}, 60000);
            }else{
                config.presence.default.def(client)
            }
        };
        this.logging = async function(client, type, guild,embed, compact){
            switch(type.toLowerCase()){
                case "user":
                client.db.findOne({guildID: guild.id}, async(err, db) => {
                if(db){
                    if(db.toggles.user !== false){
                        if(db.channels.log.user !== ""){
                            let logs = guild.channels.get(db.channels.log.user)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }else
                        if(db.channels.log.all !== ""){
                            let logs = guild.channels.get(db.channels.log.all)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }
                    }
                }
                })
                break;
                case "server":
            client.db.findOne({guildID: guild.id}, async(err, db) => {
                if(db){
                    if(db.toggles.server !== false){
                        if(db.channels.log.server !== ""){
                            let logs = guild.channels.get(db.channels.log.server)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }else
                        if(db.channels.log.all !== ""){
                            let logs = guild.channels.get(db.channels.log.all)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }
                    }
                }
            })
                break;
                case "mod":
            client.db.findOne({guildID: guild.id}, async(err, db) => {
                if(db){
                    if(db.toggles.mod !== false){
                        if(db.channels.log.mod !== ""){
                            let logs = guild.channels.get(db.channels.log.mod)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }else
                        if(db.channels.log.all !== ""){
                            let logs = guild.channels.get(db.channels.log.all)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }
                    }
                }
            })
                break;
                case "messages":
            client.db.findOne({guildID: guild.id}, async(err, db) => {
                if(db){
                    if(db.toggles.messages !== false){
                        if(db.channels.log.messages !== ""){
                            let logs = guild.channels.get(db.channels.log.messages)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }else
                        if(db.channels.log.all !== ""){
                            let logs = guild.channels.get(db.channels.log.all)
                            if(logs){
                                if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                                logs.send(embed)
                                }else{
                                    if(compact !== null){logs.send(compact)}
                                }
                            }
                        }
                    }
                }
            })
                break;
                case "joins":
            client.db.findOne({guildID: guild.id}, async(err, db) => {
                if(db){
                   if(db.toggles.joins !== false){
                    if(db.channels.log.joins !== ""){
                        let logs = guild.channels.get(db.channels.log.joins)
                        if(logs){
                            if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                            logs.send(embed)
                            }else{
                                if(compact !== null){logs.send(compact)}
                            }
                        }
                    }else
                    if(db.channels.log.all !== ""){
                        let logs = guild.channels.get(db.channels.log.all)
                        if(logs){
                            if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                            logs.send(embed)
                            }else{
                                if(compact !== null){logs.send(compact)}
                            }
                        }
                    }
                    }
                }
            })
                break;
                case "vclogs":
            client.db.findOne({ guildID: guild.id }, async (err, db) => {
                if (err) log(err)
                if (db) {
                    let channel = db.channels.vclogs;
                    let logs = guild.channels.get(channel);
                    if(logs){
                        if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                        logs.send(embed)
                        }else{
                            if(compact !== null){logs.send(compact)}
                        }
                    }
                }
            })
                break;
                case "actionlog":
                client.db.findOne({ guildID: guild.id }, async (err, db) => {
                if (err) log(err)
                if (db) {
                    let channel = db.channels.action;
                    let logs = guild.channels.get(channel);
                    if(logs){
                        if(logs.permissionsFor(guild.me).has("EMBED_LINKS")){
                        logs.send(embed)
                        }else{
                            if(compact !== null){logs.send(compact)}
                        }
                    }
                }
            })
                break;
            }
        };
        this.load = async function(client, eventdir){
            readdir(`./src/events/${eventdir}`, async (err, files) => {
            if (err) return log(err);
            let events = files.filter(f => f.split(".").pop() === "js");
            if (events.length === 0) return;
            await events.forEach((event, i) => {
                let props = require(`../events/${eventdir}/${event}`);
                if(props){
                    try{
                        let et = new props(client);
                        if(et.enabled === false) return;
                        client.on(et.name, async (...args) => et.run(client, ...args));
                        return;
                        }catch(e){
                            console.log(`Error while trying to load file: ${event}`)
                        }
                }
            });
        })
        };
        this.API = async function(type){
            if(config.apis.api === "") return null;
            let {body} = await get(config.apis.api);
            if(!body) return null
            let boop;
            switch(type.toLowerCase()){
                case "photos":
                boop = body.images
                break;
                case "breed":
                boop = body.breeds;
                break;
                case "ball":
                boop = body.ball;
                break;
                case "facts":
                boop = body.facts;
                break;
                case "hugs":
                boop = body.hugs
                break;
                case "times": 
                boop = body.times;
                break;
                case "translate":
                boop = body.translate
                break;
            };
            return boop
        };
        this.hooks = async function(type, embed){
            switch (type.toLowerCase()){
            case "log":
            this.webhook(config.webhooks.log, embed)
            break;
            case "error":
            this.webhook(config.webhooks.error, embed)
            break;
            case "servers":
            this.webhook(config.webhooks.servers, embed)
            break;
            case "action":
            this.webhook(config.webhooks.action, embed)
            break;
            case "shard":
            this.webhook(config.webhooks.shard, embed)
            break;
            case "cmds":
            this.webhook(config.webhooks.cmds, embed)
            break;
            }
        };
        this.webhook = async function(url, embed){
            if(!embed || embed === null || embed === undefined) return `[Webhook Function] - Error, you need to provide content or an embed!` 
            let link = await url.replace('https://discordapp.com/api/webhooks/', '').split("/")
            let hook = new WebhookClient(link[0], link[1]);
            return hook.send(embed).catch(o_O => {console.log(`Can't send a message through: ${url}`)})
        };
        this.dms = async function(client, msg){
                    if(msg.channel.type === "dm"){
                        if(msg.command === null){
                            if(config.webhooks.dms === "") return;
                            let attachments = [];
                            let text = [];
                            let i = 0;
                            await msg.attachments.forEach(c => {i++;text.push(`${i}. [Attachment](${c.proxyURL})`); attachments.push(c.proxyURL)});
                            let e = new MessageEmbed()
                            .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL())
                            .setFooter(`Client: ${client.user.tag} (${client.user.id})`, client.user.displayAvatarURL())
                            .setTitle(`New DM`)
                            .setColor(client.util.colors.cyan)
                            if(attachments.length !== 0){
                                e.setDescription(text.join('\n'))
                                try{e.setImage(attachments[0])}catch(e){}
                                if(msg.content.length !== 0) e.addField(`Content`, msg.content)
                                }else{
                                e.setDescription(msg.content)
                                }
                            this.webhook(config.webhooks.dms, e)
                        }
            }
        };
        this.shards = async function(client, id, event, color, footer, error){
            let e = new MessageEmbed()
            .setTimestamp()
            .setTitle(`Shard ${id}: ${event}`)
            .setColor(color)
            if(footer !== null) e.setFooter(`${footer}`)
            client.f.hooks('shard', e)
            console.log(`[Shard] - ID: ${id} (${event})${error === null ? "" : ` Error - ${error}`}`)
        };
        this.process = async function(event, error){
            if(error.stack.includes("DiscordAPIError: Unknown Message")) return;
            console.log(`${event}: \n${error.stack}`);
            const e = new MessageEmbed()
            .setColor(colors.default)
            .setTimestamp()
            .setDescription(`\`\`\`js\n${await config.rexexp(error.stack)}\`\`\``)
            .setTitle(event)
            this.hooks('error', e)
        };
        this.commandError = async function(client, cmd, message, error, args){
            console.log(`[Command "${cmd.name}" Error] - ${client.config.rexexp(error.stack)}`);
            let embed = new MessageEmbed()
            .setAuthor(`${message.guild ? `Server: ${message.guild.name} (${message.guild.id})` : `DM: @${message.author.tag} (${message.author.id})`}`, message.guild ? message.guild.iconURL() : message.author.displayAvatarURL())
            .setTitle(`Command "${cmd.name}"  **Error**`)
            .setFooter(`Reported At`)
            .setDescription(`\`\`\`js\n${client.config.rexexp(error.stack)}\`\`\``)
            .setTimestamp()
            .setColor(client.util.colors.default)
            message.guild ? embed.addField(`Server`, `${message.guild.name} (${message.guild.id}) [Shard: ${message.guild.shardID}]`) : embed.addField(`DM`, `@${message.author.tag} (${message.author.id})`)
            message.channel.type === "text" ? embed.addField(`Channel`, `${message.channel.name} (${message.channel.id})`) : null
            embed.addField(`User`, `${message.author} \`@${message.author.tag}\` (${message.author.id})`)
            args ? embed.addField(`Args`, require('util').inspect(args, {depth: 1})) : null;
            
            this.hooks('error', embed)
        };

    }
}
module.exports = new Functions();