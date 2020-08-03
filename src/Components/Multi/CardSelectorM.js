import React from 'react'



const CardSelectorM = (props)=>{

    //sprawdzam czy gra juz sie rozpoczela, czy nie
    if(props.graRozpoczeta && props.gracze.length>0) //2gie sprawdzenie jest dodatkowym zabezpieczeniem
    {
        //jesli gra sie rozpoczela, to wyswietl karty wylosowane przez API
        //console.log(props)
        console.log(props)
        // const karty = props.aktualnyGracz.posiadaneKarty.map((karta)=>{
        //     return (<div key={karta.code}><img src={karta.image} key={karta.code}/></div>) {karty}
        // })
        return(
            <div className="karty">
                
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


export default CardSelectorM



