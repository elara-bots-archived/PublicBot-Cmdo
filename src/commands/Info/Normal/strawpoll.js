const { MessageEmbed } = require('discord.js')
const { Command} = require('elaracmdo');
const fetch = require('node-fetch');

module.exports = class StrawpollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'strawpoll',
            aliases: ['straw'],
            group: 'info',
            memberName: 'strawpoll',
            description: 'Strawpoll something. Recommended to use the replying with each argument method to allow spaces in the title',
            format: '\'Title Of Strawpoll\' OptionA OptionB OptionC...',
            details: 'Has a very specific syntax! Be sure to adapt the example!',
            examples: ['strawpoll \'Best RWBY girl?\' \'Pyrrha Nikos\' \'Ruby Rose\'', 'strawpoll \'Best coding language?\' JavaScript C# C++'],
            guildOnly: false,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'title',
                    prompt: 'Title of the strawpoll',
                    type: 'string',
                },
                {
                    key: 'options',
                    prompt: 'What are the messages for the strawpoll (minimum is 2)? Send 1 option per message and end with `finish`',
                    type: 'string',
                    infinite: true,
                }
            ],
        });
    }

    async run(message, { title, options }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if (options.length < 2) {
            return message.reply('a poll needs to have at least 2 options to pick from');
        }
        try {
            const pollEmbed = new MessageEmbed();
            const pollPost = await fetch('https://www.strawpoll.me/api/v2/polls', {
                body: JSON.stringify({
                    options,
                    title,
                    captcha: true,
                    dupcheck: 'normal',
                    multi: false,
                }),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            });
            const strawpoll = await pollPost.json();

            pollEmbed
                .setColor(message.guild ? message.guild.color : 'RANDOM')
                .setTitle(strawpoll.title)
                .setURL(`http://www.strawpoll.me/${strawpoll.id}`)
                .setImage(`http://www.strawpoll.me/images/poll-results/${strawpoll.id}.png`)
                .setDescription(`Options on this poll: ${strawpoll.options.map((val) => `\`${val}\``).join(', ')}`)
                .addField(`Links`, `[Vote Here!](http://www.strawpoll.me/${strawpoll.id})\n[Results](https://www.strawpoll.me/${strawpoll.id}/r)`)
            return message.embed(pollEmbed);
        } catch (err) {
            console.log(err)
            return message.reply('an error occurred creating the strawpoll');
        }
        } catch (e) {
            this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}