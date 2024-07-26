import { redirect } from 'next/navigation'
import {cookies} from 'next/headers'

//require("dotenv").config();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const RED_URI = process.env.RED_URI;

export async function refreshToken(){
    const cookieStore = cookies();
    const refresh = cookieStore.get('refresh').value;
    console.log("refresh: " , refresh)

    const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh,
          cache: 'no-cache',
        }),
    }

    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response  = await body.json();

    console.log(response)

    if (body.status == 200 ){
        console.log("NEW ACCESS: ", response.access_token);
        console.log("NEW REFRESH: ", response.refresh_token);
        
        if (response.access_token != null){
            console.log("replacing access");
            cookieStore.delete('access');
            cookieStore.set('access', response.access_token);
        }

        if (response.refresh_token != null){
            console.log("replacing refresh");
            cookieStore.delete('refresh');
            cookieStore.set('refresh', response.refresh_token);
        }


        console.log("refresh successful");
        return {success: true}
    } else {
        console.log("error in refresh");
        console.log(cookieStore.getAll());
        return {success : false}
    }

    
}