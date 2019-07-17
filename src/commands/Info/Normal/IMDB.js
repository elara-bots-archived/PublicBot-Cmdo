const { Command } = require('elaracmdo'),
    keys = require('../../../util/config.js'),
    Discord = require('discord.js');
const IMDB = require('imdb-api');
const cli = new IMDB.Client({ apiKey: keys.apis.IMDB });
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "movie",
            memberName: "movie",
            aliases: [`imdb`],
            examples: [`${client.commandPrefix}movie Avengers`],
            description: "Gives you information about the show/movie that you provide",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "movie",
                    prompt: "What show/movie do you want the info of?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, { movie }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let b;
        try{
        let data = await cli.get({'name': movie});
        b = data
        }catch(e){
            return message.channel.send(`Nothing for that.`)
        }
        let s = "**"
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild ? message.guild.name : message.author.tag, message.guild ? message.guild.iconURL() : message.author.displayAvatarURL())
        .setColor(message.guild ? message.member.displayColor : "RANDOM")
        .setTitle(b.title)
        .setDescription(`
        ${s}Name: ${s}${b.title} (${b.imdbid})
        ${s}Years: ${s}${b._year_data}
        ${s}Rated: ${s}${b.rated}
        ${s}Runtime: ${s}${b.runtime}
        ${s}Genres: ${s}${b.genres}
        ${s}Writers: ${s}${b.writer}
        ${s}Director: ${s}${b.director === "N/A" ? "None" : b.director}
        ${s}Country: ${s}${b.country}
        ${s}Rating: ${s}${b.rating}
        ${s}Total Seasons: ${s}${b.totalseasons ? b.totalseasons : "N/A"}
        ${s}URL: ${s}${b.imdburl}
        `)
        .setImage(b.poster)
        return message.channel.send(e)
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}