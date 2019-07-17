const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class LockDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "modperm",
            memberName: "modperm",
            aliases: [],
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            examples: [`${client.commandPrefix}modperm @role/roleid/name`],
            clientPermissions: ["MANAGE_ROLES"],
            description: "Gives the role you provide Moderator permissions in the channel.",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'role',
                    prompt: `Please provide a role to give Moderator permissions in this channel.`,
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
            MANAGE_CHANNELS: false,
            CREATE_INSTANT_INVITE: true,
            MENTION_EVERYONE: false,
            READ_MESSAGE_HISTORY: true,
            USE_EXTERNAL_EMOJIS: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_WEBHOOKS: false,
            MANAGE_ROLES_OR_PERMISSIONS: false

        }, [`Reason\n${message.author.tag} Has Given Mod Permissions to ${role.name} In ${message.channel.name}`]);
        message.react(this.client.util.emojis.sreact)
        } catch (e) {
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}