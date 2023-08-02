const tmi = require('tmi.js');
const sqlite3 = require('sqlite3').verbose();
let sql


let db = new sqlite3.Database('./chatUsers.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

/* sql = `CREATE TABLE users(id INTEGER PRIMARY KEY,username,points)` */

/* db.run("DROP TABLE users"); */


/* IDEA FOR TOO SLOW DB ADDING!!!!!!!!!!!! 
MAKE IT SO PEOPLE COULD ALSO TYPE !ADDME THEN IT WILL AUTOMATICALLY ADD THEM */



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

client.on("join", (channel, username, self) => {

  sql = `INSERT INTO users(username,points) VALUES (?,0)`
  db.run(sql,[username],(err)=>{
    if (err) return console.error(err.message)
  });
  sql = `SELECT * FROM users;`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach(row =>{
      console.log(row)
    })
  })
});




/* client.on("part", (channel, username, self) => {
  console.log(username)
}); */

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

/*   console.log(target)
 */
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

   if (commandName === '!coinflip') {
    if (timeout) {
      client.say(target, `Please wait before running the !coinflip command again.`);
      return;
    }
    if (Math.round(Math.random()) > 0) {
      client.say(target, `Tails!`)
      timeout = true
      setTimeout(() => {
        timeout = false
       }, 10000)
    } else {
      client.say(target, `Heads!`)
      timeout = true
      setTimeout(() => {
        timeout = false
       }, 10000)
    }
 
   }
}


const equation = () => {
    var first = Math.floor(Math.random() * 15)
    var second = Math.floor(Math.random() * 15)
    return [`${first} * ${second}`, first * second]
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
/*   client.say("#duwinz",`Hi Chat. I am Live!`)
 */
}

/* db.close(); */