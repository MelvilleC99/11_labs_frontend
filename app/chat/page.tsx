'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  
  // Agent selection state
  const [selectedAgent, setSelectedAgent] = useState('value_architect')
  
  // Agent configurations
  const agents = {
    value_architect: {
      id: 'agent_01k0ryjxvrfc2a2hwp4sy6n55c',
      name: 'Value Architect',
      description: 'Build your core business foundation (9 questions)'
    },
    positioning_strategist: {
      id: 'agent_6801k3tfx6gyfjta3qt8cfxwas6s', 
      name: 'Positioning Strategist',
      description: 'Define your differentiation & communication style (13 questions)'
    },
    growth_architect: {
      id: 'agent_7901k3xnynzge67v88mrp64f8yv7',
      name: 'Growth Architect', 
      description: 'Architect your content strategy & vision (11 questions)'
    }
  }

  const name = searchParams.get('name')
  const userId = searchParams.get('userId')

  useEffect(() => {
    // Redirect to login if no user data
    if (!name || !userId) {
      console.error('Missing required user data - redirecting to login')
      router.push('/')
      return
    }

    // Validate that we have non-empty strings
    if (name.trim() === '' || userId.trim() === '') {
      console.error('Empty user data detected - redirecting to login')
      router.push('/')
      return
    }

    console.log("=== FRONTEND DEBUG ===");
    console.log("Name from URL:", name);
    console.log("UserID from URL:", userId);
    console.log("========================");

    // Load ElevenLabs script and create widget
    const loadElevenLabsWidget = async () => {
      if (scriptLoadedRef.current) return

      try {
        // Check if script is already loaded
        const existingScript = document.querySelector('script[src*="convai-widget-embed"]')
        if (existingScript) {
          console.log('ElevenLabs script already exists, creating widget...')
          setTimeout(() => createWidget(), 100)
          return
        }

        console.log('Loading ElevenLabs script...')
        
        // Create and load the ElevenLabs script
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
        script.type = 'module'
        script.crossOrigin = 'anonymous'
        
        script.onload = () => {
          console.log('ElevenLabs script loaded successfully')
          scriptLoadedRef.current = true
          // Add a delay to ensure the script is fully initialized
          setTimeout(() => {
            createWidget()
          }, 500)
        }
        
        script.onerror = (error) => {
          console.error('Failed to load ElevenLabs script:', error)
          console.error('Script src:', script.src)
          // Try alternative approach
          tryAlternativeLoad()
        }
        
        document.head.appendChild(script)
      } catch (error) {
        console.error('Error in loadElevenLabsWidget:', error)
        tryAlternativeLoad()
      }
    }

    const tryAlternativeLoad = () => {
      console.log('Trying alternative script loading method...')
      
      // Try loading without module type
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      script.async = true
      
      script.onload = () => {
        console.log('Alternative script load successful')
        scriptLoadedRef.current = true
        setTimeout(() => createWidget(), 500)
      }
      
      script.onerror = (error) => {
        console.error('Alternative script load also failed:', error)
        showErrorMessage()
      }
      
      document.head.appendChild(script)
    }

    const createWidget = () => {
      try {
        if (!widgetContainerRef.current) {
          console.error('Widget container not found')
          return
        }

        // Ensure we have both required values
        if (!name || !userId) {
          console.error('Missing required user data:', { name, userId })
          return
        }

        console.log('Creating widget...')

        // Clear any existing widget
        widgetContainerRef.current.innerHTML = ''

        // Create dynamic variables object with EXACT format required by ElevenLabs
        const userData = {
          user_id: userId,
          user_name: name
        }

        console.log("Creating userData:", userData);

        console.log('=== DEBUG DYNAMIC VARIABLES ===')
        console.log('userData object:', userData)
        console.log('JSON stringified:', JSON.stringify(userData))
        console.log('================================')

        // Create the widget element
        const widget = document.createElement('elevenlabs-convai')
        widget.setAttribute('agent-id', agents[selectedAgent].id)
        widget.setAttribute('dynamic-variables', JSON.stringify(userData))

        console.log('Widget attributes set:')
        console.log('- agent-id:', widget.getAttribute('agent-id'))
        console.log('- dynamic-variables:', widget.getAttribute('dynamic-variables'))

        // Add styling to ensure the widget is visible
        widget.style.width = '100%'
        widget.style.height = '500px'
        widget.style.minHeight = '500px'
        widget.style.display = 'block'

        // Append to container
        widgetContainerRef.current.appendChild(widget)
        
        console.log('ElevenLabs widget created and appended to DOM')
        console.log('Widget attributes set:')
        console.log('- agent-id:', widget.getAttribute('agent-id'))
        console.log('- dynamic-variables:', widget.getAttribute('dynamic-variables'))

        // Add a listener for widget events if available
        widget.addEventListener('error', (error) => {
          console.error('Widget error:', error)
        })

        // Add a listener for widget events if available
        widget.addEventListener('error', (error) => {
          console.error('Widget error:', error)
        })

      } catch (error) {
        console.error('Error creating widget:', error)
        showErrorMessage()
      }
    }

    const showErrorMessage = () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = `
          <div class="text-center text-red-600 p-8">
            <h3 class="text-lg font-semibold mb-2">Failed to Load AI Assistant</h3>
            <p class="text-sm">There was an error loading the conversational AI widget.</p>
            <p class="text-sm mt-2">Please check the console for more details or try refreshing the page.</p>
          </div>
        `
      }
    }

    loadElevenLabsWidget()

    // Cleanup function
    return () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = ''
      }
    }
  }, [name, userId, router, selectedAgent]) // Added selectedAgent dependency

  const handleBackToLogin = () => {
    router.push('/')
  }

  if (!name || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
        </div>
      </div>
    )
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

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-medium text-gray-900">Step 2: Building Your Persona</h2>
            <p className="text-sm text-gray-600 mt-1">
              Have a discussion with our business coach. Select an agent below to start your conversation.
            </p>
            
            {/* Agent Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Agent:
              </label>
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                {Object.entries(agents).map(([key, agent]) => (
                  <option key={key} value={key}>
                    {agent.name} - {agent.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Widget Container */}
          <div className="flex-1 p-4">
            <div 
              ref={widgetContainerRef}
              className="w-full h-full min-h-[500px] flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading AI Assistant...</p>
                <p className="text-xs mt-2">If this takes too long, check the browser console for errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
