/* ==========================================================================
   DATABASE MIGRATION SCRIPT (EXECUTED BY AUDREY VIA GITHUB CODESPACES)
   Description: Migrated custom phrase icons from Base64 to Vercel Blob CDN.
   Status: ARCHIVED / DISABLED (Uncomment only if manual re-run is required)
   ========================================================================== 

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const sql = getDb();
    
    // 1. Fetch all user profile rows out of your Neon database
    const users = await sql`SELECT id, customizations, email FROM users`;
    let totalMigratedIcons = 0;

    // 2. Iterate through every single user profile structure
    for (const user of users) {
      let customizations = user.customizations;
      
      // Safety safeguard: Skip over profiles missing custom settings
      if (!customizations || !customizations.customPhrases) continue;

      let hasChanges = false;

      // 3. Scan through each phrase layout searching for raw base64 data codes
      for (const phrase of customizations.customPhrases) {
        if (phrase.icon && phrase.icon.startsWith('data:image')) {
          
          // Split the data URI scheme layout to pull the raw text bundle out
          const base64Parts = phrase.icon.split(',');
          const base64DataString = base64Parts[1] || base64Parts[0];
          
          // Construct a valid binary Buffer from the string format
          const body = Buffer.from(base64DataString, 'base64');
          
          // Assign an easily identifiable path identifier grouping
          const pathname = `customizations/user-${user.id}-phrase-${phrase.id || Date.now()}.jpg`;

          // 4. Stream the raw binary directly up into Vercel Blob cloud engine
          const blob = await put(pathname, body, {
            access: 'public',
            contentType: 'image/jpeg',
            addRandomSuffix: true,
          });

          console.log(`[Migration] Swapped image target for ${user.email} -> ${blob.url}`);

          // 5. Replace the massive raw base64 string block with a clean URL link string
          phrase.icon = blob.url;
          hasChanges = true;
          totalMigratedIcons++;
        }
      }

      // 6. Push the updated optimized lightweight JSON package directly back into Neon
      if (hasChanges) {
        // We convert the modified object structure safely into a clear string layout
        const updatedCustomizations = JSON.stringify(customizations);
        
        await sql`
          UPDATE users 
          SET customizations = ${updatedCustomizations} 
          WHERE id = ${user.id}
        `;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Data migration run successful! Cleaned and converted ${totalMigratedIcons} custom phrase icons into Vercel Blob records.` 
    });

  } catch (error) {
    console.error('[Migration Error]:', error);
    return NextResponse.json({ error: 'Data processing execution failed', details: String(error) }, { status: 500 });
  }
}
*/
export async function GET() {
    return new Response("This migration endpoint is currently disabled.", {status: 403});
}