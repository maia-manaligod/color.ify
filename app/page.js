"use client"

import { useSearchParams } from 'next/navigation'
//import {cookies} from 'next/headers';
//import {getState, getAccess} from '@/lib/actions/auth';
//import{ useState, useEffect} from "react";
import {GetUser} from '@/components/userInfo'
import {login, signup, getSupaUser} from '@/lib/actions/supaAuth'
import {useState, useEffect} from "react"

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
                setColors(result.recentColors)
                setRecentSongs(result.recentSongs)
                setLoginState(1)
                setLoading(false)
              })
          } else {
              setLoginState(0)
              setLoading(false);

          }
      });

      
  }, []);

  return (
    <>
    <div>
     
      
      
      


      {emailInvalid &&
        <p>check your email to complete the login process</p>
      }

      
      

      {loginState == 0 && 

        <>
        {loading && <p> </p>}
      
        {!loading && 
          <div className = "stpage">
            <Login/>
          </div>
        }
        </>
      }

      {loginState == 1 && 
      <div style = {{margin: "-10px"}}>

          <Navigation/>

          {loading && <p> Loading... </p>}

          {!loading && 

          <div className = "stpage" style = {{padding: "80px", alignContent: "center"}}>
            <div className = "rowPage">
                <div className = "colPage" style = {{gap: "40px"}}>
                  <div className = "rowPage" style = {{gap: "20px"}}>
                        <img src = {userInfo.pic} style = {{width: "120px", height : "120px", borderRadius: "50%", margin: "10px",marginBottom: "30px"}}></img>
                        <div className = "colPage">
                          <h1 style = {{fontSize: "40px"}}>{userInfo.name}</h1>
                          <a style = {{color: "gray"}} href = {userInfo.url}>see in spotify &gt;&gt;</a>
                        </div>
                  </div>

                  <div>
                  <div >
                  {(colors.length == 0) ? 
                      <div className = "colPage">
                         <a>you have no colors</a>
                        <a href = "/colors">add a new color!</a>
                      </div>
                      :
                      <div style = {{gap: "200px"}}> 
                        <div className = "colorGrid">
                            {colors.map((item) => (
                            <a key = {item} href = {'/colors/' + item.hex.substring(1)}>
                                          <div className = "colPage" >
                                              <div style = {{width: "150px", height: "150px", backgroundColor: item.hex, borderRadius: "5px"}}>
                                              </div>
                                              <p>{item.colorName}</p>
                                        
                                          </div>
        
                            </a>
                          ))}
                          
                        </div>
                        <div style = {{textAlign: "right" ,marginTop: "20px"}}>
                          <a href = "/colors">see colors &gt;&gt;</a>
                        </div> 
                      </div>
                  } 
                 
                
                  </div>
                  </div>
                </div>
                 
                



                <div style = {{padding: "90px", paddingTop: "0px", paddingLeft: "200px"}}>

                    {recentSongs.length == 0 ? 
                      <div className = "colPage">
                        <a>you have not added any songs yet.</a>
                        <a href = "/create">start creating!</a>
                      </div>
                  
                    :
                    <div>

                    <h3>Recently Added</h3>
                    {recentSongs.map((item) => 
                        <div> 
                           <SongWithColor key = {item.id} object = {item}/>
                        </div>
                    )}
                    <div style = {{textAlign: "right"}}>
                      <a href = "/songs">see songs &gt;&gt;</a>
                    </div>
                    </div>
                    }
                </div>
            </div>

          </div>
          
          
          }
      </div>
      }
      </div>

</>);








}



