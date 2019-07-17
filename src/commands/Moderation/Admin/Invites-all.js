const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "allinvites",
            memberName: "allinvites",
            aliases: ['allinvite'],
            examples: [`${client.commandPrefix}allinvites`],
            description: "Shows you all of the invites for the server!",
            group: "server",
            clientPermissions: ["MANAGE_GUILD"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(message.guild.color)
        .setTitle(`Loading..`)
        let msg = await message.channel.send(e);
        let invites = []
        await message.guild.fetchInvites().then(m => m.forEach(c => invites.push({code: c.code, inviter: c.inviter, uses: c.uses, channel: c.channel})));
        if(invites.length === 0){
            e.setTitle(`INFO`)
            .setColor(`#FF0000`)
            .setDescription(`This server has no invites....`)
            return msg.edit(e)
        }
        let eh = [];
        await invites.forEach(c => {
            eh.push(`
            Channel: #${c.channel.name}
            Code: ${c.code}
            Uses: ${c.uses}
            Inviter: @${c.inviter.tag} (${c.inviter.id})
            `)
        })
        if(eh.join('\n').length >= 2040){
            let link = await this.client.f.bin("Server Invites", eh.join('\n'))
            e.setDescription(link)
            .setTitle(`Invites`)
            return msg.edit(e)
        }else{
        e.setDescription(eh.join('\n'))
        .setTitle(`Invites`)
        return msg.edit(e)
        }
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}