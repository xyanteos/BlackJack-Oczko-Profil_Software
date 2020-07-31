import React from 'react'
import { render } from '@testing-library/react'


const CardSelector = (props)=>{

    //sprawdzam czy gra juz sie rozpoczela, czy nie
    if(props.graRozpoczęta && props.posiadaneKarty.length>1)
    {
        //jesli gra sie rozpoczela, to wyswietl karty wylosowane przez API
        //console.log(props)
        const karty = props.posiadaneKarty.map((karta)=>{
            return (<div><img src={karta.image} key={karta.code}/></div>)
        })
        return(
            <div className="karty">
                {karty}
            </div>
        )
    }
    //jesli gra sie nie rozpoczela, to pokazuj talię
    else{
        return(
            <div>
                <img src="talia.png"/>
            </div>
        )
    }
}


export default CardSelector



