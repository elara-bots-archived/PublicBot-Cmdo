const {Command} = require('elaracmdo');
const Discord = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'profile',
      memberName: 'profile',
      aliases: [`pro`],
      examples: [`${client.commandPrefix}profile @user/id`],
      description: 'Shows yours or another users profile',
      group: 'user',
      args: [
          {
              key: "user",
              prompt: "What user do you want to check their profile out?",
              type: "user",
              default: message => message.author
          }
      ]
})
}
        async run(message, {user}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        let s = "**";
        let e = new Discord.MessageEmbed()
        .setColor(message.guild ? message.member.displayColor : "RANDOM")
        .setTitle(`Loading...`)
        let m = await message.channel.send(e);
        this.client.u.findOne({userID: user.id}, async (err, db) => {
            if(db){
            e.setAuthor(`${user.username}'s Profile`, user.displayAvatarURL())
            .setTitle(' ')
            .setDescription(`${db.custom.desc ? `${s}Description: ${s}${db.custom.desc}` : ""}\n${s}Reps: ${s}${db.reps}\n${s}Hearts: ${s}${db.hearts}\n${s}Todos: ${s}${db.todos.length}\n${s}Color: ${s}${db.custom.color}\n${s}Banner: ${s}${db.custom.image ? `[Link](${db.custom.image})` : "None"}`)
            
            try{
            e.setImage(db.custom.image === "" ? null : db.custom.image)
            }catch(e){}
            return m.edit(e)
            }else{
            await this.client.f.userdb(this.client, user)
            e.setTitle(`INFO`)
            .setDescription(`Please try again... ${user.tag}'s database has just been created.`);
            m.edit(e)
            }
        })
};
}
