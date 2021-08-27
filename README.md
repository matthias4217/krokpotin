# Discord Bot

## Installation :

### Dependencies

Node 16 or later ;
npm 7 or later ;
discord 13 or greater

### Setup

```bash
$ npm install
$ cp .env.example .env
<EDIT .env to match your preferences>
```
### Setup slash commands
To setup slash commands use:

    node deploy-commands.js
This currently deploy the commands to a server only configurable in .env .To deploy them globally, got the abovementionned file, line 19 and 20

    //Routes.applicationCommands(clientId), //Global command deployment
    Routes.applicationGuildCommands(clientId, guildId), //Server command deployment  
Uncomment the first and comment or delete the second one. **Do your test in a server only**, it will take up to an hour to deploy the commands globally.

### Launch
```bash
$ node index.js
```

### Warning
You can't have two instances of the same bot react on one interaction, maybe if you change something in event handler and use `Followup` instead of `Reply` but that's something I'll do later on.
