const { Command, eutil: {semoji, nemoji} } = require('elaracmdo'),
    Discord = require('discord.js');
let request = require('request');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "check",
            memberName: "check",
            aliases: ["linkcheck", "website"],
            examples: [`${client.commandPrefix}check <Link here>`],
            description: "Checks if the site is safe or not.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                key: "content",
                prompt: "What link do you want me to check out?",
                type: "string"
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let color = message.guild.color;
        const embed = new Discord.MessageEmbed()
            .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
            .setFooter(`Provided By: Spoopy.link`, "https://boop.page.link/kU6b", `https://spoopy.link`)
            .setTimestamp()

        request(`https://spoopy.link/api/${content}`,async  function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var srThing = JSON.parse(body);
                if (srThing.chain[0].reasons[0] == "INVALID") {
                    embed.setColor(`#FF0000`)
                    embed.setDescription("That isn't a valid website.");
                    message.channel.send(embed);
                    return;
                }
                var sites = []

                srThing.chain.forEach(async link => {
                    if (link.safe == false && link.reasons[0] == "INVALID") {
                        sites = sites += `${link.url.toString() + "\nReasons: " + link.reasons.join(` │ `)}\n`
                    } else if (link.safe == false && link.reasons[0] !== "INVALID") {
                        sites = sites += `${link.url.toString() + "\nReasons: " + link.reasons.join(` │ `)}\n`
                    } else {
                        sites = sites += `${"[" + link.url + "](" + link.url + ") "}\n`
                    }
                });
                embed.addField(`Safe?`, `${srThing.safe ? `${semoji} Safe` : `${nemoji} Unsafe`}`)
                embed.setDescription(sites)
                embed.setColor(color)
            } else {
                embed.setDescription("Spoopy.link is currently down right now, Try again later.");
                embed.setColor(`#FF0000`)
                .setFooter("Use https://sitecheck.sucuri.net/ since spoopy.link is down.", " ")
            }
            message.channel.send(embed)
        });

        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
