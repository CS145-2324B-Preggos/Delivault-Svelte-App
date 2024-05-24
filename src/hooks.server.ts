import { createServerClient } from '@supabase/ssr'
import { error, type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { MQTT_BROKER_URL, MQTT_BROKER_PRT, MQTT_USERNAME, MQTT_PASSWORD } from '$env/static/private'
import mqtt, { type IClientOptions } from 'mqtt'
import { onReceived } from '$lib/server/MQTT'

// On server startup, set up the client

const options: IClientOptions = {
  host: MQTT_BROKER_URL,
  port: parseInt(MQTT_BROKER_PRT),
  protocol: 'mqtts',
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  keepalive: 15,
}

// Initialize and connect the mqtt client
const client = mqtt.connect(options)
client.subscribe('cs145/test')
client.publish("sys/log", "Hello, world!")

client.on(
  'connect',
  () => console.log("Connected the server to the broker!")
)

client.on(
  'error',
  (mqtt_err) => error(500, mqtt_err.message)
)

client.on(
  'message',
  (topic: string, payload: Buffer) => onReceived(client, topic, payload)
)

// Before the server is killed, disconnect the client 

process.on('exit', () => client.end());

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' })
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' })
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    return redirect(303, '/auth')
  }

  if (event.locals.session && event.url.pathname === '/auth') {
    return redirect(303, '/private')
  }

  return resolve(event)
}

const mqttClient: Handle = async({event, resolve}) => {
  if(!event.locals.session || !event.locals.user) return resolve(event)

  event.locals.mqttClient = client
  client.publish("sys/log", "Hello, world!")

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard, mqttClient)