import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { writable, type Writable } from 'svelte/store';

export const supabaseFront: Writable<SupabaseClient> = writable(
	createClient(
		'https://agdecwzqfgqljiqmrljx.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZGVjd3pxZmdxbGppcW1ybGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1NTMwODYsImV4cCI6MjAzMDEyOTA4Nn0.WoEITEshKx5WF5vq_V9ICAdAnfP0m3mwxxRi_1ZFDMk'
	)
);
