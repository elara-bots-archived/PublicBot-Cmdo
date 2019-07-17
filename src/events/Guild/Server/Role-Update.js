const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), moment = require('moment');
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "roleUpdate",
            enabled: true
        })
    }
    async run(client, o, n){
        if(await client.m(client) === true) return;
        try{
            if(o.position !== n.position) return;
            if(o.id === n.guild.id) return;
            let e = new MessageEmbed()
            .setAuthor(n.guild.name, n.guild.iconURL())
            .setTitle(`Role Update`)
            .setColor(n.hexColor === "#000000" ? client.util.colors.default : n.hexColor)
            .setDescription(`${n} \`@${n.name}\` (${n.id})`)
            let mod = [];
            if(n.guild.me.hasPermission("VIEW_AUDIT_LOG")){
                let a = await client.f.audit(n.guild, "ROLE_UPDATE")
                if(a !== undefined){
                mod.push(` - Updated By: \`@${a.executor.tag}\` (${a.executor.id})`)
                e.setFooter(`Updated By: @${a.executor.tag} (${a.executor.id})`, a.executor.displayAvatarURL())
                }else{
                    e.setFooter(`Updated By: @Discord Intergration`)
                }
            }else{
                e.setFooter(`Updated By: ? Unknown, I can't view audit logs!`)
            }
            if(o.name !== n.name) e.addField(`Name`, `**Old: **${o.name}\n**New: **${n.name}`)
            if(o.hoist !== n.hoist) e.addField(`Hoist`, `**Old: **${o.hoist ? "Yes" :"No"}\n**New: **${n.hoist ? "Yes" : "No"}`)
            if(o.mentionable !== n.mentionable) e.addField(`Mentionable`, `**Old: **${o.mentionable ? "Yes" : "No"}\n**New: **${n.mentionable ? "Yes" : "No"}`)
            if(o.hexColor !== n.hexColor) e.addField(`Color`, `**Old: **${o.hexColor}\n**New:**${n.hexColor}`)
            if(o.permissions !== n.permissions){
                const convertPerms = function(permNumber, readableNames=false, debug=false) {
                    const convertReadable = function(permName, readable=true, debug=false) {
                      if (!readable) return permName;
                      if (debug) console.log(permName);
                      if (!client.util.perms[permName]) throw new RangeError("Invalid permission given!");
                      return client.util.perms[permName];
                    };
                    //if readableNames is set to true, use the names at Discord instead of the names of PermissionResolvables at discord.js.
                    if (isNaN(Number(permNumber))) throw new TypeError(`Expected permissions number, and received ${typeof permNumber} instead.`);
                    permNumber = Number(permNumber);
                    let evaluatedPerms = {};
                    for (let perm in client.util.permbits) {
                      let hasPerm = Boolean(permNumber & client.util.permbits[perm]);
                      evaluatedPerms[convertReadable(perm, readableNames, debug)] = hasPerm;
                    }
                    return evaluatedPerms;
                  };
                  let per = await convertPerms(n.permissions);
                  let oldper = await convertPerms(o.permissions);
                  let oldperms = [];
                  let newperms = [];
                  await Object.entries(per).filter(([perm, allowed]) => allowed).map(([perm]) => newperms.push(`${client.util.perms[perm]}`));
                  await Object.entries(oldper).filter(([perm, allowed]) => allowed).map(([perm]) => oldperms.push(`${client.util.perms[perm]}`));
                  let data = [];
                  let data2 = [];
                  oldperms.forEach(c => {
                  if(!newperms.includes(c)){
                      data2.push(c)
                  }
                  }) 
                  newperms.forEach(c => {
                      if(!oldperms.includes(c)) {
                          data.push(c)
                      }
                  });
                if(data.join(' ').length !== 0) e.addField(`Permission${data.length === 1 ? "" : "s"} Granted`, data.join('\n') || "None")
                if(data2.join(' ').length !== 0) e.addField(`Permission${data2.length === 1 ? "" : "s"} Denied`, data2.join('\n') || "None")
            }
            if(e.fields.length === 0) return;
            if(o.name === n.name && o.hoist === n.hoist && o.mentionable === n.mentionable && o.hexColor === n.hexColor && o.permissions === n.permissions) return;
            setTimeout(async () => {
                client.f.logging(client, 'server', o.guild, e, `🔍 Role Updated: \`@${n.name}\` (${n.id})${mod.length !== 0 ? mod[0] : ""}\n${e.fields.map(c => `**__${c.name}__**\n${c.value}`).join('\n\n')}`)
            }, 1000)
    }catch(e){
        client.f.event(client, "Role Update", e.stack, n.guild)
    }
    }
}