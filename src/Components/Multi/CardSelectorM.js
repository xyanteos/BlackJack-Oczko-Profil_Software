import React from 'react'



const CardSelectorM = (props)=>{

    //sprawdzam czy gra juz sie rozpoczela, czy nie
    if(props.graRozpoczeta===true) //2gie sprawdzenie jest dodatkowym zabezpieczeniem
    {

        console.log(props)
        const karty = props.listaGraczy[props.aktualnyGracz].posiadaneKarty.map((karta)=>{
            return (<div key={karta.code}><img src={karta.image} key={karta.code}/></div>)
        })
        //console.log(props.listaGraczy[props.aktualnyGracz].posiadaneKarty)
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


export default CardSelectorM



