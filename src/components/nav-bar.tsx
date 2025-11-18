import React from 'react'
import Profile from './profile'
import { ThemeToggleButton } from './theme-toggle-button'
import Image from 'next/image'

function NavBar() {
    return (
        <nav className='flex justify-between items-center p-4 border-b-2 border-neutral-100 dark:border-neutral-700 w-full'>
            <div className='flex justify-between items-center gap-4 font-bold text-2xl dark:text-white '>
                <Image src="/logo.png" alt="Devploy" width={40} height={40} className='rounded-full' />
                <h1>
                    Devploy
                </h1>
            </div>
            <div className='flex gap-2'>
                <ThemeToggleButton />
                <Profile />
            </div>
        </nav>
    )
}

export default NavBar