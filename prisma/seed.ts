import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'admin_panel',
})

const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin123',
            role: 'ADMIN',
        },
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())