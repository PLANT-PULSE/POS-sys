import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pos.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@pos.com',
            password: hashedPassword,
            role: Role.Admin,
        },
    });
    console.log('Admin user seeded:', admin.email);

    // 2. Create Categories
    const category1 = await prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
            name: 'Electronics',
            description: 'Electronic devices and accessories',
        },
    });

    const category2 = await prisma.category.upsert({
        where: { name: 'Groceries' },
        update: {},
        create: {
            name: 'Groceries',
            description: 'Daily food items',
        },
    });
    console.log('Categories seeded');

    // 3. Create Products
    await prisma.product.upsert({
        where: { sku: 'ELEC-001' },
        update: {},
        create: {
            name: 'Wireless Mouse',
            sku: 'ELEC-001',
            price: 25.99,
            stock: 50,
            categoryId: category1.id,
        },
    });

    await prisma.product.upsert({
        where: { sku: 'GROC-001' },
        update: {},
        create: {
            name: 'Whole Milk 1L',
            sku: 'GROC-001',
            price: 1.99,
            stock: 100,
            categoryId: category2.id,
        },
    });
    console.log('Products seeded');

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
