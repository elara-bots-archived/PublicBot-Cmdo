const {Command} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
const {get} = require("superagent");
const {apis: {dbl}} = require("../../../util/config")
module.exports = class DBLCommand extends Command{
    constructor(client){
        super(client,{
            name: "dbl",
            memberName: "dbl",
            aliases: ["dbots"],
            group: "docs",
            examples: [`${client.commandPrefix}dbl @user/bot`],
            description: "Gets the information on the bot or user.",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'bot',
                    prompt: 'What user or bot do you want to get the info on?.',
                    type: 'user'
                }
            ]
        })
    }
    async run(message, {bot}) {
        if(this.client.config.apis.dbl === "") return message.channel.send(`Command Disabled, no DBL API key provided!`);
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
        let {body} = await get(`https://discordbots.org/api/${bot.bot ? "bots" : "users"}/${bot.id}`).set(`Authorization`, dbl);
        let e = new MessageEmbed()
        .setAuthor(`Information on ${bot.tag}`, bot.displayAvatarURL())
        .setColor(message.guild ? message.member.displayColor : message.guild.color)
        .setDescription(`${bot} \`@${bot.tag}\` (${bot.id})`)
        let msg = await message.channel.send(`Loading....`);
        if(bot.bot === true){
            let {shortdesc, prefix, server_count, shards, monthlyPoints, points, lib, tags, owners, certifiedBot} = body;
            e.addField(`Description`, shortdesc, false)
            .setThumbnail(bot.displayAvatarURL())
            .addField(`Bot Info`, `
            **Prefix: **${prefix || "? Unknown"}
            **Server Size: **${server_count || "0"}
            **Shard Size: **${shards.length || "0"}
            **Monthly Upvotes: **${monthlyPoints || "0"}
            **Total Upvotes: **${points || "0"}
            **Library: **${lib || "? Unknown"}
            **Certified Bot: **${certifiedBot ? "Yes" : "No"}`, false)
            if(tags.length !== 0) e.addField(`Tag${tags.length === 1 ? "": "s"}`, tags.join(', '), false)
            if(owners.map(c => c).length !== 0) e.addField(`Owner${owners.map(c => c).length === 1 ? "" : "s"}`, owners.map(c => `<@${c}> (${c})`).join('\n'));
            e.addField(`Links`, `
            [DBL](https://discordbots.org/bot/${body.id})
            [Invite](${body.invite})${body.support ? `\n[Support Server](https://discord.gg/${body.support})` : ''}${body.github ? `\n[Github](${body.github})` : ''}${body.website ? `\n[Website](${body.website})` : ''}
            `)
            return msg.edit(e)
        } else{
                let {admin, webMod, mod, certifiedDev, supporter, social} = body
                e.addField(`DBL Info`, `
                **Admin: **${admin ? "Yes" : "No"}
                **Website Moderator: **${webMod ? "Yes" : "No"}
                **Discord Moderator: **${mod ? "Yes" : "No"}
                **Certified Developer: **${certifiedDev ? "Yes" : "No"}
                **Supporter: **${supporter ? "Yes" : "No"}
                ${body.bio ? `\n**Bio: **${body.bio}` : ""}${body.color ? `\n**Color: **${body.color}` : ""}${social.youtube ? `\n[YouTube](https://www.youtube.com/channel/${social.youtube})` : ""}${social.twitter ? `\n[Twitter](https://www.twitter.com/${social.twitter})` : ""}${social.reddit ?`\n[Reddit](https://www.reddit.com/user/${social.reddit})` : ""}${social.imstagram ? `\n[Instagram](https://www.instagram.com/${social.instagram})` : ""}${social.github  ? `\n[Github](https://www.github.com/${social.github})` : ""}
                `)
                if(body.banner !== undefined) e.setImage(body.banner)
               return msg.edit(e)
            }
        } catch (e) {
            if (!e.stack.includes('Error: Not Found')){
                this.client.error(this.client, message, e);
                this.client.f.logger(this.client, message, e.stack)
            }
            this.client.error(this.client, message, `${bot} isn't on https://discordbots.org`)
        }
    }
}