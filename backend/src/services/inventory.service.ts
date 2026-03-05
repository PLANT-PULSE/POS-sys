import { PrismaClient, TransactionType } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getTransactions = async (filters: any) => {
    const whereClause: any = {};
    if (filters?.productId) whereClause.productId = filters.productId;
    if (filters?.type) whereClause.type = filters.type;

    return await prisma.inventoryTransaction.findMany({
        where: whereClause,
        include: {
            product: { select: { name: true, sku: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const createTransaction = async (data: {
    productId: string;
    type: TransactionType;
    quantity: number;
    remarks?: string;
}) => {
    const product = await prisma.product.findUnique({
        where: { id: data.productId }
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Calculate new stock
    let newStock = product.stock;
    if (data.type === 'IN') {
        newStock += data.quantity;
    } else if (data.type === 'OUT') {
        if (product.stock < data.quantity) {
            throw new AppError(`Insufficient stock. Current stock: ${product.stock}`, 400);
        }
        newStock -= data.quantity;
    } else if (data.type === 'ADJUSTMENT') {
        // Determine if it's practically IN or OUT or just override. 
        // Here we treat adjustment as an absolute set, meaning quantity becomes the new stock.
        // So the difference is newStock - product.stock
        // But by request, quantity is positive int. Let's assume adjustment sets it directly.
        newStock = data.quantity;
    }

    // Use transaction to ensure both records are saved safely
    const [transaction, updatedProduct] = await prisma.$transaction([
        prisma.inventoryTransaction.create({ data }),
        prisma.product.update({
            where: { id: data.productId },
            data: { stock: newStock }
        })
    ]);

    return { transaction, updatedProduct };
};

export const getLowStockAlerts = async (threshold: number = 10) => {
    return await prisma.product.findMany({
        where: {
            stock: {
                lte: threshold
            },
            isActive: true
        },
        select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
            category: { select: { name: true } }
        }
    });
};
