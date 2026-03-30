const { prisma } = require('./lib/prisma');
const path = require('path');

async function fixImageUrls() {
  console.log('🔧 Fixing imageUrls to full backend URLs...');
  
  const complaints = await prisma.complaint.findMany({ 
    where: { imageUrl: { not: null } } 
  });
  
  let updated = 0;
  let skipped = 0;
  
  for (const c of complaints) {
    if (c.imageUrl && !c.imageUrl.startsWith('http')) {
      const filename = path.basename(c.imageUrl);
      const newUrl = `http://localhost:5000/uploads/${filename}`;
      await prisma.complaint.update({
        where: { id: c.id },
        data: { imageUrl: newUrl }
      });
      console.log(`✅ Fixed ${c.id.slice(0,8)}: ${newUrl.slice(0,50)}...`);
      updated++;
    } else {
      console.log(`⏭️  Skipped ${c.id.slice(0,8)}: ${c.imageUrl.slice(0,30)}...`);
      skipped++;
    }
  }
  
  console.log(`\n✨ Complete: ${updated} updated, ${skipped} skipped`);
}

fixImageUrls()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

