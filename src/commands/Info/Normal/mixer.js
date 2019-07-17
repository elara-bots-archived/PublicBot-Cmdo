const {Command, Embed} = require('elaracmdo');
const {get} = require('superagent');
const moment = require('moment');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'mixer',
      memberName: 'mixer',
      aliases: [],
      examples: [`${client.commandPrefix}mixer [username]`],
      description: 'Shows the mixer information for the user you provide',
      group: 'info',
      hidden: false,
      ownerOnly: false,
      guildOnly: false,
      args: [
          {
              key: "channel",
              prompt: "What Mixer channel do you want to check out?",
              type: "string"
          }
      ]
})
}
        async run(message, {channel}) {
      if(await this.client.b(this.client, message) === true) return;
      if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
      if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
      ;
      let {body} = await get(`https://mixer.com/api/v1/channels/${channel}`)
      if(!body) return message.channel.send(`Nothing for that.`)
       let e = new Embed()
       .setColor(message.guild.color)
       .setAuthor(`${body.user.username} (${body.id})`, body.user.avatarUrl)
       if(body.type !== null){
       e.setThumbnail(body.type.coverUrl)
       .setImage(body.type.backgroundUrl)
       }
       e.setDescription(`https://mixer.com/${body.user.username}`)
       e.addField(`User`, `
       **Username:** ${body.user.username} (${body.user.id})
       **Created At:** ${moment(body.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
       **Experience:** ${body.user.experience || "0"}
       **Level:** ${body.user.level || "0"}
       **Sparks:** ${body.user.sparks || "0"}
       **Primary Team:** ${body.user.primaryTeam || "None"}
       **Verified:** ${body.user.verified ? "Yes" : "No"}
       **Bio:** ${body.user.bio || "None"}
       `)
       .addField(`Socials`, `${body.user.social.youtube ? `[YouTube](${body.user.social.youtube})` : ""}${body.user.social.twitter  ? `\n[Twitter](${body.user.social.twitter})` : ""}${body.user.social.instagram  ? `\n[Instagram](${body.user.social.instagram})` : ""}${body.user.social.facebook  ? `\n[Facebook](${body.user.social.facebook})` : ""}`)
       return message.channel.send(e)
};
}