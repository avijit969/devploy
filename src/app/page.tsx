"use client"
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

function Home() {
  const router = useRouter();
  return (
    <main>
      <div className="relative flex h-[100vh] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          )}
        />

        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            Devploy <br /> Your Code Our Infrastructure
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-base font-normal text-neutral-300">
            Connect your GitHub repo and deploy instantly on secure, scalable infrastructure.
            Code, push, and let Devploy handle the rest.
          </p>
          <div className='flex justify-center mt-6'>
            <Button onClick={
              () => router.push("/dashboard")
            }>Start Deploying <ArrowRightIcon /></Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home