const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'yourserver.aternos.me',
    port: 25565,
    username: 'AFK_Bot'
  });

  bot.on('spawn', () => {
    console.log('Bot joined the server and is AFK + Moving!');
    bot.setControlState('jump', true);
    bot.setControlState('forward', true);
    setInterval(() => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      bot.setControlState('left', direction === 'left');
      bot.setControlState('right', direction === 'right');
    }, 10000);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err);
  });
}

createBot();
