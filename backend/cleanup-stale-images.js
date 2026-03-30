const fs = require('fs');
const path = require('path');
const { prisma } = require('./lib/prisma');

async function cleanupStaleImageUrls() {
  console.log('🧹 Cleaning stale LOCAL imageUrls (skip Cloudinary)...');
  
  const uploadsDir = path.join(__dirname, 'uploads');
  let validFiles = new Set();
  
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    validFiles = new Set(files);
    console.log(`📁 Found ${validFiles.size} local upload files`);
  } else {
    console.log('⚠️ uploads/ dir not found - skip local cleanup');
    return;
  }
  
  const complaints = await prisma.complaint.findMany({
    where: { imageUrl: { not: null } }
  });
  
  console.log(`🔍 Found ${complaints.length} complaints with imageUrl`);
  
  let cleaned = 0;
  let kept = 0;
  let cloudinarySkipped = 0;
  
  for (const c of complaints) {
    // Skip Cloudinary URLs
    if (c.imageUrl && (c.imageUrl.includes('res.cloudinary.com') || c.imageUrl.includes('cloudinary.com'))) {
      console.log(`☁️ SKIPPED Cloudinary: ${c.imageUrl.slice(0,50)}... for ${c.id.slice(0,8)}`);
      cloudinarySkipped++;
      continue;
    }
    
    let filename = null;
    
    // Extract filename from LOCAL imageUrl only
    if (c.imageUrl) {
      if (c.imageUrl.startsWith('http://') || c.imageUrl.startsWith('https://')) {
        try {
          const url = new URL(c.imageUrl);
          filename = path.basename(url.pathname);
        } catch (e) {
          filename = null;
        }
      } else {
        filename = path.basename(c.imageUrl);
      }
    }
    
    if (filename && validFiles.has(filename)) {
      console.log(`✅ KEPT local ${c.imageUrl.slice(0,30)}... for ${c.id.slice(0,8)}`);
      kept++;
    } else if (filename) {
      await prisma.complaint.update({
        where: { id: c.id },
        data: { imageUrl: null, imagePublicId: null }
      });
      console.log(`🗑️ CLEARED local ${c.imageUrl.slice(0,30)}... for ${c.id.slice(0,8)}`);
      cleaned++;
    } else if (c.imageUrl) {
      console.log(`⚠️ SKIPPED invalid local: ${c.imageUrl.slice(0,30)}... for ${c.id.slice(0,8)}`);
    }
  }
  
  console.log(`✨ Cleanup complete:`);
  console.log(`  🗑️ ${cleaned} local cleared`);
  console.log(`  ✅ ${kept} local kept`);
  console.log(`  ☁️ ${cloudinarySkipped} Cloudinary skipped`);
}

cleanupStaleImageUrls()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

