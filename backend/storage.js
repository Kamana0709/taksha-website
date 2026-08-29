const { createClient } = require('@supabase/supabase-js');

// These must be provided in the environment:
// SUPABASE_URL: e.g. https://mgynwbcqmzpbcwdxnlsm.supabase.co
// SUPABASE_SERVICE_ROLE_KEY: Service role key for backend-only usage to bypass RLS
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a single supabase client for interacting with your database
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Upload a file buffer to Supabase Storage
 * @param {string} bucketName - 'certificates' or 'submissions'
 * @param {string} filePath - The destination path in the bucket (e.g., '123-abc.pdf')
 * @param {Buffer} fileBuffer - The file content
 * @param {string} contentType - e.g., 'application/pdf'
 * @returns {Promise<string>} The path to the uploaded file
 */
async function uploadFile(bucketName, filePath, fileBuffer, contentType) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) {
    throw error;
  }
  
  return data.path;
}

/**
 * Get a public URL for a file (for public buckets like 'certificates')
 * @param {string} bucketName 
 * @param {string} filePath 
 * @returns {string} Public URL
 */
function getPublicUrl(bucketName, filePath) {
  if (!supabase) return null;
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Get a signed URL for a file (for private buckets like 'submissions')
 * @param {string} bucketName 
 * @param {string} filePath 
 * @param {number} expiresIn - Expiration in seconds (default 10 years for this migration)
 * @returns {Promise<string>} Signed URL
 */
async function getSignedUrl(bucketName, filePath, expiresIn = 315360000) {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);
    
  if (error) {
    throw error;
  }
  return data.signedUrl;
}

module.exports = {
  supabase,
  uploadFile,
  getPublicUrl,
  getSignedUrl
};
