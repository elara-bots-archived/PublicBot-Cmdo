Notice
=====================
This is **NOT** for people who are just starting. I suggest you go watch a few tutorials to get the general idea of how to create a bot before even attempting to run this code etc..



Getting Started
===================

**1.** Download the files or use `git clone` 
Ex: `git clone https://github.com/Elara-Discord-Bots/PublicBot-Cmdo.git`

**2.** Once you have the files downloaded open up a console in the bot folder and do `npm install` and let it run fully.

**3.** Fill out the options in the [`config.js`](https://github.com/Elara-Discord-Bots/PublicBot-Cmdo/blob/master/src/util/config.js) file.

Config Requirements!
============
- [`log`, `error`, `servers`, `action`, `shard`]: Webhooks are required, It requires webhook links/urls.. 
- token: The bot token.. Get your bot token from. [Discord Developers Page](https://discordapp.com/developers/applications)
- owners: The array of bot developers. Ex: [`id`, `id2`]
- mongo: The connect URL from Mongodb Atlas, Instructions below...
- prefix: THe prefix for the bot. - Default is: `!!`


Mongodb Instructions
=====================
- Get an account at [mongodb](https://www.mongodb.com/cloud/atlas)
- Once created, setup your cluster: 
- Select a "Free Region" server 
- Keep the M0 cluster tier (the only free one). You may select backups if you want, other additional options are paid.
- Type in a cluster name of your choice. Something like `Bot`.
- Click **Create Cluster**.
- *This can and will take awhile to finish..*
- Go to the **Network Access** tab and then click **Add IP Address** then put **0.0.0.0/0** 
- Now that's all setup, go to the **Database Access** tab and then Click **Add New User** and add a username and password then press save..
- Click **Choose a connection method**.
- Click **Connect your Application**
- Your connection string is here! Keep the page open to copy it later in the setup stage.
