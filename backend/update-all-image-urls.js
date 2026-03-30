const { prisma } = require('./lib/prisma');
const path = require('path');

async function updateAllImageUrls() {
  console.log('🚀 IMMEDIATE FIX: Updating ALL /uploads/... to full localhost:5000 URLs');
  
  const complaints = await prisma.complaint.findMany({ 
    where: { 
      imageUrl: { 
        startsWith: '/uploads/',
        not: null 
      } 
    } 
  });
  
  console.log(`Found ${complaints.length} complaints to fix`);
  
  let fixed = 0;
  for (const c of complaints) {
    const newUrl = `http://localhost:5000${c.imageUrl}`;
    await prisma.complaint.update({
      where: { id: c.id },
      data: { imageUrl: newUrl }
    });
    console.log(`✅ FIXED ${c.id.slice(0,8)} → ${newUrl.slice(0,50)}...`);
    fixed++;
  }
  
  console.log(`\n🎉 ALL ${fixed} imageUrls updated to full backend URLs!`);
  console.log('Restart frontend and test dashboard - ZERO 404s!');
}

updateAllImageUrls()
  .then(() => prisma.$disconnect())
  .catch(console.error);

