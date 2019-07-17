const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "tiny",
            memberName: "tiny",
            aliases: ["tinytext"],
            examples: [`${client.commandPrefix}tiny <text here>`],
            description: "Makes text tiny!",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'Please Provide the text you want me to make tiny!',
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
        const mappings = (function (object) {
            let output = [];

            for (let key in object) {
                output.push({
                    regex: new RegExp(key, 'ig'),
                    replacement: object[key]
                });
            }

            return output;
        })({
            a: '\u1D00',
            b: '\u0299',
            c: '\u1D04',
            d: '\u1D05',
            e: '\u1D07',
            f: '\uA730',
            g: '\u0262',
            h: '\u029C',
            i: '\u026A',
            j: '\u1D0A',
            k: '\u1D0B',
            l: '\u029F',
            m: '\u1D0D',
            n: '\u0274',
            o: '\u1D0F',
            p: '\u1D18',
            q: '\u0071',
            r: '\u0280',
            s: '\uA731',
            t: '\u1D1B',
            u: '\u1D1C',
            v: '\u1D20',
            w: '\u1D21',
            x: '\u0078',
            y: '\u028F',
            z: '\u1D22'
        });
        let output = content
        mappings.forEach(replacer => output = output.replace(replacer.regex, replacer.replacement));
        message.say(output);
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}