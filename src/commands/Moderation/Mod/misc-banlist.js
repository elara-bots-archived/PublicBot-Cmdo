const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "banlist",
            memberName: "banlist",
            aliases: [],
            examples: [`${client.commandPrefix}banlist`],
            description: "Gives you a list of the current bans in the server.",
            group: "mod",
            guildOnly: true,
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
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
        ;
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(message.guild.color)
        .setTitle(`Loading...`)
        let msg = await message.channel.send(e);
        let bans = await message.guild.fetchBans();
        let data = [], deleted = [];
        await bans.forEach(c => {
        if(c.user.username.includes("Deleted User")){
            deleted.push(true)
        }
        data.push(`${c.user.tag} (${c.user.id})`);
        });
        
        if(data.length === 0){
            e.setTitle(`No bans on this server!`).setColor(this.client.util.colors.red)
            return msg.edit(e)
        }
        e.addField(`${deleted.length} of ${data} is deleted users.`)
        if(data.join(' ').length <= 2047){
            e.setTitle(`Ban List`)
            .setDescription(data.join('\n'))
            return msg.edit(e)
        }else{
            let link = await this.client.f.bin('Guild Bans', data.join('\n'))
            e.setTitle(`Ban List`).setDescription(link)
            return msg.edit(e)
        }
        }catch(e){
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}