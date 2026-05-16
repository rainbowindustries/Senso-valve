import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Key is missing in .env')
}

// Service role client — full access — only use in backend
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default supabase