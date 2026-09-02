const { Collection } = require('discord.js');
const cooldowns = new Collection();
function checkCooldown(commandName, userId, cooldownSeconds) {
  const now = Date.now();
  const cooldownAmount = cooldownSeconds * 1000;
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }
  const timestamps = cooldowns.get(commandName);
  const userCooldown = timestamps.get(userId);
  if (userCooldown && now < userCooldown + cooldownAmount) {
    const timeLeft = ((userCooldown + cooldownAmount - now) / 1000).toFixed(1);
    return { allowed: false, timeLeft };
  }
  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownAmount);
  return { allowed: true };
}
module.exports = { checkCooldown };
