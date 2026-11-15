import React from 'react'

export default function Section({ children }: { children: React.ReactNode }) {
    return (
        <div className='mt-5'>
            {children}
        </div>
    )
}
