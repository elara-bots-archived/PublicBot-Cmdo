const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class GuildLeave extends Event{
    constructor(client){
        super(client, {
            name: "guildDelete",
            enabled: true
        })
    }
    async run(client, guild){
        if(guild.available === false) return;
        
        try{
            if(guild.memberCount < 5) return console.log(`Left: ${guild.name} | Reason: Doesn't have at least 5 members`)
        let db = await client.dev.findOne({clientID: client.user.id}, async (err, bl) => {bl})
        if(db){
        if(db.misc.servers.includes(guild.id)) return;
        }
        await client.db.findOneAndDelete({ guildID: guild.id }).catch((err) => console.log(err));
        await client.warns.findOne({guildID: guild.id}, async (err, db) => {
            if(db){
                if(db.warnings.length === 0 || db.commands.length !== 0){
                await client.warns.findOneAndDelete({guildID: guild.id}, async (err, db)=>{db});
                }else{
                    let embed = new MessageEmbed()
                    .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL())
                    .setColor(`#FF0000`)
                    .setTimestamp()
                    .setThumbnail(guild.iconURL())
                    .setTitle(`Action: Leave`)
                    .addField(`External DB`, `Make sure to clear the warnings/commands database after a day.`);
                    client.f.hooks('action', embed)
                }
            }
        });
        if(db.logging.server !== "" && client.channels.get(db.logging.server) !== null){
            let {name, iconURL, members, memberCount, id, owner, createdAt} = guild;
            let e2 = new MessageEmbed()
            .setAuthor(`${name} (${id})`, iconURL())
            .setThumbnail(iconURL())
            .setColor(client.util.colors.orange)
            .setFooter(`We now have ${client.guilds.size} servers!`,client.user.displayAvatarURL())
            .setTitle(`[Server] - Left`)
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
        client.f.stats(client, "leave", {name: null, msg: null});
        const e = new MessageEmbed()
            .setColor("#FF0000")
            .setAuthor(`Owner: ${guild.owner.user.tag}`, guild.owner.user.displayAvatarURL())
            .setFooter(`Guild Name: ${guild.name} ID: ${guild.id}`, guild.iconURL())
            .setThumbnail(guild.iconURL() ? guild.iconURL() : guild.owner.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`Server Left${db.misc.servers.includes(guild.id) ? ` - Blacklisted Server` : ""}`)
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
        try{client.f.hooks('servers', e)}catch(e){}
        } catch (e) {
            client.f.event(client, "Guild Delete", e.stack, guild)
        }
    }
}