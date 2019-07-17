const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "guildUpdate",
            enabled: true
        })
    }
    async run(client, og, g){
        try{
            if(g.available === false) return;
            let e = new MessageEmbed()
            .setTitle(`Server Update`)
            .setAuthor(g.name, g.iconURL())
            .setColor(client.util.colors.default)
            .setDescription(`${g.name} (${g.id})`)
            if(og.name !== g.name) e.addField(`Name`, `**Old: **${og.name}\n**New: **${g.name}`)
            if(og.iconURL() !== g.iconURL()) e.addField(`Icon`, `**Old: **${og.iconURL()}\n**New: **${g.iconURL()}`);
            if(og.splashURL() !== g.splashURL()) e.addField(`Splash`, `**Old: **${og.splashURL() ? og.splashURL() :"None"}\n**New: **${g.splashURL() ? g.splashURL() : "None"}`);
            if(og.verificationLevel !== g.verificationLevel) e.addField(`Verification Level`, `**Old: **${client.util.verifLevels[og.verificationLevel]}\n**New: **${client.util.verifLevels[g.verificationLevel]}`)
            if(og.region !== g.region) e.addField(`Region`, `**Old: **${client.util.region[og.region]}\n**New: **${client.util.region[g.region]}`)
            if(og.systemChannelID !== g.systemChannelID) e.addField(`System Channel`, `**Old: **${og.systemChannel ? `${og.systemChannel} (${og.systemChannelID})` :"None"}\n**New: **${g.systemChannel ? `${g.systemChannel} (${g.systemChannelID})` :"None"}`)
            if(og.afkChannelID !== g.afkChannelID) e.addField(`AFK Channel`, `**Old: **${og.afkChannelID ? `<#${og.afkChannelID}>`: "None"}\n**New: **${g.afkChannelID ? `<#${g.afkChannelID}>`: "None"}`)
            if(og.afkTimeout !== g.afkTimeout){
                let times = {
                    "60": "1 Minute",
                    "300": "5 Minutes",
                    "900": "15 Minutes",
                    "1800": "30 Minutes",
                    "3600": "1 Hour"
                }
                e.addField(`AFK Timeout`, `**Old: **${times[og.afkTimeout]}\n**New: **${times[g.afkTimeout]}`)
            }
            if(og.premiumTier !== g.premiumTier){
                let types = {
                    0: "No Tier",
                    1: "Tier 1",
                    2: "Tier 2",
                    3: "Tier 3"
                }
                e.addField(`Premium Tier`, `**Old: **${types[og.premiumTier]}\n**New: **${types[g.premiumTier]}`)
            }
            if(og.vanityURLCode !== g.vanityURLCode) e.addField(`Vanity URL`, `**Old: **${og.vanityURLCode ? og.vanityURLCode : "None"}\n**New: **${g.vanityURLCode ? g.vanityURLCode : "None"}`)
            if(e.fields.length === 0) return;
            if(og.premiumTier === g.premiumTier && og.afkTimeout === g.afkTimeout && og.afkChannelID === g.afkChannelID && og.systemChannelID === g.systemChannelID && og.region === g.region && og.verificationLevel === g.verificationLevel && og.splashURL === g.splashURL && og.iconURL() === g.iconURL() && og.name === g.name && og.vanityURLCode === g.vanityURLCode) return;
            let mod = [];
            if(g.me.hasPermission('VIEW_AUDIT_LOG')){
            let a = await client.f.audit(g, "GUILD_UPDATE");
            if(a !== undefined){
            mod.push(` - Updated By: \`@${a.executor.tag}\` (${a.executor.id})`)
            e.setFooter(`Updated By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
            }else{
                e.setFooter(`Updated By: ? Unknown`)
            }
            }else{
            e.setFooter(`Updated By: ? Unknown, I can't view audit logs`);
            }
            client.f.logging(client, "server", og, e, `🛡 Server Update: ${g.name} (${g.id})${mod.length !== 0 ? mod[0] : ""}\n${e.fields.map(c => `**__${c.name}__**\n${c.value}`).join('\n\n')}`)
        }catch(e){
            client.f.event(client, "Guild Update", e.stack, g)
        }
    }
}