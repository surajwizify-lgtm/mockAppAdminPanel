import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function GET(req: Request) {
    const auth = req.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, secret);
        const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
        if (!user || user.role !== "USER") throw new Error("invalid");
        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}