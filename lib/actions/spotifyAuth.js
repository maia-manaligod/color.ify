"use server"

import { generateRandomString } from '@/lib/utils';
import querystring from 'querystring'
import { redirect } from 'next/navigation'
import {cookies} from 'next/headers'
//import express from 'express'

//require("dotenv").config();
  
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const RED_URI = process.env.RED_URI || `http://localhost:${PORT}`;
 
export async function login(){
    console.log("triggering login function"); 
    const cookieStore = cookies();


    //console.log("overwriting " , cookieStore.get('spotify_auth_state'));
    cookieStore.delete('spotify_auth_state');
  


    const state = generateRandomString(16);
    const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-read ugc-image-upload'
    cookieStore.set('spotify_auth_state', state);
    console.log("cookie set?: " , cookieStore.get('spotify_auth_state'));


    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: RED_URI,
        state: state,
    })}`;

    console.log(authUrl)
    
    redirect(authUrl);
}

export async function fetchAccess(state, code){

  const CLIENT_ID = process.env.CLIENT_ID;

    if (state != cookieStore.get('spotify_auth_state').value) {
      console.log("state: " , state, "cookie: ", cookieStore.get('spotify_auth_state'));
        return {success: false} 
      }
    
    else {
        console.log("deleting state " + cookieStore.get('spotify_auth_state'));
        cookieStore.delete('spotify_auth_state');

        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: "http://localhost:3000",
            grant_type: 'authorization_code'
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + SECRET_KEY).toString('base64'))
          },
        };

        try {
          const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
          const data = await response.json();

          if (response){
            console.log(data);
            cookieStore.set("access", data.access_token);
            console.log(data.access_token);

            redirect("http://localhost:3000");
          } else {
            console.log("no response? " , data);
          }
        } catch (error){
          console.log(error,  "internal server error");
        }
      }


}

export async function getState(){
  const state = cookieStore.get('spotify_auth_state');
  if (state.value != null) { 
    cookieStore.delete('spotify_auth_state');
  }
    return state; 
}

export async function getAccess(){

    if (cookieStore.get('access').value != null){
      return true; 
    } else {
      return false;
    };
  
}

