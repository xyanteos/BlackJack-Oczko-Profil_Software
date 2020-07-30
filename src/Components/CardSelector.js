import React from 'react'


const CardSelector = (props)=>{
    if(props.graRozpoczęta)
    {
        return(
            <div className="karta">
                <h2>Gramy!</h2>
            </div>
        )
    }
    else{
        return(
            <div className="karta">
                <img src="talia.png"/>
            </div>
        )
    }
}


export default CardSelector



