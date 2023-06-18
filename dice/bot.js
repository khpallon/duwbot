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

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

client.on('connected', (channel, tags, message, self) => {
	// "Alca: Hello, World!"
	console.log(`hor`);
});


// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

   if (commandName === '!quiz') {

    var [eq, ans] = equation();
    anser.push(ans)
    client.say(target, `Solve this equation!: ${eq}`); 

   } else if (parseInt(msg) === anser[0]){

    client.say(target, `${context['display-name']} solved the equation!`)
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