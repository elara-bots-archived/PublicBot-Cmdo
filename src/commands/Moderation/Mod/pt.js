const { Command } = require('elaracmdo');

module.exports = class CleanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pt',
            aliases: [`prunetext`],
            group: 'mod',
            memberName: 'pt',
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            description: 'Deletes text only, *useful for photos channels.*',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
        });
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        message.delete(100).catch()
        const messagesToDelete = await message.channel.messages.fetch({ limit: 100 }).catch(err => null);
        let msgs = messagesToDelete.filter(message => message.content && message.attachments.map(c => c).length < 1 && message.pinned === false && !message.embeds.size !== 0)
        message.channel.bulkDelete(msgs.array().reverse()).catch(err => null)

        return null;

        
        } catch (e) {
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
        }
    }
};
