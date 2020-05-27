// run with node 

const tmi = require('tmi.js');
var event_dict = {};
var is_event = false;

// Define configuration options
const opts = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: "winwinwinbot",
        password: "oauth:3j3cgx5abzo7rm3gz2di1ua024wjr5",
    },
    channels: [
        "chasehb"
    ],
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();



// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  //context properties: 'badge-info','badges','color','display-name','emotes','flags','id','mod','room-id',
  //                    'subscriber','tmi-sent-ts','turbo','user-id','user-type','emotes-raw','badge-info-raw',
  //                    'badges-raw','username','message-type'
  if (self) { return; } // Ignore messages from the bot
  console.log(Object.keys(context));
  // Remove whitespace from chat message
  const commandName = msg.trim();
  console.log(commandName);

  var words = msg.split(" ");
  if (is_event){
    
    if (words[0] == "!event"){
      if (event_dict[words[1]] in event_dict){
        event_dict[words[1]].push(context.username);
      }
      else{
        event_dict[words[1]] = [context.username];
      }
      
    }
  }

  if (commandName == "!startEvent"){
    startEvent();
  }

  if (commandName == "!endEvent"){
    endEvent();
  }
  if (words[0] == "!getWinner"){
    getWinner(words[1], target);
  }

}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  //client.say("chasehb", "Bot Connected");
  //client.action("chasehb", "1232");
}

function newEvent(title){
  client.say("***New Betting Event***")
}

function startEvent(){
  is_event = true;
}

function endEvent(win_value){
  is_event = false;
}

function getWinner(win_value, target){
  if (win_value in event_dict){
    var win_list = event_dict[win_value];
    console.log(win_list);
    var r = Math.floor(Math.random() * win_list.length);
    console.log(r);
    var winner = win_list[r];
    console.log(winner);
    client.say(target, `The Winner is ${winner}`);
  }
  else{
    client.say(target, "No Winner!");
  }
  
}