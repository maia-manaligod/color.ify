import { generateRandomString } from '@/lib/utils';
import querystring from 'querystring'
import { redirect } from 'next/navigation'
import {cookies} from 'next/headers'
import {createClient} from '@/utils/supabase/server'

//require("dotenv").config();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const RED_URI = process.env.RED_URI;
 


export async function GET(request) {
  const cookieStore = cookies();
  const supabase= createClient();

  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token-code-verifier');
  cookieStore.delete('sb-dgymfsimjrpnvemvcvsb-auth-token');
  cookieStore.delete('spotify_auth_state');
  cookieStore.delete('access');
  cookieStore.delete('refresh');
  
  
  const data = await supabase.auth.getUser();
  console.log("at login, checking for user: ", data);

  if (data.data.user == null){
    //Redirect the user to Supabase's OAuth authentication endpoint
    const login = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
      redirectTo: process.env.SUPABASE_REDI,
      },
    })
    

    console.log("data returned by supabase after signin: ", login.data)
    console.log("error returned by suapabse: ", login.error)
    if (login.error){
      redirect("/error");
    }
  
    const auth_url = login.data.url
    console.log("redirecting to: ", auth_url);

    redirect (auth_url)

  }
  
  else {
    const state = generateRandomString(16);
    const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-read ugc-image-upload'

    redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: RED_URI,
      state: state
    }));
  }
  /*

    
    */
}
