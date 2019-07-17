const {Command} = require('elaracmdo'),
Discord = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'rate',
             memberName: 'rate',
             aliases: [],
             examples: [`${client.commandPrefix}rate @user/id`],
             description: 'Rates you or the user you mention',
             group: 'fun',
             throttling: {
                usages: 1,
                duration: 2
            },
             args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to rate?',
                    type: 'user',
                    default: message => message.author
                }
              ]
})
}
        async run(message, {user}) {
            if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
    try{
        let random = Math.floor(Math.random() * 10);
        let e = new Discord.MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(message.guild.color)
        .setTitle(`Rating`)
        .setTimestamp()
        if(user.id === "455166272339181589" || this.client.isOwner(user.id)){
        e.setDescription(`10/10`)
        }else{
            e.setDescription(`${random}/10`)
        }
        message.channel.send(e)
    }catch(e){
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
}
}