"use client"

import { useSearchParams } from 'next/navigation'
//import {cookies} from 'next/headers';
//import {getState, getAccess} from '@/lib/actions/auth';
//import{ useState, useEffect} from "react";
import {GetUser} from '@/components/userInfo'
import {login, signup, getSupaUser} from '@/lib/actions/supaAuth'
import {useState, useEffect} from "react"

import { getColors } from '@/components/supabase'
import RecentSongs from '@/components/RecentSongs'
import { Navigation } from '@/components/Navigation'
import { getHomePageInfo } from '@/lib/getHomePageInfo'
import { SongWithColor } from '@/components/song'
import { Login } from '@/components/Login'

function Search(){
  const searchParams = useSearchParams()
  let emailInvalid = (errorCode != null && errorCode == 'Unverified email with spotify. A confirmation email has been sent to your spotify email');
  console.log(emailInvalid)

  console.log(errorCode);

}



export default function Home() {

  //const cookieStore = cookies();
  //const search = useSearchParams();
  //const errorCode = search.get('error_description');
  //console.log(cookieStore.getAll());

  let loggedIn = true;
  let emailInvalid = false;

  const[loading, setLoading] = useState(true);
  const [loginState, setLoginState] = useState(0)
  const [colors, setColors] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [recentSongs, setRecentSongs] = useState(null)

  useEffect(() => {
      getSupaUser()
      .then((results) => {
         console.log("get supa user: ", results)
          if (results != null) {
              //setResult(results);
              setLoginState(1);
              //setLoading(false);
              getHomePageInfo().then((result) => {
                console.log(result)
                setUserInfo(result.spotifyProfile)
                setColors(result.recentColors.colorData)
                setRecentSongs(result.recentSongs)
                setLoginState(1)
                setLoading(false)
              })
          } else {
              setLoginState(0)
              setLoading(false);

          }
      });
/*
      if (result){
        getColors(6).then((results) => {
          setColors(results.colorData)
          setLoading(false)
        })
      }
      */
      
  }, []);

  //const supaUser =  await getSupaUser();
  //console.log("SUPAUSER: ", supaUser)

  //let access = cookieStore.get('access');
  //if (access != null && access.value != '') { loggedIn = true;}

  return (
    <>
    <div className = "stpage">
     
      
      
      


      {emailInvalid &&
        <p>check your email to complete the login process</p>
      }

      
      

      {loginState == 0 && 

        <>
        {loading && <p> Loading... </p>}
      
        {!loading && 
          <div className = "stpage">
            <Login/>
          </div>
        }
        </>
      }

      {loginState == 1 && 
      <div>

          <Navigation/>

          {loading && <p> Loading... </p>}

          {!loading && 

          <div className = "stpage">
            <h1>colorify</h1>
            <div className = "rowPage">
                <div className = "colPage">
                  <div className = "rowPage">
                        <img src = {userInfo.pic} style = {{width: "100px", height : "100px", borderRadius: "50%", margin: "10px"}}></img>
                        <h1>{userInfo.name}</h1>
                  </div>

                  <div className = "stpage colorGrid" >
                  {colors.map((item) => (
                    <a key = {item} href = {'/colors/' + item.hex.substring(1)}>
                                  <div className = "colPage" >
                                      <div style = {{width: "130px", height: "130px", backgroundColor: item.hex}}>
                                      </div>
                                      <p>{item.colorName}</p>
                                
                                  </div>

                    </a>
                  ))}
                  <div>
                    <a href = "/colors">see colors &gt;&gt;</a>
                  </div>
                
                </div>
                </div>




                <div>
                    <h3>Recently Added</h3>
                    {recentSongs.map((item) => 
                        <div> 
                           <SongWithColor key = {item.id} object = {item}/>
                        </div>
                    )}
                <a href = "/songs">see songs &gt;&gt;</a>
                </div> 



                
            </div>

          </div>
          
          
          }
      </div>
      }
      </div>

</>);










/*


          <div className = "stpage rowPage">
            <div className = "colPage"> 
                {loggedIn && 
                <>
                  
                </>
              }



              {!loading && 
                <div className = "stpage colorGrid" >
                  {colors.map((item) => (
                    <a key = {item} href = {'/colors/' + item.hex.substring(1)}>
                                  <div className = "colPage" >
                                      <div style = {{width: "150px", height: "150px", backgroundColor: item.hex}}>
                                      </div>
                                      <p>{item.colorName}</p>
                                
                                  </div>

                    </a>
                  ))}
                  <div>
                    <a href = "/colors">see colors &gt;&gt;</a>
                  </div>
                
      
                </div>
              }
                
            </div>



            <RecentSongs/>

          </div>
          
          
      </div>
      
      
      
      
    </div>
    
    </>
  );
  */


}

//SUPABASE AUTH
/*
 <>
          <h2>login.</h2>
          <form>
            <div>
              <label htmlFor = "email">email: </label>
              <input id = "email" name = "email" type = "email" required/>
            </div>
            <div>
              <label htmlFor = "password">password: </label>
              <input id = "password" name = "password" type = "password" required />
            </div>
            <button formAction = {login}>Login In</button>
          </form>

          <h2>or, signup here</h2>
          <p>you will need to verify your email address.</p>
          <form>
            <div>
              <label htmlFor = "email">email: </label>
              <input id = "email" name = "email" type = "email" required/>
            </div>
            <button formAction = {signup}>SignUp</button>
          </form>
        </>
  */




  /*
  
  //const search = useSearchParams();
  //const code = search.get('code');
  //const state = search.get('state');

  console.log(code, " " , state);

  const [spotifyToken, setSpotifyToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const access = getAccess();
    console.log("access retrieved at home: " , access);

    if (access){
      setSpotifyToken(access);
      setLoggedIn(true);
    }
  })
 

  return (
    <div>
      <h1>Home Page</h1>
      {!loggedIn && <a href = "/login"><button>Log In</button> </a>}
      {loggedIn && (
        <>
          <h1>logged in: {access} </h1>
        </>
      )}
    </div>
  );
}
*/


 //const cookieStore = cookies();

  //const storedState = Cookies.get('spotify_auth_state');
  //const storedState = cookies.get('spotify_auth_state');

  /*
  const code = search.get('code');
  const state = search.get('state');

  if (code && state){
    const auth = getState(state);
    if (auth.success){
      console.log("authorization succesful");
      console.log(code);
    } else {
      console.log("unsucessful auth attempt");
    }

    

  }
  */

  /*
  if (code && state) {
    if (state === storedState) {
        console.log("cookie removed: ", storedState);
        cookies.delete('spotify_auth_state');
      //Cookies.remove('spotify_auth_state');
    } else {
      console.error('State mismatch');
      //console.log("cookie: ", storedState, " state: ", state);
      console.log("cookie: ", storedState, " state: ", state);
    }
  }
  */

/*
const search = useSearchParams();
  let state = search.get("state");
  let code = search.get("code");
  let error = search.get("error");

  if (state != null && code != null){
    var authOptions = {
    url: 'https://accounts.spotify.com/api/token', 
    form: {
      code: code,
      redirect_uri: 'http://localhost:3000/',
      grant_type: 'authorization_code'
    }, 
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  }
  
  
 
  console.log(state);
  console.log(code);
  console.log(error);
  return (
    <div>
      <h1>Welcome to Colorify</h1>
    </div>
  );
  */


