const { oneLine } = require('common-tags');
const { Command, RichDisplay } = require('elaracmdo');
const Discord = require('discord.js');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'bot',
            memberName: 'help',
            aliases: [`h`, `halp`, `command`, `commands`],
            description: 'Displays a list of available commands, or detailed information for a specified command.',
            details: oneLine`The command may be part of a command name or a whole command name.\nIf it isn't specified, all available commands will be listed.`,
            examples: [`${client.commandPrefix}help`, `${client.commandPrefix}help prefix`],
            guarded: true,
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [{
                key: 'command',
                prompt: 'Which command would you like to view the help for?',
                type: 'string',
                default: ''
            }]
        });
    }

    async run(message, args) { 
      try{
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        if(!message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES') && !message.channel.permissionsFor(this.client.user.id).has('ADD_REACTIONS') && !message.channel.permissionsFor(this.client.user.id).has('USE_EXTERNAL_EMOJIS')) return message.channel.send(`I am missing permissions in this channel! [Manage Messages, Add Reactions, Use External Emojis]`)
        let user = this.client.user;
        let color = message.guild ? message.member.displayColor : message.guild.color;
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(args.command, false, message);
        const showAll = args.command && args.command.toLowerCase() === 'all';
        if(args.command === "groups"){
            let e = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setColor(color)
            .setTitle(`All Groups`)
            .setDescription(`
            ${groups.map(c => `${c.name} (${c.id}) [${c.commands.size}]`).join('\n')}
            `)
            return message.say(e)
        }
        if(args.command && !showAll){
             if(commands.length === 1){
                  let cmd = commands[0];
                  if(!this.client.isOwner(message.author.id) && cmd.hidden === true) return;
                  let misc = [];
                  let perms = [];
                  if(cmd.guildOnly === true) misc.push(`**Server Only: **Yes`)
                  if(cmd.nsfw === true) misc.push(`**NSFW Only: **Yes`)
                  if(cmd.guarded === true) misc.push(`**Guarded: **Yes`)
                  if(cmd.userPermissions !== null) perms.push(`**User Permissions: **${cmd.userPermissions.join(", ")}`)
                  if(cmd.clientPermissions !== null) perms.push(`**Bot Permissions: **${cmd.clientPermissions.join(", ")}`)
                  let e = new Discord.MessageEmbed()
                  .setAuthor(user.tag, user.displayAvatarURL())
                  .setColor(color)
                  .setTitle(`Command Help`)
                  .setDescription(`
                  **Name: **${cmd.name}${
                  cmd.aliases.length !== 0 ? `\n**Aliases: **${cmd.aliases.join(", ")}` : ""}
                  **Group: **${cmd.group.name}${cmd.details !== null ? `\n**Details: **${cmd.details}` : ""}${cmd.examples !== null ? `\n**Examples: **${cmd.examples.join(", ")}` : ""}
                  **Description: **${cmd.description}${misc.length !== 0 ? `\n${misc.join("\n")}` : ""}${perms.length !== 0 ? `\n${perms.join("\n")}`: ""}
                  `)
                  return message.say(e)
             }else{
                 let e = new Discord.MessageEmbed()
                 .setTitle(`Command Help`).setColor(color).setAuthor(user.tag, user.displayAvatarURL())
                 .setDescription(`Command [**${args.command}**] not found!`)
                 return message.say(e)
             }
        }else{
            if(message.guild){
            let e = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(color)
            let display = new RichDisplay(e)
            groups.forEach(g => {
                let commands = g.commands.map(c => `**${c.name}**${c.nsfw ? "(NSFW)" : ""} - ${c.description}`)
                if(g.id === ("util" || "commands")) return;
                if(g.id === "admin" && !message.member.hasPermission(`MANAGE_GUILD`)) return;
                if(g.id === "mod" && !message.member.hasPermission("MANAGE_MESSAGES")) return;
                if(g.id === ("owner" || "owner/misc") && !this.client.isOwner(message.author.id)) return;
                display.addPage(e => e.setDescription(`${commands.join('\n')}`).setTitle(g.name))
            });
            display.setFooterPrefix('Here are all of the commands you can use. Page: ')
            display.run(await message.channel.send(`Loading...`))
        }else{
         let e = new Discord.MessageEmbed()
         .setDescription(`**This command can only be run in a server channel!**`)
         .setTitle(`INFO`)
         .setTimestamp()
         .setColor(`#FF0000`)
         .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
         return message.direct(e)
        }
    }
      }catch(e){
            console.log(e.stack)
      }
}
};
