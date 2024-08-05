"use client"
import {getProfile} from "@/lib/spotify"
import {useEffect, useState} from "react";

export function GetUser(){
    const [result, setResult] = useState({});
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile()
        .then((results) => {
            if (results != false) {
                console.log("results from getProfile(): ", results)
                setResult(results);
                setLoading(false);
            } else {
                console.log("results = ", results)
            }
        });
    }, []);

    return (
        <div>
            {loading && <p> Loading... </p>}

            {!loading &&
                <div className = "stpage rowPage">
                <img src = {result.pic} style = {{width: "100px", height : "100px", borderRadius: "50%", margin: "10px"}}></img>
                <div className = "colPage">
                    <h1>{result.name}</h1>
                    <a href = {result.url}>see in spotify&gt;&gt; </a>
                </div>
               
                </div>

             }
        </div>
    )
}
