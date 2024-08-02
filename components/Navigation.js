

export function Navigation(){
    return (
        <div style = {{backgroundColor: "#4AB19E", color: "#FFFFFF"}}>
            <ul className = "navigation">
                <li>
            
                    <a href="/" style = {{fontSize: "30px"}}>color.ify</a>

                </li>

                <li>
                    <a href = "/colors">my colors.</a>
                </li>

                <li>
                    <a href = "/songs">my songs.</a>
                </li>
            
                <li>
                    <a href="/create">+</a>
                </li>


                <li style = {{marginLeft: "auto"}}>
                    <a href="/login/signout">signout.</a>
                </li>
                
            
                </ul>
           
        </div>
    )
}