const {Command} = require('elaracmdo'),
Discord = require('discord.js');
const moment = require('moment');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'roleinfo',
             memberName: 'roleinfo',
             aliases: [`ri`],
             examples: [`${client.commandPrefix}roleinfo @role/roleid/rolename`],
             description: 'Gives you the information about the role',
             group: 'server',
             guildOnly: true,
             throttling: {
              usages: 1,
              duration: 5
          },
             args: [
                {
                    key: 'role',
                    prompt: 'What role do you want to check the info on?',
                    type: 'role'
                }
              ]
})
}
        async run(message, {role}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
          let {perms, permbits} = this.client.util;
          const convertPerms = await async function(permNumber, readableNames=false, debug=false) {
            const convertReadable = function(permName, readable=true, debug=false) {
              if (!readable) return permName;
              if (debug) console.log(permName);
              if (!perms[permName]) throw new RangeError("Invalid permission given!");
              return perms[permName];
            };
            //if readableNames is set to true, use the names at Discord instead of the names of PermissionResolvables at discord.js.
            if (isNaN(Number(permNumber))) throw new TypeError(`Expected permissions number, and received ${typeof permNumber} instead.`);
            permNumber = Number(permNumber);
            let evaluatedPerms = {};
            for (let perm in permbits) {
              let hasPerm = Boolean(permNumber & permbits[perm]);
              evaluatedPerms[convertReadable(perm, readableNames, debug)] = hasPerm;
            }
            return evaluatedPerms;
          };
          let permissions = []
          let per = await convertPerms(role.permissions)
          console.log(per)
          await Object.entries(per).filter(([perm, allowed]) => allowed).map(([perm]) => permissions.push(perms[perm]));
          let embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle(`Role Information`)
            .setDescription(`
            ${role} \`@${role.name}\` (${role.id})
            ${permissions.includes("Administrator") ? "**This role has Administrator and will bypass all channel permissions.**" : ""}
            **Color: **${role.hexColor}
            **Hosted: **${role.hoist ? "Yes": "No"}
            **Mentionable: **${role.mentionable ? "Yes" : "No"}
            **Position: **${role.position}
            **Member Size: **${role.members.size}
            **Created At: **${moment(role.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}
            `)
            .setFooter(`Requested By: ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(role.hexColor === "#000000" ? this.client.util.colors.default : role.hexColor)
            .setTimestamp()
        if(await permissions.join(' ').length !== 0) embed.addField(`Permissions`, permissions.join(", "))
        await message.channel.send(embed)
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
}
}