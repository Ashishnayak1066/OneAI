import React, { useState, useEffect, useRef } from "react"
import { Link } from "wouter"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { MessageSquare, Lock, Mail, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup, handleGoogleCredential } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
    if (existingScript) {
      setGoogleScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => setGoogleScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (googleScriptLoaded && window.google && googleButtonRef.current) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID not configured")
        return
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          setIsLoading(true)
          setError("")
          try {
            await handleGoogleCredential(response.credential)
          } catch (err: any) {
            setError(err.message || "Google sign-in failed")
          } finally {
            setIsLoading(false)
          }
        },
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 350,
        text: "signup_with",
        shape: "rectangular",
      })
    }
  }, [googleScriptLoaded, handleGoogleCredential])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await signup(email, name, password)
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl" />

      <Card className="w-[400px] z-10 bg-card/50 backdrop-blur border-border shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to get started with Trimodels</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="pl-10 bg-background/50 border-border" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email"
                  placeholder="you@example.com" 
                  className="pl-10 bg-background/50 border-border" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 bg-background/50 border-border" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>Already have an account? <Link href="/login" className="text-primary cursor-pointer hover:underline">Sign In</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}
