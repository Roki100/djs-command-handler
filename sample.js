const Discord = require('discord.js')
const client = new Discord.Client()
let commandHandler = require('./index')

let cmdDir="./commands/", ownerID="635383782576357407", helpCommand=true
let handler = new commandHandler(client,cmdDir,ownerID,{helpCommand})


let respondsToBots=false, mentionAsPrefix=true, mentionToKnowPrefix=true
client.on('message', async (msg) => {
    handler.message(msg,prefix="?",{respondsToBots,mentionAsPrefix,mentionToKnowPrefix})
})

client.login("YOUR_TOKEN")