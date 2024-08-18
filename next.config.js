/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    directusBaseUrl: process.env.DIRECTUS_BASE_URL,
    directusToken: process.env.DIRECTUS_TOKEN,
    directusFlowsTriggerWebhook: process.env.DIRECTUS_FLOWS_TRIGGER_WEBHOOK,
    stravaClientId: process.env.STRAVA_CLIENT_ID,
    stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
    stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN,
  },
}

module.exports = nextConfig
