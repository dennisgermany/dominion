// Password configuration for the Dominion Card Browser
// Change this password to your desired password
export const PASSWORD = 'changeme'

// Check if password is required based on environment variable
// Password is only required when VITE_REQUIRE_PASSWORD is set to 'true'
// This is typically set during Docker builds
export const REQUIRE_PASSWORD = import.meta.env.VITE_REQUIRE_PASSWORD === 'true'
