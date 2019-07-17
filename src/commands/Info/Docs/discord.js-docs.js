const {Command, Docs} = require('elaracmdo');
const { MessageEmbed } = require('discord.js');
module.exports = class DBLCommand extends Command {
    constructor(client) {
        super(client, {
            name: "docs",
            memberName: "docs",
            aliases: ["d.js"],
            group: "docs",
            examples: [`${client.commandPrefix}docs Client`, `${client.commandPrefix}docs CommandoClient commando`, `${client.commandPrefix}docs <Search query here> <Docs Type>`],
            description: "Gets the information from the Discord.js Docs",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "search",
                    prompt: "What do you want to search in the Discord.js docs?",
                    type: "string"
                },
                {
                    key: "project",
                    prompt: "What project, `main`, `commando`, `rpc`",
                    type: "string",
                    parse: str => str.toLowerCase(),
                    default: "main"
                },
                {
                    key: "branch",
                    prompt: "What branch?",
                    type: "string",
                    default: "stable",
                    parse: str => str.toLowerCase()
                }
            ]
        })
    }
    async run(message, { search, project, branch }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
            let djs = ["d.js", "regular", "main"], commando = ["cmdo", "commando", "d.js-commando"];
            if(djs.includes(project)) project = "main";
            if(commando.includes(project)){
                project = "commando";
                branch = "master"
            }
            const doc = await Docs.fetch(project, branch)
            if(!doc) return this.client.error(this.client, message, `Not found`)
            let test = await doc.resolveEmbed(search)
            if(!test) return this.client.error(this.client, message, `Not found`)
            let e = new MessageEmbed()
            .setThumbnail(test.author.icon_url)
            .setColor(this.client.util.colors.cyan)
            .setDescription(test.description)
            .setAuthor(test.author.name, test.author.icon_url, test.author.url)
            if(test.fields){
            test.fields.forEach(c => e.addField(c.name, c.value))
            }
            return message.channel.send(e)
    }
}