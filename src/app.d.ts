import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { MqttClient } from 'mqtt';
import webpush from 'web-push';
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      mqttClient: MqttClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
      webpush: webpush,
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}