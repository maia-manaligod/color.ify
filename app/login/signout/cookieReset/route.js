import {cookies} from 'next/headers'
import { redirect } from 'next/navigation'


export async function GET(request) {
    const cookieStore = cookies();
  
    cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token-code-verifier');
    cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token');
    cookieStore.delete('spotify_auth_state');
    cookieStore.delete('access');
    cookieStore.delete('refresh');
  
    redirect("/")
  }
  