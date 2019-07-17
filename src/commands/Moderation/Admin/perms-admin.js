const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "adminperm",
            memberName: "adminperm",
            aliases: [],
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            examples: [`${client.commandPrefix}adminperm <Role Name/ID here>`],
            description: "Gives Admin permissions to the role for the command you run the command in. ",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'role',
                    prompt: `Please provide a role to give Admin Permissions in this channel?.`,
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
        message.channel.overwritePermissions(role.id, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true,
            MANAGE_MESSAGES: true,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            ADD_REACTIONS: true,
            MANAGE_CHANNELS: true,
            CREATE_INSTANT_INVITE: true,
            MENTION_EVERYONE: true,
            READ_MESSAGE_HISTORY: true,
            USE_EXTERNAL_EMOJIS: true,
            SEND_TTS_MESSAGES: true,
            MANAGE_WEBHOOKS: true,
            MANAGE_ROLES_OR_PERMISSIONS: true

        }, [`Reason\n${message.author.tag} Has Given Admin Permissions to ${role.name} In ${message.channel.name}`]);
        message.react(this.client.util.emojis.sreact)
    } catch (e) {
        this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
    }
    }
}