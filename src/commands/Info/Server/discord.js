const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "discord",
            memberName: "discord",
            aliases: [],
            examples: [`${client.commandPrefix}discord`],
            description: "Gives you a discord invite for the discord.",
            group: "server",
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
        let e = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL(), this.client.options.invite).setColor(message.guild.color);
        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES" && "EMBED_LINKS" && "READ_MESSAGES" && "CREATE_INSTANT_INVITE")) {return this.client.error(this.client, message, `I don't have the "Create Instant Invite" permission in this channel.`)}else{
        if(await message.guild.me.hasPermission("MANAGE_GUILD")){
            let invites = await message.guild.fetchInvites();
            if(invites.map(c => c).length === 0){
            let invite = await message.channel.createInvite({maxAge: 0, reason: `Created for: ${message.author.tag} (${message.author.id})`})
            e.setDescription(`https://discord.gg/${invite.code}`); 
            return message.channel.send(e)
            }else{
            let invite = invites.first()
            e.setDescription(`https://discord.gg/${invite.code}`); 
            return message.channel.send(e)
            }
        }else{
            let invite = await message.channel.createInvite({maxAge: 0, reason: `Created for: ${message.author.tag} (${message.author.id})`});
            e.setDescription(`https://discord.gg/${invite.code}`); 
            return message.channel.send(e)
        }
        }
        }catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }    
}