import React from 'react'



const CardSelectorM = (props)=>{

    //sprawdzam czy gra juz sie rozpoczela, czy nie
    if(props.graRozpoczeta===true) //2gie sprawdzenie jest dodatkowym zabezpieczeniem
    {
        //console.log(props)
        //console.log(props.zakonczono)


        //console.log(props)
        if(!props.zakonczono)
        {
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

        else{
            //console.log(props.zwyciezcy)    
            if(props.zwyciezcy)
            {
                if(!props.pokazanoZwyciezcow)
                props.zwyciezcyPokazani()
                const winners = props.zwyciezcy.map((winner)=>{
                return(<li key={winner.id}><h2>Gracz o id {winner.id} z licbą punktów {winner.punkty}</h2></li>)
                })
            return(<div>Zwyciezcami są: <ol id="listaZwyciezcow">{winners}</ol></div>)
            }
        }


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



