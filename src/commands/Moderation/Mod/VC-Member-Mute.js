const { Command } = require('elaracmdo'),
    ms = require('ms'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vcmute",
            memberName: "vcmute",
            aliases: ["vcm"],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}vcmute @user/userid `],
            description: "Mutes the user in voice chat.",
            guildOnly: true,
            group: "mod",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "What member do you want me to server mute?",
                    type: "member"
                }
            ]
        })
    }
    async run(message, {member}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let vc = member.voice.channel
        if(!vc) return message.channel.send(`That member isn't in voice chat.`);
        if(vc.permissionsFor(message.guild.me).has("MUTE_MEMBERS")){
        if(member.voice.serverMute === false){
        member.voice.setMute(true, `Server Muted by: ${message.author.tag} (${message.author.id})`)
        return message.channel.send(`Alright, I Server muted ${member.user.tag} in ${vc}`)
        }else{
            member.voice.setMute(false, `Unserver muted by: ${message.author.tag} (${message.author.id})`)
            return message.channel.send(`Alright, I unserver muted ${member.user.tag} in ${vc}`)
        }
        }else{
            return message.channel.send(`I don't have the permission to mute the user in ${vc}`)
        }
    } catch (e) {
        this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}