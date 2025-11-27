import screenshot from 'screenshot-desktop';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cron.schedule('* * * * *', () => {
  // every minute
  const filePath = path.join(__dirname, `screenshot_${Date.now()}.jpg`);
  screenshot({ filename: filePath })
    .then(imgPath => {
      console.log('Screenshot saved:', imgPath);
    })
    .catch(err => {
      console.error('Error taking screenshot:', err);
    });
});

console.log('Cron job started... taking screenshots every minute');

setInterval(() => {
  screenshot({ filename: `full_${Date.now()}.png` });
}, 5000); // every 5 seconds

screenshot.listDisplays().then(displays => {
  displays.forEach(display => {
    screenshot({ screen: display.id, filename: `screen_${display.id}.png` });
  });
});
