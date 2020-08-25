import React from 'react'



const CardSelector = (props)=>{

    if(props.gameStarted && props.ownedCards.length>1) 
    {
        const cards = props.ownedCards.map((card)=>{
            return (<div key={card.code}><img src={card.image} key={card.code} alt={card.name}/></div>)
        })
        return(
            <div className="cards">
                {cards}
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



