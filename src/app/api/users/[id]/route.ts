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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { name, email, password, role } = body
    const { id: rawId } = await params
    const userId = await parseInt(rawId)

    const user = await prisma.user.update({
        where: { id: userId },
        data: { name, email, password, role },
    })

    return NextResponse.json({ success: true, message: 'User updated Successfully', data: user })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params
    const userId = parseInt(rawId)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role == 'ADMIN') {
        return NextResponse.json({ success: false, message: 'Admin Can not be deleted', data: null })
    }

    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true, message: 'User is deleted Successfully', data: null })
}