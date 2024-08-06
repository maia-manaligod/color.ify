export function Login(){
    return (
        <div style = {{display: "flex", justifyContent: "center"}}>
            <div style = {{ borderRadius: "10px", width: "500px", height: "400px", backgroundColor: "#e8eaed" , padding: "20px", display: "flex", justifyContent: "center"}}>
                <div className = "colPage" style = {{ display: "flex", justifyContent: "center"}}>
                    <h1>welcome to colorify</h1>
                    <div className = "filter" style = {{display: "flex" , justifyContent: "center"}}>
                        <a href = "/login">
                            <button style = {{color: "white", backgroundColor: "#4AB19E", borderRadius: "2px", padding:  "5px"}}>login with spotify</button>
                        </a>
 
                    </div>
                   
                </div>
               

            </div>
           
            
        </div>

    );
}