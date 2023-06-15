const tmi = require('tmi.js');

// Define configuration options
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

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();
  console.log(msg.trim() === anser)
  console.log(msg)

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);

  } else if (commandName === '!quiz') {

    var [eq, ans] = equation();
    anser.push(ans)
    console.log(anser[0])
    client.say(target, `Solve this equation!: ${eq}`); 

   } else if (parseInt(msg) === anser[0]){

    client.say(target, `Correct answer!`)
    anser = []

   } else {

    console.log(`* Unknown command ${commandName}`);

  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
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