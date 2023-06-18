const tmi = require('tmi.js');

const opts = {
  identity: {
    username: 'duw_bot',
    password: 'oauth:cczz6kowyffslro6osw6w9y3ossq7c'
  },
  channels: [
    'duwinz'
  ]
};

let anser = []
let timeout = false
let timing

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

   if (commandName === '!quiz') {

    if (timeout) {
      client.say(target, `Please wait before running the !quiz command again.`);
      return;
    }

    var [eq, ans] = equation();
    anser.push(ans)
    client.say(target, `Solve this equation!: ${eq}`); 

    timing = setTimeout(() => {
    client.say(target, `No one answered correctly! The answer was: ${anser}`)
    anser = []
   }, 5000) /* <--------- ANSWERING TIMEOUT */

   timeout = true

   setTimeout(() => {
    timeout = false
   }, 10000) /* <--------- QUIZ TIMEOUT */

   } else if (parseInt(msg) === anser[0]){

    client.say(target, `The equation was solved by: ${context['display-name']}`)
    clearTimeout(timing)
    timing = null
    anser = []
    

   }
}


const equation = () => {
    var first = Math.floor(Math.random() * 10)
    var second = Math.floor(Math.random() * 10)
    return [`${first} * ${second}`, first * second]
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}