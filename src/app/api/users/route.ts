import { NextRequest, NextResponse } from 'next/server'
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

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password || !role) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const user = await prisma.user.create({
        data: { name, email, password, role },
    })

    return NextResponse.json({ success: true, message: 'User Added Successfully', data: user })
}