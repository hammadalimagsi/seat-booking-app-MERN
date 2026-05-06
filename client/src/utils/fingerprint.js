import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedFingerprint = null;

export const getFingerprint = async () => {
  if (cachedFingerprint) return cachedFingerprint;

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedFingerprint = result.visitorId;
    return cachedFingerprint;
  } catch (error) {
    console.error('Fingerprint error:', error);
    // Fallback: generate a random ID and store in localStorage
    let fallback = localStorage.getItem('device_fp');
    if (!fallback) {
      fallback = 'fp_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
      localStorage.setItem('device_fp', fallback);
    }
    cachedFingerprint = fallback;
    return cachedFingerprint;
  }
};
