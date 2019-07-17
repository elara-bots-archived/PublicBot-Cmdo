const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "react",
            memberName: "react",
            aliases: [`reactlast`],
            userPermissions: ["MANAGE_MESSAGES"],
            examples: [`${client.commandPrefix}react <emoji ID/Name Here>`],
            description: "Reacts to the last message you have sent.",
            clientPermissions: [`USE_EXTERNAL_EMOJIS`],
            group: "mod",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'emoji',
                    prompt: `What emoji do you want me to react with? [\`${client.commandPrefix}react <emoji ID/Name here>\`]`,
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { emoji }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        

      try{ 
          let emojimention = emoji.replace("<", "").replace('>', '').replace(':', '').replace(':', '').replace(/\d+/, "");
          if (emojimention.startsWith("a")) emojimention = emojimention.replace('a', '')
          let emoji1 = this.client.emojis.find(e => e.name === emoji || e.name === emojimention) || this.client.emojis.find(e => e.id === emoji)
          if(!emoji1) return message.say(`I can't use that emoji! \`${this.client.commandPrefix}react emoji\``)
         message.channel.messages.fetch({ limit: 2 })
            .then(messages => {
                let msg = messages.filter(c => c.author.id === message.author.id)
                msg.last().react(emoji1.id);
                message.delete().catch();
            })
        } catch(e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
         }
    }
}