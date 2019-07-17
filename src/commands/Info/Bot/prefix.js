const {Command} = require('elaracmdo'),
      {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'prefix',
             memberName: 'prefix',
             aliases: [`setprefix`],
             examples: [`${client.commandPrefix}prefix`],
             description: 'Checks the prefix',
             group: 'bot',
             throttling: {
              usages: 2,
              duration: 5
            },
            args: [
              {
                key: "prefix",
                prompt: "What do you want the new prefix to be?",
                type: "string",
                default: "",
                min: 1,
                max: 150
              }
            ]
})
}
        async run(message, {prefix}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new MessageEmbed().setColor(message.guild.color);
        if(message.guild){
          this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
              if(prefix !== ""){
              if(!message.member.hasPermission("MANAGE_GUILD")) return this.client.error(this.client, message, `You need the \`Manage Server\` permission to change the prefix!`);
              if(prefix.toLowerCase() === "reset" || prefix.toLowerCase() === "default" || db.prefix.toLowerCase() === prefix.toLowerCase()){
              db.prefix = "";
              db.save().catch(err => console.log(err));
              message.guild._commandPrefix = this.client.commandPrefix;
              e.setDescription(`Use \`${this.client.commandPrefix}\` for commands!`).setTitle(`Prefix reset`);
              return message.channel.send(e)
              }else{
                db.prefix = prefix.toLowerCase();
                db.save().catch(err => console.log(err));
                message.guild._commandPrefix = prefix;
                e.setDescription(`Use \`${prefix}\` for commands!`).setTitle(`New Prefix`);
                return message.channel.send(e)
              }
              }else{
              e.setTitle(`Prefix`).setAuthor(message.guild.name, message.guild.iconURL()).setDescription(db.prefix || this.client.commandPrefix)
              if(message.member.hasPermission("MANAGE_GUILD")) e.setFooter(`Note: To change the prefix do ${db.prefix || this.client.commandPrefix}setprefix [newprefix]`);
              return message.channel.send(e)
              }
            }else{
              e.setTitle(`Prefix`).setAuthor(message.guild.name, message.guild.iconURL()).setDescription(this.client.commandPrefix)
              if(message.member.hasPermission("MANAGE_GUILD")) e.setFooter(`Note: To change the prefix do ${this.client.commandPrefix}setprefix [newprefix]`);
              return message.channel.send(e)
            }
          });
        }else{
          e.setTitle(`Prefix`).setDescription(this.client.commandPrefix)
          return message.channel.send(e)
        }

          } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
          }
}
}
