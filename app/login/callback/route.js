import {cookies} from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server';
import querystring from 'querystring';


import {fetchState} from "@/lib/actions/spotifyAuth"

//require("dotenv").config();

  
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const RED_URI = process.env.RED_URI;
 



export async function GET(request){
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state')

  console.log("CODE: " , code , " STATE: ", state);

  const cookieStore = new cookies();

  

  if (state == null){
    response.redirect('/#' +
    querystring.stringify({
      error: 'state_mismatch'
    }));
  } else {

    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: RED_URI
      })
    };
 
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);


    if (response.ok){
      const data = await response.json();
      const {access_token, refresh_token } = data;
      cookieStore.set("access", access_token);
      cookieStore.set("refresh",refresh_token);

      console.log("COOKIE ACCES:" , cookieStore.get("access").value, " COOKIE REFRESH", cookieStore.get("refresh").value);

      return redirect("/");

    } else {
      return redirect("/");
    }

    
    }
    
  }