/**
 * Crypto utilities for AES encryption/decryption
 * Matches the C# SecurityService implementation
 */

// Convert hex string to Uint8Array
function hexToBytes(hex) {
  // Remove any spaces or non-hex characters
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  
  // Ensure even length
  const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
  
  const bytes = new Uint8Array(paddedHex.length / 2);
  for (let i = 0; i < paddedHex.length; i += 2) {
    bytes[i / 2] = parseInt(paddedHex.substr(i, 2), 16);
  }
  return bytes;
}

// Convert base64 string to Uint8Array
function base64ToBytes(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decrypt AES encrypted string
 * @param {string} cipherText - Encrypted string in format "iv:ciphertext"
 * @param {string} key - Hex key string
 * @returns {Promise<string>} - Decrypted plaintext
 */
export async function decryptAES(cipherText, key) {
  try {
    // Split the cipher text to get IV and encrypted data
    const [ivBase64, encryptedBase64] = cipherText.split(':');
    
    if (!ivBase64 || !encryptedBase64) {
      throw new Error('Invalid cipher text format');
    }

    // Convert hex key to bytes
    const keyBytes = hexToBytes(key);
    
    // Validate key length (must be 16 or 32 bytes for AES-128 or AES-256)
    if (keyBytes.length !== 16 && keyBytes.length !== 32) {
      throw new Error(`Invalid AES key length: ${keyBytes.length} bytes. Must be 16 or 32 bytes.`);
    }
    
    console.log('Key length:', keyBytes.length, 'bytes');
    
    // Convert base64 strings to bytes
    const iv = base64ToBytes(ivBase64);
    const encryptedData = base64ToBytes(encryptedBase64);

    console.log('IV length:', iv.length, 'bytes');
    console.log('Encrypted data length:', encryptedData.length, 'bytes');

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      cryptoKey,
      encryptedData
    );

    // Convert decrypted buffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    console.error('Key provided:', key);
    console.error('Key length in hex chars:', key?.length);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

/**
 * Get AES key from environment or configuration
 * In production, this should be securely managed
 */
export function getAESKey() {
  // This should match your C# configuration AES_Key
  // For now, we'll need to get this from your backend configuration
  // You might need to expose this through an API endpoint or environment variable
  return import.meta.env.VITE_AES_KEY || '';
}