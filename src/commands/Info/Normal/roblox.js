const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const superagent = require('superagent');
const {get} = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "roblox",
            memberName: "roblox",
            aliases: [`robloxprofile`, "rblx"],
            examples: [`${client.commandPrefix}roblox @user/userid`],
            description: "Gets their roblox Profile if they are verified with the discord bot RoVer",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'What member do you want me to check out?',
                    type: 'user',
                    default: message => message.author
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
    if(user.bot) return message.channel.send(`Bot's can't have roblox accounts.`)
       try{
        let RoVer = await get(`https://verify.eryn.io/api/user/${user.id}`);
        let Rblx; 
        if(RoVer.body.status === "ok") Rblx = await get(`https://api.roblox.com/users/${RoVer.body.robloxId}`)
        if(RoVer.body.status === "error") Rblx = null;
        if(Rblx !== null){
            let e = new Discord.MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`
            **Username: **${Rblx.body.Username}
            **ID: **${Rblx.body.Id}
            **Profile: **https://www.roblox.com/users/${Rblx.body.Id}/profile
            `)
            .setTitle(`Roblox Info`)
            .setThumbnail(`https://assetgame.roblox.com/Thumbs/Avatar.ashx?username=${encodeURIComponent(Rblx.body.Username)}`)
            message.channel.send(e)
        }
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}