const {Command} = require('elaracmdo'), Discord = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'channel',
      memberName: 'channel',
      aliases: [],
      examples: [`${client.commandPrefix}channel [#channel] [type] [change]`],
      description: 'Changes the channel you mention, like the topic, name, nsfw, slowmode',
      group: 'admin',
      userPermissions: ["MANAGE_GUILD"],
      args: [
            {
                  key: "channel",
                  type:'channel',
                  prompt: "What channel do you want to change?"
            },
            {
                  key: "change",
                  type: "string",
                  prompt: "What do you want to change... [`name`, `topic`, `nsfw`, `slowmode`]"
            },
            {
                  key: "thing",
                  type: "string",
                  prompt: "What do you want to change it to?"
            }
      ]
})
}
        async run(message, {channel, change, thing}) {
      if(await this.client.b(this.client, message) === true) return;
      if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
      if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
      ;
      if(!channel.permissionsFor(message.guild.me).missing("MANAGE_CHANNELS")){
            return this.client.f.error(this.client, message, `I need \`Manage Channel\` in ${channel} for me to edit it!`)
      }
      let e = new Discord.MessageEmbed().setColor(message.guild.color).setTitle(`Success`).setAuthor(message.guild.name, message.guild.iconURL());
      let msg = await message.channel.send(`Loading..`);
      switch(change.toLowerCase()){
            case "name":
            if(thing.length > 100){
            e.setTitle(`INFO`).setColor(`#FF0000`).setDescription(`The channel name has to be below 100 characters`)
            return msg.edit(e)
            }
            if(thing.length === 0){
            e.setTitle(`INFO`).setColor(`#FF0000`).setDescription(`The channel name has to be above 1 character`);
            return msg.edit(e)
            }
            channel.edit({name: thing})
            e.setDescription(`Channel name changed for: ${channel}`)
            msg.edit(e)
            break;
            case "topic":
            if(thing.length < 1024){
            channel.edit({topic: thing})
            e.setDescription(`The topic has been changed to:\n${thing}`);
            msg.edit(e)
            }else{
            e.setTitle(`ERROR`).setDescription(`The channel topic can't go over 1024 characters!`).setColor(`#FF0000`);
            msg.edit(e)
            }
            break;
            case "nsfw":
            switch(thing.toLowerCase()){
                  case "true":
                  channel.edit({nsfw: true})
                  e.setDescription(`NSFW is now enabled in ${channel}`)
                  msg.edit(e)
                  break;
                  case "false":
                  channel.edit({nsfw: false})
                  e.setDescription(`NSFW is now disabled in ${channel}`)
                  msg.edit(e)
                  break;
                  default:
                  e.setDescription(`You didn't choose \`true\`(Enable) \`false\`(Disable)`).setColor(`#FF0000`).setTitle(`ERROR`)
                  msg.edit(e)
                  break;
            }
            break;
            case "slowmode":
            switch(thing.toLowerCase()){
            case "0":
            channel.edit({rateLimitPerUser: 0})
            e.setDescription(`The slowmode is now: Off`)
            msg.edit(e)
            break;
            case "5":
            channel.edit({rateLimitPerUser: 5})
            e.setDescription(`The slowmode is now: 5 Seconds`)
            msg.edit(e)
            break;
            case "10":
            channel.edit({rateLimitPerUser: 10})
            e.setDescription(`The slowmode is now: 10 Seconds`)
            msg.edit(e)
            break;
            case "30":
            channel.edit({rateLimitPerUser: 30})
            e.setDescription(`The slowmode is now: 30 Seconds`)
            msg.edit(e)
            break;
            case "60":
            channel.edit({rateLimitPerUser: 60})
            e.setDescription(`The slowmode is now: 1 Minute`)
            msg.edit(e)
            break;
            case "120":
            channel.edit({rateLimitPerUser: 120})
            e.setDescription(`The slowmode is now: 2 Minutes`)
            msg.edit(e)
            break;
            case "300":
            channel.edit({rateLimitPerUser: 300})
            e.setDescription(`The slowmode is now: 5 Minutes`)
            msg.edit(e)
            break;
            case "600":
            channel.edit({rateLimitPerUser: 600})
            e.setDescription(`The slowmode is now: 10 Minutes`)
            msg.edit(e)
            break;
            case "900":
            channel.edit({rateLimitPerUser: 900})
            e.setDescription(`The slowmode is now: 15 Minutes`)
            msg.edit(e)
            break;
            case "1800":
            channel.edit({rateLimitPerUser: 1800})
            e.setDescription(`The slowmode is now: 30 Minutes`)
            msg.edit(e)
            break;
            case "3600":
            channel.edit({rateLimitPerUser: 3600})
            e.setDescription(`The slowmode is now: 1 Hour`)
            msg.edit(e)
            break;
            case "7200":
            channel.edit({rateLimitPerUser: 7200})
            e.setDescription(`The slowmode is now: 2 Hours`)
            msg.edit(e)
            break;
            case "21600":
            channel.edit({rateLimitPerUser: 21600})
            e.setDescription(`The slowmode is now: 6 Hours`)
            msg.edit(e)
            break;
            default:
            e.setTitle(`INFO`).setColor(`#FF0000`)
            .setDescription(`
            **0:** Off
            **5:** 5 Seconds
            **10:** 10 Seconds
            **15:** 30 Seconds
            **30:** 1 Minute
            **60:** 2 Minutes
            **120:** 5 Minutes
            **300:** 10 Minutes
            **600:** 15 Minutes
            **900:** 30 Minutes
            **1800:** 1 Hour
            **7200:** 2 Hours
            **21600:** 6 Hours
            `)
            msg.edit(e)
            break;
            }
            break;
            default: 
            e.setTitle(`INFO`).setColor(`#FF0000`).setDescription(`You didn't choose [name, topic, nsfw, slowmode]`)
            break;
      }
};
}
