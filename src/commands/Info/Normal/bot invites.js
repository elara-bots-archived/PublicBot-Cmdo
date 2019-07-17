const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bot",
            memberName: "bot",
            aliases: [],
            examples: [`${client.commandPrefix}bot <bot id here> <Permissions>`],
            description: "Gives you a invite for the bot id you provide.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Please provide the bot id.',
                    type: 'user'
                }
            ]
        })
    }
    async run(message, { user, }) {
      if(await this.client.b(this.client, message) === true) return;
      if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
      if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(user.bot === false) return message.channel.send(`That is a user not a bot!`)
        let links = [
          `[All Permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=2137517567&scope=bot)`,
          `[Administrator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)`,
          `[Moderator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=1543892167&scope=bot)`,
          `[Normal Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=67488833&scope=bot)`,
          `[No Permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot)`
      ]
      let e = new Discord.MessageEmbed()
      .setColor(message.guild.color)
      .setAuthor(user.tag, user.displayAvatarURL())
      .setTitle("Invite Links")
      .setDescription(links.join('\n'))
      return message.channel.send(e)
    }catch(e){
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack);
    }
    }
}
