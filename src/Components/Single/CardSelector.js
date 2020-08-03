import React from 'react'



const CardSelector = (props)=>{

    //sprawdzam czy gra juz sie rozpoczela, czy nie
    if(props.graRozpoczęta && props.posiadaneKarty.length>1) //2gie sprawdzenie jest dodatkowym zabezpieczeniem
    {
        //jesli gra sie rozpoczela, to wyswietl karty wylosowane przez API
        //console.log(props)
        const karty = props.posiadaneKarty.map((karta)=>{
            return (<div key={karta.code}><img src={karta.image} key={karta.code}/></div>)
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
            <div className="startTalia">
                <img src="talia.png"/>
            </div>
        )
    }
}


export default CardSelector



