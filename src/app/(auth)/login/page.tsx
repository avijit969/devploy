"use client"
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import React from 'react'
import { toast } from 'sonner'

function login() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Devploy</h1>
        <p className="text-lg text-center mt-2">
          Devploy is a platform for developers to deploy their applications
        </p>
        <Button onClick={() => authClient.signIn.social({
          provider: "github",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged in successfully")
            },
            onError: () => {
              toast.error("Failed to log in")
            }
          }
        })}>Sign in with GitHub</Button>
      </div>
    </main>
  )
}

export default login