const {CommandoClient, eutil} = require('elaracmdo'), config = require('./util/config'), functions = require('./util/functions'), {MessageEmbed} = require('discord.js'), {join} = require('path'), {connect} = require('mongoose'), Schemas = require('./util/Schemas')
class PublicBot extends CommandoClient{
    constructor(){
        super({
            commandPrefix: config.prefix, 
            owner: config.owners, 
            invite: config.invite,
            commandEditableDuration: 10000,
            messageCacheMaxSize: 200,
            restSweepInterval: 120,
            nonCommandEditable: true,
            fetchAllMembers: true
        })
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[Setup] - Starting`); 
        this.apis = config.apis; this.dev = Schemas.dev;  this.dbs = Schemas;  this.f = functions;   this.dbcoins = Schemas.coins;   this.m = functions.maint;   this.b = functions.blacklist;   this.db = Schemas.settings;   this.u = Schemas.users;   this.warns = Schemas.config;   this.error = functions.error;    this.custom = Schemas.config;  this.config = config;   this.util = eutil;
        this.getGuild = async function(guild){
          let data = await Schemas.settings.findOne({guildID: guild});
          if(!data) return null;
          return await data;
        }
        this.registry.registerDefaultTypes().registerDefaultGroups().registerGroups([["admin", "Admin Commands"], ["mod", "Moderator Commands"], ["bot", "Bot Information Commands", true], ["info", "Information Commands"], ['docs', 'Docs Commands'], ['user', "User Commands"], ["server", "Server Commands"], ["fun", "Fun Commands"], ["coins", "Coins Commands"], ["image", "Image Commands"], ["owner", "Bot Owner Commands", true]]).registerDefaultCommands({help: false, prefix: false, ping: true, eval: true, commandState: true, extra: true}).registerCommandsIn(join(__dirname, 'commands'));
        config.commandfolders.forEach(w => this.registry.registerCommandsIn(join(__dirname, `commands/${w}/`)));
        if(config.totaldisable === false){config.eventfolders.forEach(async c => functions.load(this, `Guild/${c}`));}; functions.load(this, "Client");   
        this.on("commandError", async (cmd, error, message, args, fromPattern, result) => functions.commandError(this, cmd, message, error, args));
        this.on("commandRun", async (cmd, promise, message, args, fromPattern, result) => functions.stats(this, "cmd", {name: cmd.name, msg: message}))
        this.on("shardReady", async (id) => functions.shards(this, id, "Ready", this.util.colors.green, null, null))
        this.on("shardReconnecting", async (id) => functions.shards(this, id, "Reconnecting", this.util.colors.yellow, null, null))
        this.on("shardDisconnected", async (event, id) => functions.shards(this, id, "Disconnected", this.util.colors.red, null, null))
        this.on('shardResumed', async (id, events) => functions.shards(this, id, "Resumed", this.util.colors.orange, `With: ${events} events`, null));
        this.on("shardError", async (error, id) => functions.shards(this, id, "Error", this.util.colors.red, null, error.stack))
        connect(config.mongo, { useNewUrlParser: true, useFindAndModify: true }).then(async () => console.log(`[Mongodb] - Connected`)).catch(err => {console.log(`[Mongodb Error] - \n${err.stack}`); return process.exit(1)})
        this.login(config.token).catch(err => {console.log(`Connection Error: ${err.stack}`); return process.exit(1)});
}
}
module.exports = new PublicBot()
process.on('unhandledRejection', error => functions.process("Unhandled Rejection", error)).on('uncaughtException', async error => {
  functions.process("Uncaught Exception", error)
  let embed = new MessageEmbed()
  .setColor(eutil.colors.default)
  .setTitle(`Process`)
  .setDescription(`Ended because of Uncaught Execption.`)
  .setTimestamp()
  await functions.hooks('log', embed)
  setTimeout(() => {
    return process.exit(1)
  }, 5000)
});
