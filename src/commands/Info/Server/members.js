const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const request = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "members",
            memberName: "members",
            aliases: ["listmembers"],
            examples: [`${client.commandPrefix}members <role name/id>`],
            description: "Gives you all of the members in that role.",
            group: "server",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [

                {
                    key: 'role',
                    prompt: 'Please Provide the role.',
                    type: 'role'
                }
            ]
        })
    }
    async run(message, { role }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
            if(role.members.size === 0) return this.client.error(this.client, message, `No one has ${role.name}`)
            if(role.members.size >= 51) return this.client.f.embed(this.client, message, `[${role.members.size}] Members in role: ${role.name}`, await this.client.f.bin(`Members in role ${role.name}`, role.members.map(c => `${c.user.username} [${c.user.tag}] (${c.user.id})`).join('\n')))
            if(role.members.size <= 50){
                let data = [];
                role.members.forEach(m => {data.push(m)});
                let e = new Discord.MessageEmbed()
                .setColor(message.guild.color)
                .setTitle(`[${role.members.size}] Members in ${role.name}`)
                .setDescription(data.join('\n'))
                return message.channel.send(e)
        }
        
        
        }catch(e){
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}