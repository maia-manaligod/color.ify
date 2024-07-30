
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("signout user: ", user)
  if (user) {
    console.log("sign out: user", user)
    const data = await supabase.auth.signOut()
    console.log("signout", data)
  } else {
    console.log('user already signed out')
  }
  
  //reset spotify
  const cookieStore = cookies();
  
  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token-code-verifier');
  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token');
  cookieStore.delete('spotify_auth_state');
  console.log("acces:", cookieStore.get('access'))
  cookieStore.delete('access');
  cookieStore.delete('refresh')

  return NextResponse.redirect(process.env.REDI_TO_HOME)
}