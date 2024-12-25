const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;
const { Vec3 } = require('vec3');

const bot = mineflayer.createBot({
  host: 'your.server.ip', // Server IP
  port: 25565,            // Server port
  username: 'BotUsername', // Bot ka username
  password: 'BotPassword', // Agar necessary ho to
  version: '1.18.2'        // Server ka Minecraft version
});

// Plugins load karna
bot.loadPlugin(pathfinder);

// Bot ke spawn hone par
bot.once('spawn', () => {
  const defaultMove = new Movements(bot);
  bot.pathfinder.setMovements(defaultMove);
  startBotActivities();
});

// Bot activities start karna
function startBotActivities() {
  setInterval(() => {
    if (bot.players.length === 0) {
      // Agar server par koi nahi hai, tab bhi kaam continue kare
      performRandomTask();
    } else {
      // Server par players hain, to unke sath interact kare
      performRandomTask();
    }
  }, 60000); // Har 60 seconds mein ek task perform kare
}

// Random task perform karna
function performRandomTask() {
  const tasks = [chopTree, mineResources];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  task();
}

// Tree chop karna
function chopTree() {
  const treeBlock = bot.findBlock({
    matching: block => block.name.includes('log'),
    maxDistance: 32
  });

  if (treeBlock) {
    bot.pathfinder.setGoal(new GoalNear(treeBlock.position.x, treeBlock.position.y, treeBlock.position.z, 1));
    bot.dig(treeBlock, (err) => {
      if (err) {
        console.log('Tree chopping failed:', err);
      } else {
        console.log('Tree chopped successfully.');
      }
    });
  } else {
    console.log('No trees found nearby.');
  }
}

// Mining karna
function mineResources() {
  const oreBlock = bot.findBlock({
    matching: block => ['iron_ore', 'coal_ore'].includes(block.name),
    maxDistance: 32
  });

  if (oreBlock) {
    bot.pathfinder.setGoal(new GoalNear(oreBlock.position.x, oreBlock.position.y, oreBlock.position.z, 1));
    bot.dig(oreBlock, (err) => {
      if (err) {
        console.log('Mining failed:', err);
      } else {
        console.log('Resource mined successfully.');
      }
    });
  } else {
    console.log('No ores found nearby.');
  }
}

// Errors handle karna
bot.on('error', (err) => {
  console.log('Bot encountered an error:', err);
});

bot.on('end', () => {
  console.log('Bot disconnected from the server.');
});
