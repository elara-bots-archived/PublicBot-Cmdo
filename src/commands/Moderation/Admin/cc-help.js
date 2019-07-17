const {Command} = require('elaracmdo');
const {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
      constructor(client) {
      super(client, {
      name: 'cchelp',
      memberName: 'cchelp',
      aliases: [`helpcc`],
      examples: [`${client.commandPrefix}cchelp`],
      description: 'Gives you all of the Variables for the custom commands.',
      group: 'admin',
      userPermissions: ["MANAGE_GUILD"],
      throttling: {
            usages: 1,
            duration: 5
        },
})
}
        async run(message) {
            if(await this.client.b(this.client, message) === true) return;
            if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
            if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
            ;
            let e = new MessageEmbed()
.setAuthor(message.guild.name, message.guild.iconURL())
.setColor(message.guild.color)
.setTitle(`Command Variables`)
.addField(`Server`, `
{server} - The Server Name
{server.icon} - The Server Icon
{server.id} - The Server ID
{server.createdAt} - The Servers creation date.                        
`)
.addField(`Channel`, `
{channel} - Mentions the channel.
{channel.name} - Gives the channel name.
{channel.id} - Gives the channel id.
{channel.type} - Gives the channel type.
{channel.topic} - Givees the channel topic.
`)
.addField(`User`, `
{user} - Mentions the user who does the command.
{user.avatar} - Gives you the users avatar.
{user.id} - Gives you the users ID
{user.createdAt} - Gives you the created At date-time
{user.tag} - Gives you the users username#tag
`)
return message.channel.send(e)
};
}