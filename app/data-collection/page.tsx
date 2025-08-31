'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Globe, LinkedinIcon } from 'lucide-react'

function DataCollectionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [companyUrl, setCompanyUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const name = searchParams.get('name')
  const userId = searchParams.get('userId')

  // Redirect if no user data
  if (!name || !userId) {
    router.push('/')
    return null
  }

  const handleBackToLogin = () => {
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Company URL is now optional - removed validation
    setIsLoading(true)

    try {
      // Only call scraping if there's a company URL
      if (companyUrl.trim()) {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyUrl: companyUrl.trim(),
            linkedinUrl: linkedinUrl.trim(),
            userId: userId,
            name: name
          }),
        })

        if (response.ok) {
          console.log('✅ Scraping initiated successfully')
        } else {
          console.log('⚠️  Scraping failed, but continuing to Step 2')
        }
      } else {
        console.log('⚠️  No company URL provided, skipping scraping')
      }
    } catch (error) {
      console.error('Error triggering scraping:', error)
      console.log('⚠️  Scraping not available yet, continuing to Step 2')
    } finally {
      setIsLoading(false)
      
      // Navigate to the persona building (chat) page regardless of scraping result
      const params = new URLSearchParams({
        name: name,
        userId: userId
      })
      
      router.push(`/chat?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLogin}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome {name}!
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            ID: {userId}
          </div>
        </div>
      </div>

      {/* Data Collection Container */}
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Step 1</CardTitle>
            <CardDescription>
              Please provide your company information to help us build your personalized business coach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyUrl" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Company Website URL (Optional)
                </Label>
                <Input
                  id="companyUrl"
                  type="url"
                  placeholder="https://your-company.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  className="text-base"
                />
                <p className="text-sm text-gray-600">
                  We'll analyze your company website to understand your business better (optional)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn Profile URL (Optional)
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="text-base"
                />
                <p className="text-sm text-gray-600">
                  Help us understand your professional background
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-8 py-3 text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Continue to Step 2'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DataCollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DataCollectionContent />
    </Suspense>
  )
}
