import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyUrl, linkedinUrl, userId, name } = body

    console.log('=== SCRAPE API ENDPOINT ===')
    console.log('Received data:', { companyUrl, linkedinUrl, userId, name })
    
    // TODO: Replace with your actual backend URL
    // This should be your ngrok URL or wherever your Flask backend is running
    const BACKEND_URL = process.env.BACKEND_URL || 'https://e6d3e6a08627.ngrok-free.app'
    
    console.log('Sending to backend:', BACKEND_URL)
    
    // Send the data to your Flask backend
    const response = await fetch(`${BACKEND_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_url: companyUrl,
        linkedin_url: linkedinUrl,
        user_id: userId,
        user_name: name
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Backend response:', result)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error in scrape API:', error)
    return NextResponse.json(
      { error: 'Failed to process scraping request' },
      { status: 500 }
    )
  }
}
