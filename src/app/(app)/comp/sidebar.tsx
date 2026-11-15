'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/users' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64  bg-gradient-to-b from-backgroundPrimary to-backgroundPrimary/50 min-h-screen flex flex-col">
            <div className="p-6 h-[80px] text-textWhite text-xl font-bold border-b border-b-borderColor">
                Admin Panel
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                            ? 'bg-backgroundTertiary/15 text-textWhite'
                            : 'text-textWhite hover:bg-backgroundTertiary/15'
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 items-center border-t flex border-borderColor">
                <Button
                    className={'bg-textWhite'}
                    size={'lg'}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    variant={'destructive'}
                >
                    Logout
                </Button>
            </div>
        </aside>
    )
}