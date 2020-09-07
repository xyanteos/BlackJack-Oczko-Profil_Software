import React from 'react'



const CardSelectorM = (props)=>{

    if(props.gameStarted===true) 
    {

        //console.log(props)
        if(!props.ended)
        {
            const karty = props.playersList[props.currentPlayer].posiadaneKarty.map((karta)=>{
                return (<div key={karta.code}><img src={karta.image} key={karta.code}/></div>)
            })
            //console.log(props.playersList[props.currentPlayer].posiadaneKarty)
            return(
                <div className="cards">
                    {karty}
                </div>
            )
        }

        else{
            //console.log(props.zwyciezcy)    
            if(props.winners)
            {
                if(!props.winnersShown)
                props.checkIfWinnersShown()
                const winners = props.winners.map((winner)=>{
                return(<li key={winner.id}><h2>Gracz {winner.id} z licbą punktów {winner.points}</h2></li>)
                })
            return(<div>Zwyciezcami są: <ol id="listaZwyciezcow">{winners}</ol></div>)
            }
        }


    }
    //jesli gra sie nie rozpoczela, to pokazuj "talię"
    else{
        return(
            <div className="startTalia">
                <img src="talia.png"/>
            </div>
        )
    }
}


export default CardSelectorM



