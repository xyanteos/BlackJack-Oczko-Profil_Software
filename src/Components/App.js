import React from 'react'
import GameSelector from './GameSelector'


const request1 = "https://deckofcardsapi.com/api/deck/"

class App extends React.Component{
    state = {
        trybGry:'single'
    }

    //dodaje 2 wersje gry (opcja wyboru)
    wybierzTrybGry = (event) =>{
        this.setState({trybGry:event})
        console.log(this.state.trybGry)
    }
//{!this.state.graRozpoczęta ? <h1>Kliknij, aby rozpocząć!</h1> : <h1>Trwa rozgrywka...</h1>}
    render(){
        return(
            <div className="background">
                <div className="gameMode">
                    <select onChange={(e)=>{this.setState({trybGry:e.target.value})}} className="select-css">
                        <option value="single">Tryb Jednoosobowy</option>
                        <option value="multi">Tryb Wieloosobowy</option>
                    </select>
                </div>
                <div className="oknoGry">
                    <GameSelector tryb={this.state.trybGry} />  
                </div>
            </div>

        )
    }
}


export default App