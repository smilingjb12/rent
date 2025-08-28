'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions } from "@convex-dev/auth/react"

function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuthActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await signIn("password", { email, password, flow: "signIn" })
      
      // Get the return URL from query params, default to home
      const returnUrl = searchParams.get('returnUrl') || '/'
      router.push(returnUrl)
    } catch (err) {
      setError("Invalid email or password")
      console.error("Sign in error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl border border-border bg-card/90 backdrop-blur shadow-sm">
        <div>
          <h2 className="mt-2 text-center text-3xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Please sign in to access admin features
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-input bg-card placeholder:text-muted-foreground/70 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring focus:z-10 text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-input bg-card placeholder:text-muted-foreground/70 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring focus:z-10 text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-border text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 rounded-2xl border border-border bg-card/90 backdrop-blur shadow-sm">
          <div>
            <h2 className="mt-2 text-center text-3xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
