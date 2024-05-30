import type { PageServerLoad } from './$types';
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

let supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

export const load: PageServerLoad = async () => {
    const { data } = await supabase.from("order").select();
    return {
      orders: data ?? [],
    };
}
