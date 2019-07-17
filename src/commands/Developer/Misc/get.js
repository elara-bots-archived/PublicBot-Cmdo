const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "get",
            memberName: "get",
            aliases: [],
            examples: [`${client.commandPrefix}get @user/userid/username`],
            description: "Gets the information for the user, server, server-config or invite for the server",
            ownerOnly: true,
            hidden: true,
            group: "owner",
            args: [
                {
                    key: 'content',
                    prompt: 'What is the id you want me to check out?',
                    type: 'string'
                },
                {
                    key: "type",
                    prompt: "What type: [user, server, config]",
                    type: "string",
                    parse: str => str.toLowerCase()
                }
            ]
        })
    }
    async run(message, {content, type}) {
        try{
        let e = new Discord.MessageEmbed()
        .setTitle(`Loading..`)
        .setTimestamp().setColor(message.member.displayColor)
        let m = await message.channel.send(e)
        let emb = new Discord.MessageEmbed().setTitle(`ERROR`).setColor(`#FF0000`);
        switch(type){
    case "server":
    let guild = this.client.guilds.get(content);
    if(!guild) return m.edit(emb.setDescription(`I ain't in that server!`))
    e.setAuthor(guild.owner.user.tag, guild.owner.user.displayAvatarURL())
    .setColor(message.guild ? message.member.displayColor : message.guild.color)
    .setThumbnail(guild.iconURL())
    .setDescription(`
    **Name: **${guild.name}
    **ID: **${guild.id}
    **Icon: **${guild.iconURL() ? `[Click Here](${guild.iconURL()})` : "None"}
    **Member Count: **
     -Total Members: ${guild.memberCount}
     -Bots: ${guild.members.filter(c => c.user.bot).size}
     -Humans: ${guild.members.filter(c => !c.user.bot).size}
    **Role Count: **${guild.roles.size}
    **Emoji Count: **${guild.emojis.size}
    **Channel Count: **${guild.channels.size}
    **Owner: **\n${guild.owner.user}\n\`@${guild.owner.user.tag}\`\n(${guild.owner.user.id})
    `)
    .setTimestamp()
    .setTitle(`Server Information`)
    m.edit(e)
            break;
            case "config":
            let g = this.client.guilds.get(content);
            if(!g) return m.edit(emb.setDescription(`I ain't in that server!`));
            this.client.db.findOne({guildID: g.id}, async (err, db) => {
                if(!db) {
                    return m.edit(emb.setDescription(`That server doesn't have a settings database!`));
                }else{
                    let jobs;
                    let throws;
                    if(db.misc.jobs.length !== 0){
                    jobs = await this.client.f.bin(`${message.guild.name}'s Jobs`, db.misc.jobs.join('\n'));
                    }
                    if(db.misc.throws.length !== 0){
                    throws = await this.client.f.bin(`${message.guild.name}'s Throws`, db.misc.throws.join('\n'));
                    }
                    let c = await g.channels;
                    e.setAuthor(g.name, g.iconURL())
                    .setColor(message.member.displayColor)
                    .setTimestamp()
                    .setTitle(`Server Settings`)
                    .addField(`Misc`, `
                    **Prefix: **${db.prefix ? db.prefix : `Default: ${this.client.commandPrefix}`}
                    **Currency: **${db.misc.currency}
                    ${db.misc.jobs.length === 0 ? "" : `**Jobs: **[Link](${jobs})`}${db.misc.throws.length === 0 ? "" : `\n**Throws: **[Link](${throws})`}`)
                    
                    .addField(`Log Channels`, `
                    **Modlog: **${db.channels.logchannel ? `${c.get(db.channels.logchannel).name} (${c.get(db.channels.logchannel).id})` : "None"}
                    **Action: **${db.channels.action ? `${c.get(db.channels.action).name} (${c.get(db.channels.action).id})` : "None"}
                    **Reports: **${db.channels.reports ? `${c.get(db.channels.reports).name} (${c.get(db.channels.reports).id})` : "None"}
                    **Voice: **${db.channels.vclogs ? `${c.get(db.channels.vclogs).name} (${c.get(db.channels.vclogs).id})` : "None"}`)
        
                    .addField(`Welcome`, `
                    **Role: **${db.welcome.role ? `${g.roles.get(db.welcome.role).name}  (${g.roles.get(db.welcome.role).id})` : "None"}
                    **Channel: **${db.welcome.channel ? `${c.get(db.welcome.channel).name} (${c.get(db.welcome.channel).id})` : "None"}
                    **Message: **${db.welcome.msg ? db.welcome.msg : `Welcome {user} to {server}!`}
                    **Embed: **${db.welcome.embed ? "Enabled" : "Disabled"}`)
        
                    .addField(`Suggestions`, `
                    **Channel: **${db.suggestions.channel ? `${c.get(db.suggestions.channel).name}` : "None"}
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
                    .setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
                    m.edit(e)
                }
            });
            break;
            case "user":
                    const user = await this.client.f.mention(this.client, content);
                    let server = this.client.guilds.filter(c => c.members.get(user.id));
                    let servers = [null];
                    let name = [null];
                    await server.forEach(c =>  {
                    name.push(`${c.name} (${c.id})`);
                    servers.push(`
                    **Nickname: **${c.members.get(user.id).nickname ? c.members.get(user.id).nickname : "None"}
                    **Owner: **${c.ownerID === user.id ? "Yes" : "No"}
                    **Admin: **${c.members.get(user.id).hasPermission("MANAGE_GUILD") ? "Yes" : "No"}
                    **Mod: **${c.members.get(user.id).hasPermission('MANAGE_MESSAGES') ? "Yes" : "No"}
                    **Roles: **${c.members.get(user.id).roles.filter(w => w.id !== c.id).sort((a, b) => b.position - a.position).map(c => c.name).join(" | ") || "None"}`)})
                    e.setTitle(' ').setAuthor(`Info on ${user.tag}${this.client.isOwner(user.id) ? ' - 🛡 Bot Developer' : ''}`, user.displayAvatarURL())
                        .setColor(message.guild ? message.member.displayColor : message.guild.color)
                        .setThumbnail(user.displayAvatarURL())
                        .setDescription(`${user} \`@${user.tag}\` (${user.id})\n**Mutual Servers Count: **${server.size}`)
                    if(servers.length !== 0){
                    let num = 0;
                    servers.splice(1, 26).forEach(s => {num++; e.addField(`${num}. ${name[num]}`, s)})
                }else{
                    e.addField(`Servers`, `None`)
                }
                    m.edit(e)
            break;
            case "invite":
            let ge = await this.client.guilds.get(content);
            if(!ge){
                return m.edit(e.setTitle(`ERROR`).setDescription(`I ain't in that server!`));
            }
            if(ge.me.hasPermission("MANAGE_GUILD")){
                let invites = await ge.fetchInvites();
                if(invites.map(c => c).length === 0){
                let channel = ge.channels.filter(c => c.permissionsFor(c.guild.me).has("CREATE_INSTANT_INVITE") && c.type !== "category").first()
                if(!channel){
                    return m.edit(e.setTitle(`ERROR`).setDescription(`I can't find a channel to create a invite!`));
                }
                let invite = await channel.createInvite({maxAge: 0})
                return m.edit(e.setTitle(`Invite`).setDescription(`https://discord.gg/${invite.code}`))
                }else{
                let invite = invites.first()
                return m.edit(e.setTitle(`Invite`).setDescription(`https://discord.gg/${invite.code}`))
                }
            }else{
            let channel = ge.channels.filter(c => c.permissionsFor(c.guild.me).has("CREATE_INSTANT_INVITE") && c.type !== "category").first()
            if(!channel){
                return m.edit(e.setTitle(`ERROR`).setDescription(`I can't find a channel to create a invite!`));
            }
            let invite = await channel.createInvite({maxAge: 0})
            m.edit(e.setTitle(`Invite`).setDescription(`https://discord.gg/${invite.code}`))
            }
            break;
            default:
            m.edit(emb.setDescription(`You didn't choose [\`invite\`, \`config\`, \`server\`, \`user\`]`))
            break;
        }
    } catch (e) {
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}
