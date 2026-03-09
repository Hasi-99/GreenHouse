import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@greenhouse-resort.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, guestEmail, guestName, roomName, price, checkIn, checkOut } = await req.json()

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.log("Email would be sent (Resend API key not configured):", {
        action, guestEmail, guestName, roomName, price, checkIn, checkOut
      })
      return new Response(JSON.stringify({ 
        message: "Email simulated (API key not configured)",
        details: { action, guestEmail, guestName, roomName }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    let subject = ''
    let htmlContent = ''

    // 1. Determine Email Content based on Action
    if (action === 'booking') {
      subject = `Booking Confirmation: ${roomName} at Green House Resort`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1a2e1a; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d5a27; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Green House Resort</h1>
          </div>
          <div style="padding: 30px; background: #f4f7f4;">
            <h2>Hello ${guestName},</h2>
            <p>Thank you for choosing Green House Resort! Your booking is confirmed.</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Booking Details</h3>
              <p><strong>Room:</strong> ${roomName}</p>
              <p><strong>Check-in:</strong> ${checkIn}</p>
              <p><strong>Check-out:</strong> ${checkOut}</p>
              <p><strong>Total Price:</strong> $${price}</p>
            </div>
            
            <p>We look forward to hosting you in our forest retreat!</p>
            <p>Best regards,<br>The Green House Resort Team</p>
          </div>
          <div style="background: #1a2e1a; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Green House Resort - Where Nature Meets Luxury</p>
          </div>
        </div>
      `
    } else if (action === 'cancellation') {
      subject = `Booking Cancelled: ${roomName}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1a2e1a; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d5a27; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Green House Resort</h1>
          </div>
          <div style="padding: 30px; background: #f4f7f4;">
            <h2>Hello ${guestName},</h2>
            <p>Your booking for the ${roomName} has been successfully cancelled as requested.</p>
            <p>We hope to welcome you to the forest another time.</p>
            <p>Best regards,<br>The Green House Resort Team</p>
          </div>
        </div>
      `
    }

    // 2. Send Email via Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Green House Resort <reservations@greenhouse-resort.com>',
        to: [guestEmail],
        bcc: [ADMIN_EMAIL],
        subject: subject,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Resend API error:", data)
      return new Response(JSON.stringify({ error: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: res.status,
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

