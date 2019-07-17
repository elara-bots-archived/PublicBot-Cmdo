const { Command, eutil: {dcolors} } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "discordcolors",
            memberName: "discordcolors",
            aliases: ["dc", "discordsyntax"],
            examples: [`${client.commandPrefix}discordcolors`],
            description: "Gives you the different Discord Syntax Codes and Examples",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL())
            .setTitle(`List of all of the Discord Syntax Codes and Examples.\nPut 3 **\`** at the back and front of the message.`)
            .setTimestamp()
            .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
            .addField('1. Regular', dcolors.normal)
            .addField(`2. CSS`, dcolors.css)
            .addField(`3. FIX`, dcolors.fix)
            .addField(`4. MD`, dcolors.md)
            .addField(`5. PY`, dcolors.py)
            .addField(`6. CS`, dcolors.cs)
            .addField(`7. DIFF`, dcolors.diff)
            .addField(`8. XL`, dcolors.xl)
            .addField(`9. TEX`, dcolors.tex)
            .addField(`10. JAVA`, dcolors.java)
            .addField(`11. JS`, dcolors.js)
            .addField(`12. XML`, dcolors.xml)
            .addField(`13. PROLOG`, dcolors.prolog)
            .addField(`14. ML`, dcolors.ml)
            .addField(`15. JSON`, dcolors.json)
            .addField(`16. INI`, dcolors.ini)
            .addField(`17. HTML`, dcolors.html)
            .addField(`18. GLSL`, dcolors.glsl)
            .addField(`19. CPP`, dcolors.cpp)
            .addField(`20. COFFEESCRIPT`, dcolors.coffee)
            .addField(`21. BASH`, dcolors.bash)
            .addField(`22. AUTOHOTKEY`, dcolors.auto)
            .addField(`23. ASCIIDOC`, dcolors.asciidoc)
        message.embed(embed)
        }catch(e){
            this.client.error(this.client, message, e);
           
           this.client.f.logger(this.client, message, e.stack)
           
        }
    }
}