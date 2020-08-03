import React from 'react'
import Single from './Single/Single'
import Multi from './Multi/Multi'

const GameSelector = (tryb) =>{
    if(tryb.tryb==="multi"){
        return <Multi />
    }
    else if(tryb.tryb==="single"){
        return <Single />
    }
    else{
        console.log("cos poszlo nie tak")
        console.log(tryb)
        return(<div>nicosc</div>)
    }

        
}

export default GameSelector