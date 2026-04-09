const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {
      name: 'Super Admin',
      vendorName: 'Admin Vendor',
      password: 'superadmin',
      mobile: '0000000000',
      location: 'Head Office'
    },
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      vendorName: 'Admin Vendor',
      password: 'superadmin',
      mobile: '0000000000',
      location: 'Head Office'
    }
  });

  console.log('Superadmin user inserted or updated.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
