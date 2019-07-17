const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class RUSERCommand extends Command {
    constructor(client) {
        super(client, {
            name: "randomuser",
            memberName: "randomuser",
            aliases: ["ruser"],
            guildOnly: true,
            group: "server",
            examples: [`${client.commandPrefix}ruser\n${client.commandPrefix}ruser <role name here>`],
            description: "Gets a random user from everyone in the server or from a certain role",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "role",
                    prompt: "What role do you want me to pick a winner from?",
                    type: "role",
                    default: message => message.guild.roles.get(message.guild.id)
                }
            ]
        })
    }
    async run (message, {role}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            let r;
            if(!role.members.size) return this.client.error(this.client, message, `There is 0 users in ${role.name}`);
            if(role.members.size === 1) return this.client.error(this.client, message, `There needs to be more then 1 member in a role.`)
            if(role.id === message.guild.id) r = message.guild.members.map(c => `${c} [${c.user.tag}] (${c.id})`);
            else {r = role.members.map(c => `${c} [${c.user.tag}] (${c.id})`)}
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setTitle(`Winner`)
        .setDescription(await r[Math.floor(Math.random() * r.length)])
        return message.channel.send(e)
        
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}