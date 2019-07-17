const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js')
module.exports = class ErrorEvent extends Event{
    constructor(client){
        super(client, {
            name: "error",
            enabled: true
        })
    }
    async run(client, error){
        let errs = await error;
        if(errs === "undefined") return;
        let e = new MessageEmbed()
        .setColor(client.util.colors.default)
        .setDescription(`\`\`\`js\n${errs.stack}\`\`\``)
        .setTimestamp()
        .setTitle(`Event: Error`)
        try{client.f.hooks('error', e)}catch(e){}
    }
}