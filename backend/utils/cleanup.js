const fs = require('fs-extra');
const path = require('path');

// Cleanup old uploads daily
const cleanupUploads = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.remove(filePath);
        console.log('Cleaned:', file);
      }
    }
  }
};

module.exports = cleanupUploads;

