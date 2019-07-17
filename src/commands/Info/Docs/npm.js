const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const superagent = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "npm",
            memberName: "npm",
            aliases: [],
            examples: [`${client.commandPrefix}npm <Package Name here>`],
            description: "Gets info on the npm package you search.",
            group: "docs",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What npm package do you want me to retrieve?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let { body } = await superagent.get(`https://skimdb.npmjs.com/registry/${content.toLowerCase()}`)
        if (!body) return message.channel.send(`Nothing for that...`)
        let link = `https://www.npmjs.com/package/${content.toLowerCase()}`;
        let embed = new Discord.MessageEmbed()
            .setThumbnail(`https://raw.githubusercontent.com/github/explore/6c6508f34230f0ac0d49e847a326429eefbfc030/topics/npm/npm.png`)
            .setColor(message.guild.color)
            .setTitle(`Description`)
            .setDescription(body.description)
            .addField(`Author`, body.author.name)
            .addField(`Name`, body.name, true)
            .addField(`Download`, `[npm i ${body.name}](${link})`, true)
        if (body.homepage.length !== 0) { embed.addField(`Home Page`, body.homepage ? `[Click Here](${body.homepage})` : "None", true) }
        embed.addField(`Link`, `[Click Here](${link})`, true)
        embed.addField(`Repository`, `${((body.repository) ? `[Click Here](${body.repository.url.replace("git+", "").replace(".git", "").replace("git://", "https://").replace("git@github.com:", "https://github.com/").replace("ssh://git@", "https://")})` : "No Repository")}`, true)
        if (body.bugs.url.length !== 0) { embed.addField(`Bugs/Issues URL`, body.bugs.url ? `[Click Here](${body.bugs.url})` : "None", true) }
        embed.addField(`Latest`, body["dist-tags"].latest, true)
        embed.addField(`Key Words`, body.keywords.join('\n'), true)
        embed.addField(`Maintainers`, body.maintainers.map(m => m.name).join("\n"), true)

        message.channel.send(embed)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}