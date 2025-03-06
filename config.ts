// credential info should move to .env

export const ORTHANC_CONFIG = {
  username: 'admin',
  password: 'admin',
}

// orthanc has authorization header, use base64 encoding
export function generateOrthancAuthorization() {
  return `Basic ${btoa(`${ORTHANC_CONFIG.username}:${ORTHANC_CONFIG.password}`)}`
}