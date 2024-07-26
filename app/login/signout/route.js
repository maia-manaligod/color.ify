
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(req) {
console.log("signout top")




  const supabase = createClient()


  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("sign out: user", user)
  if (user) {
    const data = await supabase.auth.signOut()
    console.log("SIGNOUT ERROR: ", data.error)
  }
  
  //reset spotify
  const cookieStore = cookies();
  
  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token-code-verifier');
  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token');
  cookieStore.delete('spotify_auth_state');
  cookieStore.delete('access');

  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}