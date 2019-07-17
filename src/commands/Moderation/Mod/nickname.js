const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "nick",
            memberName: "nick",
            aliases: ["nickname", "setnick"],
            examples: [`${client.commandPrefix}nick @user <new nickname here>`],
            description: "Sets the nickname for the member you provide",
            group: "mod",
            guildOnly: true,
            userPermissions: ["MANAGE_NICKNAMES"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "member",
                    prompt: "what member do you want me to change the nickname of?",
                    type: "member"
                },
                {
                    key: 'content',
                    prompt: 'What nickname do you want to set for that member?',
                    type: 'string',
                    min: 1,
                    max: 32
                }
            ]
        })
    }
    async run(message, { member, content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
try{
    if(member.id === message.guild.ownerID) return this.client.error(this.client, message, `I can't change the server owners nickname.`);
    if(message.guild.me.roles.highest.position < member.roles.highest.position)return this.client.error(this.client, message, `I don't have a role high enough to change that members nickname`)
    member.setNickname(content).catch(e =>{this.client.error(this.client, message, e)})
    return await this.client.f.embed(this.client, message, "Success", `${this.client.util.emojis.semoji} ${member.user.username}'s nickname has been changed to ${content}`)
    }catch(e){
    this.client.error(this.client, message, e);
    this.client.f.logger(this.client, message, e.stack)
    }
}
}