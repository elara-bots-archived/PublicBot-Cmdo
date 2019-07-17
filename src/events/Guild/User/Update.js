const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), {get} = require('superagent');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "userUpdate",
            enabled: true
        })
    }
    async run(client, o, n){
        try{
            if(o.username === n.username && o.discriminator === n.discriminator && o.displayAvatarURL() === n.displayAvatarURL() || await client.m(client) === true || n.bot) return;
            client.guilds.forEach(async g => {
                let bl = ["264445053596991498", "343572980351107077"]
                if(bl.includes(g.id)) return;
                if(g.members.get(n.id)){
                    let e = new MessageEmbed()
                    .setAuthor(g.name, g.iconURL())
                    .setColor(client.util.colors.cyan)
                    .setTimestamp()
                    .setTitle(`User Update`)
                    .setDescription(`${n} \`@${n.tag}\` (${n.id})`);
                    let e2 = new MessageEmbed().setTitle(`After`)
                    .setColor(client.util.colors.cyan)
                    .setTimestamp()
                    if(o.username !== n.username) e.addField(`Username`, `**Old: **${o.username}\n**New: **${n.username}`)
                    if(o.discriminator !== n.discriminator) e.addField(`Discriminator`, `**Old: **${o.discriminator}\n**New: **${n.discriminator}`)
                    if(o.displayAvatarURL() !== n.displayAvatarURL()){
                    e.addField(`Avatar`, `**Old: **[Link](${o.displayAvatarURL()})\n**New:** [Link](${n.displayAvatarURL()})`)
                        if(o.displayAvatarURL().includes('assets')){
                            e.setImage(o.displayAvatarURL())
                        }else{
                            let avatar;
                            avatar = `http://media.discordapp.net/avatars/${o.id}/${o.avatar}${o.displayAvatarURL().includes('.gif') ? ".gif" : ".png"}?size=2048`
                            try {
                                let body = await get(avatar);
                                avatar = body.request.url
                            } catch (e) {
                                avatar = `http://www.kalahandi.info/wp-content/uploads/2016/05/sorry-image-not-available.png`
                            }
                            e.setImage(avatar)
                        }
                        if(n.displayAvatarURL().includes('assets')){
                            e2.setImage(n.displayAvatarURL())
                        }else{
                            let avatar;
                            avatar = `http://media.discordapp.net/avatars/${n.id}/${n.avatar}${n.displayAvatarURL().includes('.gif') ? ".gif" : ".png"}?size=2048`
                            try {
                                let body = await get(avatar);
                                avatar = body.request.url
                            } catch (e) {
                                avatar = `http://www.kalahandi.info/wp-content/uploads/2016/05/sorry-image-not-available.png`
                            }
                            e2.setImage(avatar)
                        }
                        setTimeout(async () => {  client.f.logging(client, 'user', g, e2, null)}, 2000)
                    }
                setTimeout(async () => { client.f.logging(client, 'user', g, e, `👤 User Update: \`@${n.tag}\` (${n.id})\n${n.displayAvatarURL() !== o.displayAvatarURL() ? `**__Avatar__**\n**Old: **${o.displayAvatarURL().replace('.webp', ".png")}\n**New: **${n.displayAvatarURL().replace('.webp', ".png")}` : ""}\n${n.username !== o.username ? `**__Username__**\n**Old: **${o.username}\n**New: **${n.username}` : ""}\n${n.discriminator !== o.discriminator ? `**__Discriminator__**\n**Old: **${o.discriminator}\n**New: **${n.discriminator}` : ""}`)}, 1000)
                }
            })
        }catch(e){
            client.f.logger(client, "User Update", e.stack)
        }
    }
}