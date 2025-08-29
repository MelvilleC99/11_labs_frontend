'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()

  // Auto-generate user ID if not provided
  const generateUserId = () => {
    // Generate a UUID-like string for database compatibility
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    setUserId(uuid)
  }

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Please enter your name')
      return
    }

    const finalUserId = userId.trim() || (() => {
      // Generate UUID if no user ID provided
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    })()
    const cleanName = name.trim()
    
    console.log('Navigating with data:', { name: cleanName, userId: finalUserId })
    
    // Navigate to data collection page with user data as URL params
    const params = new URLSearchParams({
      name: cleanName,
      userId: finalUserId
    })
    
    router.push(`/data-collection?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Enter your details to start chatting with our AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStartChat} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <div className="flex gap-2">
                <Input
                  id="userId"
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateUserId}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-6">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
