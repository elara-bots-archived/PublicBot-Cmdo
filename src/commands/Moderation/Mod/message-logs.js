const { Command } = require('elaracmdo'),
      {MessageEmbed} = require('discord.js');
const moment = require('moment');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "getlogs",
            memberName: "getlogs",
            aliases: [],
            examples: [`${client.commandPrefix}getlogs #general 20`, `${client.commandPrefix}getlogs #general 20 detail`],
            description: "Gives you the message logs for the channel.\nTypes: `detail`, `regular`",
            group: "mod",
            userPermissions: ["MANAGE_MESSAGES"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What channel do you want me to fetch messages from?",
                    type: "channel"
                },
                {
                    key: 'content',
                    prompt: 'How many messages?',
                    type: 'integer',
                    min: 1,
                    max: 100
                },
                {
                    key: "type",
                    prompt: "What type, `detail` or `normal`",
                    type: "string",
                    default: "normal"
                }
            ]
        })
    }
    async run(message, {channel ,content, type}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(message.guild ? message.member.displayColor : message.guild.color)
        .setTitle(`Message Logs`);
        let msgs = await channel.messages.fetch({limit: content});
        if(msgs.map(c => c).length === 0) return message.channel.send(`There isn't any messages in ${channel}!\n***Is this place dead?***`)
        let link;
        switch(type.toLowerCase()){
            case "detail":
            let bin1 = await this.client.f.bin('Message Logs', await msgs.map(m => m.author ? `
            Author: @${m.author.tag} (${m.author.id})
            Content: ${m.content ? m.content : "None"}
            Attachments: ${m.attachments.map(c => c).length !== 0 ? m.attachments.map(c => c.proxyURL).join('\n') : `None`}
          
            Misc
            - ID: ${m.id}
            - Created At: ${moment(m.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
            - Embed: ${m.embeds.map(c => c).length !== 0  ? "Yes": "No"}
            - Channel: #${channel.name} (${channel.id})
            ------------------------------------------------------------------------------------------------------------------------------------
            ` : "-- Not Cached Message --").join('\n\n'))
            link = bin1;
            break;
            case "normal":
            let bin2 = await this.client.f.bin('Message Logs', await msgs.map(m => m.author ? `
            Author: @${m.author.tag} (${m.author.id})
            Content: ${m.content ? m.content : "None"}
            Attachments: ${m.attachments.map(c => c).length !== 0 ? m.attachments.map(c => c.proxyURL).join('\n') : `None`}
          
            Misc
            - ID: ${m.id}
            - Channel: #${channel.name} (${channel.id})
            ------------------------------------------------------------------------------------------------------------------------------------
            ` : "-- Not Cached Message --").join('\n\n'))
            link = bin2;
            break;
            default:
            link = `You didn't choose detail or normal!`;
            break;
        }
        e.setDescription(link)
        return message.channel.send(e)
} catch (e) {
    this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
    }
}



// const Discord = require("discord.js");
// const moment = require("moment")
// module.exports.run = async (bot, message, args) => {
//    try{bot.channels.get('530923952412033044').send(`${message.author.tag} has used \`joined\` in ${message.guild.name}`)}catch(e){console.log(`Couldn't log the command "joined"`)}
//     if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You didn't say the magic word.");
// let data = [], name = [];
// let num = 0;
//  message.guild.members.sort((a, b) => b.joinedAt-a.joinedAt).forEach((m, i)=> {
// if(m.user.bot === false){
// num++
// name.push(`${num}`)
// data.push(`${m.user.tag} (${m.user.id}): ${moment(m.joinedAt).format('dddd, MMMM Do YYYY')}`)
// }
// })
//  const cake2 = new Discord.MessageEmbed()
//  .setAuthor("Members by join date", bot.user.avatarURL)
//  .setDescription(data.reverse().join("\n"))
//  .setColor(0x0a8000)
//  .setTimestamp()
//  let i = 0;
//  await data.reverse().splice(0, 25).forEach(c => {
//      i++
//      cake2.addField(`${name[i]}`, data[i])
//  })
// message.channel.send(cake2)
// }

// module.exports.help = {
//    name: "joined"
// }