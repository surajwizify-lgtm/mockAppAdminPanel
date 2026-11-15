
import React from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'


export default function Model({ children, open, size = 'md', title, onClose }: { children: React.ReactNode, open: boolean, title: string, size?: 'sm' | 'md' | 'lg', onClose: () => void }) {
    const SizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    }
    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && onClose()} open={open}>
            <DialogContent className={SizeClasses[size]}>
                <DialogHeader>{title}</DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
