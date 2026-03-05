import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const prisma = new PrismaClient();

export const getDailyReport = async (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();

    const sales = await prisma.sale.findMany({
        where: {
            createdAt: {
                gte: startOfDay(date),
                lte: endOfDay(date)
            },
            status: 'COMPLETED'
        },
        include: { items: true }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
    const totalSalesCount = sales.length;

    return { totalRevenue, totalSalesCount, date: startOfDay(date).toISOString() };
};

export const getWeeklyReport = async () => {
    const date = new Date();

    const sales = await prisma.sale.findMany({
        where: {
            createdAt: {
                gte: startOfWeek(date),
                lte: endOfWeek(date)
            },
            status: 'COMPLETED'
        }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);

    return { totalRevenue, totalSalesCount: sales.length, startDate: startOfWeek(date).toISOString(), endDate: endOfWeek(date).toISOString() };
};

export const getMonthlyReport = async () => {
    const date = new Date();

    const sales = await prisma.sale.findMany({
        where: {
            createdAt: {
                gte: startOfMonth(date),
                lte: endOfMonth(date)
            },
            status: 'COMPLETED'
        }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);

    return { totalRevenue, totalSalesCount: sales.length, startDate: startOfMonth(date).toISOString(), endDate: endOfMonth(date).toISOString() };
};

export const getTopSellingProducts = async (limit: number = 5) => {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const topItems = await prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
            subtotal: true
        },
        where: {
            sale: {
                createdAt: {
                    gte: thirtyDaysAgo
                },
                status: 'COMPLETED'
            }
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: limit
    });

    // Fetch product details for the grouped IDs
    const products = await prisma.product.findMany({
        where: {
            id: { in: topItems.map(item => item.productId) }
        },
        select: { id: true, name: true, sku: true }
    });

    return topItems.map(item => ({
        product: products.find(p => p.id === item.productId),
        totalQuantitySold: item._sum.quantity,
        totalRevenueGenerated: item._sum.subtotal
    }));
};
