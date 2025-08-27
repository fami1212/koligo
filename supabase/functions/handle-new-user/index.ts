import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    // Create profile for new user
    const { error } = await supabaseClient
      .from('profiles')
      .insert({
        user_id: record.id,
        role: record.raw_user_meta_data?.role || 'client',
        first_name: record.raw_user_meta_data?.first_name,
        last_name: record.raw_user_meta_data?.last_name,
        phone: record.raw_user_meta_data?.phone,
        is_verified: false
      })

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'Profile created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})