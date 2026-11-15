import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma"; // adjust to wherever your PrismaClient lives

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Same message for every failure so we don't leak which part was wrong
    if (!user || user.password !== password || user.role !== "USER") {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await new SignJWT({ role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);

    return NextResponse.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
}