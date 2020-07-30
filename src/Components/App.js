import React from 'react'
import CardSelector from './CardSelector'
import Cards from './Api'

const request1 = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", request2= "https://deckofcardsapi.com/api/deck/"

class App extends React.Component{
    state = {
        graRozpoczeta: false,
        idDecka:null,
        posiadaneKarty:[],
        score: 0,
        wygrana: false
    }
    //od razu po zaladowaniu strony wysylam zapytanie o decka
    componentDidMount(){
        Cards.get(request1).then((res)=>{
            console.log(res)
            this.setState({idDecka:res.data.deck_id})
            console.log(this.state.idDecka)
        })
        .catch((err)=>{
            console.log(err)
        })

    }

    kliknietoKarty=()=>{
        //console.log(this.state.graRozpoczeta)
        this.setState({graRozpoczeta:true})
        if(!this.state.graRozpoczeta)
        Cards.get(`${request2}${this.state.idDecka}/draw/?count=2`)
        .then((res2)=>{
            console.log(res2);
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render(){
        return(
            <div className="background">
                <div className="oknoGry">
                    {!this.state.graRozpoczęta ? <h1>Kliknij, aby rozpocząć!</h1> : <h1>Trwa rozgrywka...</h1>}
                    <div onClick={this.kliknietoKarty}>
                        <CardSelector graRozpoczęta={this.state.graRozpoczeta} aktualnaKarta={this.state.aktualnaKarta} />
                    </div>
                    <div className="scoreCounter">
                        Your score: {this.state.score}
                    </div>
                    <div className="interakcja">
                        <div className="dawaj">
                            Hit me!
                        </div>
                        <div className="koncz">
                            Pass
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default App