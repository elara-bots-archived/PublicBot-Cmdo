const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "unblock",
            memberName: "unblock",
            aliases: ["ubl", `unbl`],
            group: "mod",
            guildOnly: true,
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            examples: [`${client.commandPrefix}unblock <username/mention/userid>`],
            description: "Gives the send messages permission for the user you give.",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'member',
                    prompt: `Please provide a member to blacklist from this channel.`,
                    type: 'member'
                }
            ]
        })
    }
    async run(message, { member }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try {
            if (message.author.id === member.id) return message.channel.send(`You can't unblock yourself from using this channel.`).then(m => m.delete(10000).catch())
            message.delete(15000).catch()
            message.channel.overwritePermissions(member.id, { SEND_MESSAGES: null }, `${message.author.tag} Has unblacklisted ${member.user.tag} From ${message.channel.name}`);
            const lockembed = new Discord.MessageEmbed()
                .setColor(message.guild.color)
                .setDescription(`${message.author} unblocked ${member} from using this channel.`)
                .setFooter(`This message will be deleted in 15 seconds..`)
            message.channel.send(lockembed).then(message => {
                message.delete(15000).catch()
            })
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}