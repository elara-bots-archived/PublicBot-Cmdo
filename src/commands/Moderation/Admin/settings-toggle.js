const { Command, RichMenu } = require('elaracmdo'),
        {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "toggle",
            memberName: "toggle",
            aliases: [`tog`],
            examples: [`${client.commandPrefix}toggle`],
            description: "Enables or disables a certain module.",
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
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
this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
    if(!db) return this.client.error(this.client, message, `This server doesn't have a settings database!`);
        const pop = async function(e){
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
            e.fields.pop()
        };
        message.delete(100).catch()
        let searchResult = ['joins', "mod", "server", "messages", "user", "embed","leaves", "ignore", "logbots"]
        const e = new MessageEmbed()
        .setAuthor(message.guild.name, this.client.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .setTitle('Modules')
        .setDescription(`Click on the reaction to enable or disable a module`)
        .setColor(message.guild ? message.member.displayColor : message.guild.color)
        const menu = new RichMenu(e)
        .addOption(`Joins`, `${db.toggles.joins ? "Enabled" : "Disabled"}`, true)
        .addOption(`Mod`, `${db.toggles.mod ? "Enabled" : "Disabled"}`, true)
        .addOption(`Server`, `${db.toggles.server ? "Enabled" : "Disabled"}`, true)
        .addOption(`Messages`, `${db.toggles.messages ? "Enabled" : "Disabled"}`, true)
        .addOption(`User`, `${db.toggles.user ? "Enabled" : "Disabled"}`, true)
        .addOption("Welcome - Embed", db.welcome.embed ? "Enabled" : "Disabled", true)
        .addOption("Leaves - Embed", db.leaves.embed ? "Enabled" : "Disabled", true)
        .addOption(`Suggestions - Owner Ignore`, `${db.toggles.ignore ? "Enabled" : "Disabled"}`, true)
        .addOption(`Logbots`, `${db.toggles.logbots ? "Enabled" : "Disabled"}`, true)
        let msg = await message.channel.send(`Loading...`)
        const collector = await menu.run(msg, { filter: (reaction, user) => user.id === message.author.id });
        const choice = await collector.selection;
        if (choice === null) return collector.message.delete();
        let def = searchResult[choice];
        switch(def){
            case "joins":
            if(db.toggles.joins === false){
                db.toggles.joins = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the \`joins\` module`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.joins = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the \`joins\` module`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "mod":
            if(db.toggles.mod === false){
                db.toggles.mod = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the \`mod\` module`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.mod = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the \`mod\` module`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "server":
            if(db.toggles.server === false){
                db.toggles.server = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the \`server\` module`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.server = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the \`server\` module`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "messages": 
            if(db.toggles.messages === false){
                db.toggles.messages = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the \`messages\` module`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.messages = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the \`messages\` module`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "user": 
            if(db.toggles.user === false){
                db.toggles.user = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the \`user\` module`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.user = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the \`user\` module`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "ignore":
            if(db.toggles.ignore === false){
                db.toggles.ignore = true
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the owner ignore for the suggestions`)
                .setTitle(`Success`)
                .setColor(`#FF000`)
                .setFooter(`This message will be deleted in 20 seconds`)
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.ignore = false
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the owner ignore for the suggestions`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "embed":
            if(db.welcome.embed === true){
                db.welcome.embed = false;
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the embed welcome message.`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                return msg.edit(e)
            }else{
                db.welcome.embed = true;
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the embed welcome message.`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "leaves":
            if(db.leaves.embed === true){
                db.leaves.embed = false;
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I disabled the embed leaves message.`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                return msg.edit(e)
            }else{
                db.leaves.embed = true;
                db.save().catch(err => console.log(err));
                e.setDescription(`Alright, I enabled the embed leaves message.`)
                .setTitle(`Success`)
                .setFooter(`This message will be deleted in 20 seconds`)
                .setColor(`#FF000`)
                pop(e)
                msg.edit(e)
            }
            break;
            case "logbots":
            if(db.toggles.logbots === true){
                db.toggles.logbots = false;
                db.save().catch(err => console.log(err));
                e.setDescription(`[Logbots] - Disabled`).setTitle(`Success`).setColor(`#FF000`).setFooter(`This message will be deleted in 20 seconds`);
                pop(e)
                return msg.edit(e)
            }else{
                db.toggles.logbots = true;
                db.save().catch(err => console.log(err));
                e.setDescription(`[Logbots] - Enabled`).setTitle(`Success`).setColor(`#FF000`).setFooter(`This message will be deleted in 20 seconds`);
                pop(e)
                msg.edit(e)
            }
            break;
            default:
            this.client.error(this.client, message, "You didn't make a selection or there was an error while running this command!");
            break;
        }
        setTimeout(() => {
            msg.delete().catch(o_O => {})
        }, 20000)
})
}catch(e){
    this.client.error(this.client, message, e)
    this.client.f.logger(this.client, message, e.stack)
}
}
}