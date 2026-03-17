import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmcoohnibrfstqkmysmb.supabase.co'
const supabaseKey = 'sb_publishable_Tw4xPOJfaz2c4cjAMKr9qw_3stnCOvr'

export const supabase = createClient(supabaseUrl, supabaseKey)
