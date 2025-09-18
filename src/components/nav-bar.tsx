import React from 'react'
import Profile from './profile'
import { ThemeToggleButton } from './theme-toggle-button'

function NavBar() {
    return (
        <nav className='flex justify-between items-center p-4 border-b-2 border-neutral-100 dark:border-neutral-700 w-full'>
            <div className='font-bold text-2xl dark:text-white'>Devploy</div>
            <div className='flex gap-2'>
                <ThemeToggleButton />
                <Profile />
            </div>
        </nav>
    )
}

export default NavBar