# @lumap/commandhandler #
This package provide a easy to use command handler for discord.js (it *can* work with Eris, but this package was created with discord.js v12 in mind)
# How to use it #
Here is a quick example of a discord bot made with this command handler
```javascript
const Discord = require('discord.js')
const client = new Discord.Client()
let commandHandler = require('@lumap/commandhandler')

let cmdDir="./commands/", ownerID="635383782576357407", helpCommand=true
let handler = new commandHandler(client,cmdDir,ownerID,{helpCommand})


let respondsToBots=false, mentionAsPrefix=true, mentionToKnowPrefix=true
client.on('message', async (msg) => {
    handler.message(msg,prefix="?",{respondsToBots,mentionAsPrefix,mentionToKnowPrefix})
})

client.login("YOUR_TOKEN")
```
N.B.: Everything between the {} are optional arguments. If you don't provide a prefix, it will be set to "!"

# Support #
If you need support, you can join my discord (https://discord.gg/uWzaaEK) and go to the #npm channel