const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildMemberAdd",
            enabled: true
        })
    }
    async run(client, member){
        if(await client.m(client) === true) return;
        try{
            let {id, tag, username, createdAt} = member.user;
            let e = new MessageEmbed()
            .setColor(client.util.colors.green)
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor(member.guild.name, member.guild.iconURL())
            .setTitle(`Member Joined${client.isOwner(id) ? " - 🛡 Bot Developer" : ""}`)
            .setDescription(`${member} \`@${tag}\` (${id})`)
            .addField('\u200b', `
            **Member Count: **${member.guild.memberCount}
            **Created At: **${moment(createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
            ${/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(username) ? "**Invite Detected**" : ""}
            `)
            
            await client.warns.findOne({guildID: member.guild.id}, async (err, db) => {
                if(db){
                    let warns = [];
                    await db.warnings.forEach(w => {
                    if(w.id === member.id){
                        warns.push(true)
                    }
                    });
                    if(warns.length !== 0){
                        e.addField(`Note`, `This user has ${warns.length} warning${warns.length === 1 ? "" : "s"}.`, false)
                    }
                }
            })
            client.f.logging(client, "joins", member.guild, e, `:white_check_mark: Member Joined: @${member.user.tag} (${member.user.id}) [Member Count: ${member.guild.memberCount}]`)
            client.u.findOne({userID: member.user.id}, async (err, db) => {
            let dev = await client.dev.findOne({clientID: client.user.id}, async (err, db) => {db});
            if(dev.misc.users.includes(member.user.id) === true) return;
                if(!db){
                    let newdb = new client.u({
                        userTag: member.user.tag,
                        userID: member.user.id,
                        reps: 0,
                        hearts: 0,
                        custom: {
                        image: "",
                        desc: "",
                        
                        },
                        afk: {en: false, message: ""}
                    });
                    newdb.save().catch(err => console.log(err));
                }
            })
            client.db.findOne({guildID: member.guild.id}, async (err, db) => {
                if(db){
                    if(db.welcome.role !== ""){
                        let role = member.guild.roles.get(db.welcome.role);
                        if(!role) return;
                        if(member.guild.me.hasPermission("MANAGE_ROLES")){try{member.roles.add(role.id)}catch(e){}}
                    }
                    if(db.welcome.channel !== ''){
                        let channel = member.guild.channels.get(db.welcome.channel);
                        if(!channel) return;
                        let msg = await db.welcome.msg ? db.welcome.msg.replace("{user}", member.user.username).replace("{mention}", member).replace("{server}", member.guild.name).replace("{mc}", member.guild.memberCount) : `Welcome ${member} to ${member.guild.name}!`;
                        if(db.welcome.embed === true){
                        let e = new MessageEmbed()
                        .setAuthor(member.user.tag, member.user.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(msg)
                        .setColor(`#FF000`)
                        return channel.send(e).catch(o_O => {})
                        }else{
                        return channel.send(db.welcome.msg ? db.welcome.msg.replace("{user}", member.user.username).replace('{mention}', member).replace("{server}", member.guild.name).replace("{mc}", member.guild.memberCount) : `Welcome **${member.user.username}** to ${member.guild.name}!`).catch(o_O => {})
                        }
                    }
                }
            });
            }catch(e){
                client.f.event(client, "Member Add", e.stack, member.guild)
            }
    }
}