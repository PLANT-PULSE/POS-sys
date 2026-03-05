import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAuditLog = async (
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    details?: any
) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log', error);
    }
};

export const getAuditLogs = async () => {
    return await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true, role: true } },
        },
        take: 100 // Limit to recent 100 logs for performance, pagination can be added
    });
};
