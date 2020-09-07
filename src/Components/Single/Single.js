import React from 'react'
import CardSelector from './CardSelector'
import Cards from '../Api'


const request1 = "https://deckofcardsapi.com/api/deck/"


class Single extends React.Component{
    state={
        gameStarted:false,
        deckID:null,
        ownedCards:[],
        score:0,
        pointsCounted:false,
        won: false,
        lost:false,
        draw: false,
        croupierPoints:0
    }
       countPoints = () =>{
           var punktacja = 0
           this.state.ownedCards.map((card)=>{
                if(isNaN(card.value)){
                    if(card.value==="QUEEN")
                    punktacja+=3
                    if(card.value==="KING")
                    punktacja+=4
                    if(card.value==="JACK")
                    punktacja+=2
                    if(card.value==="ACE")
                    punktacja+=11
                }
                else{
                    punktacja+=parseInt(card.value)
                }
            })
        return(punktacja)
        }

        //logika
       componentDidUpdate(){
        if(this.state.ownedCards.length>1 && !this.state.pointsCounted)
        {
            this.setState({score:this.countPoints()})
            this.setState({pointsCounted:true})

        }

        if(this.state.gameStarted){
            if(this.state.score===21 && this.state.won===false){
                console.log('Wygrałeś/aś!')
                this.setState({won:true})

            }
            if(this.state.score>21){
                if(this.state.ownedCards.length>2){
                    if(this.state.lost===false){
                        this.setState({lost:true})
                        console.log('przegrałeś/aś...')
                    }

                }
                else{
                    if(!this.state.won){
                        this.setState({won:true})
                        console.log('Wygrałeś/aś!')
                    }

                }
            }


        }

    }

    getA_NewDeck = () =>{
        Cards.get(`${request1}new/shuffle/?deck_count=1`).then((res)=>{
            this.setState({deckID:res.data.deck_id})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    //od razu po zaladowaniu strony wysylam zapytanie o decka (lub decki(?))
    componentDidMount(){
        this.getA_NewDeck()
        this.baseState = this.state
    }


    //konczenie w trakcie
    endTheGame=()=>{

        if(!this.state.won && !this.state.lost && !this.state.draw)
        {
            var CroupierPointsRandom = (Math.floor(Math.random()*20)+2)

            if(this.state.score>CroupierPointsRandom)
            {
                this.setState({won:true})
                console.log('Wynik Krupiera:'+CroupierPointsRandom)
            }
            else if(this.state.score<CroupierPointsRandom){
                this.setState({lost:true})
                console.log('Wynik Krupiera:'+CroupierPointsRandom)
            }
            else{
                this.setState({draw:true})
                console.log("Niemozliwe stalo sie mozliwe")
            }
            this.setState({croupierPoints:CroupierPointsRandom})
        }

    }
    //dodajemy opcje pobrania kolejnej karty z talii
    draw_a_card=()=>{

        if(this.state.gameStarted && !this.state.lost && !this.state.won)
        Cards.get(`${request1}${this.state.deckID}/draw/?count=1`)
        .then((res)=>{
            this.setState({ownedCards:[...this.state.ownedCards, res.data.cards[0]]})
            this.setState({pointsCounted:false})
        }).catch((err)=>{
            console.log(err)
        })
    }
    //Zmieniam tytuł h1 w zależności od etapu gry
    whatToAnnounce=()=>{
        if(this.state.gameStarted && !this.state.won && !this.state.lost && !this.state.draw){
            return(<h1>Gramy!</h1>)
        }
        else if(this.state.gameStarted && this.state.lost){
            return(<div><h1>Przegrana...</h1><p>Kliknij, aby zagrać ponownie</p></div>)
        }
        else if(this.state.gameStarted && this.state.won){
            return(<div><h1>Wygrana!  </h1><p>Kliknij, aby zagrać ponownie</p></div>)
        }
        else if(this.state.gameStarted && this.state.draw)
        {
            return(<div><h1>Remis!</h1><p>Kliknij, aby zagrać ponownie</p></div>)
        }
        else{
            return(<h1>Kliknij, aby rozpocząć</h1>)
        }
    }
    //czynności wykonywane podczas rozpoczęcia gry
    cardsClicked=()=>{
        
        if(!this.state.gameStarted){
            this.setState({gameStarted:true});
            Cards.get(`${request1}${this.state.deckID}/draw/?count=2`)
            .then((res2)=>{
                this.setState({ownedCards:res2.data.cards})
            })
            .catch((err)=>{
                console.log(err)
            });
        }
        if(this.state.gameStarted && (this.state.won || this.state.lost || this.state.draw)){
            this.restart()

        }
    }
    restart = () =>{
        this.setState(this.baseState)
        this.getA_NewDeck()
    }
    render(){
        return(
            <div className="singlePlayer">
                <div>Grasz w singla</div>
                <div onClick={this.cardsClicked} className="wyswietlacz">
                    {this.whatToAnnounce()}
                    <CardSelector gameStarted={this.state.gameStarted} ownedCards={this.state.ownedCards} />
                </div>
                <div className="scoreCounter" id="wynikGracza">
                    Twój wynik: {this.state.score}<br/>
                    <span id="CroupierPointsRandom">{this.state.croupierPoints ===0 ? null: `Krupier:` + this.state.croupierPoints}</span>
                </div>
                <div className="interakcja">
                    <div className="dawaj" onClick={this.draw_a_card}>
                        Dobierz!
                    </div>
                    <div className="koncz" onClick={this.endTheGame}>
                        Pass!
                    </div>
                </div>
            </div>

        )
    }
}


export default Single