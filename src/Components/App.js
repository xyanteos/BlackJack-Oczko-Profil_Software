import React from 'react'
import CardSelector from './CardSelector'
import Cards from './Api'
import ZliczPunkty from './ZliczPunkty'

const request1 = "https://deckofcardsapi.com/api/deck/"

class App extends React.Component{
    state = {
        graRozpoczeta: false,
        idDecka:null,
        posiadaneKarty:[],
        score: 0,
        wygrana: false,
        zliczonoPkt: false
    }
    //dodaje bardzo potrzebny system do ZLICZANIA PKT... ;)
    componentDidUpdate(){
        if(this.state.posiadaneKarty.length>1 && !this.state.zliczonoPkt)
        {
             this.setState({score:<ZliczPunkty karty={this.state.posiadaneKarty}/>})
             this.setState({zliczonoPkt:true})

        }

    }

    //od razu po zaladowaniu strony wysylam zapytanie o decka (lub decki(?))
    componentDidMount(){
        Cards.get(`${request1}new/shuffle/?deck_count=1`).then((res)=>{
            //console.log(res)
            this.setState({idDecka:res.data.deck_id})
            //console.log(this.state.idDecka)
        })
        .catch((err)=>{
            console.log(err)
        })

    }
    //dodajemy opcje pobrania kolejnej karty z talii
    dowalKarte=()=>{
        console.log("dowalam")
        Cards.get(`${request1}${this.state.idDecka}/draw/?count=1`)
        .then((res)=>{
            this.setState({posiadaneKarty:[...this.state.posiadaneKarty, res.data.cards[0]]})
            this.setState({zliczonoPkt:false})
            console.log(this.state.posiadaneKarty)
        }).catch((err)=>{
            console.log(err)
        })
    }
    //Zmieniam tytuł h1 w zależności od etapu gry
    coNapisac=()=>{
        if(this.state.graRozpoczeta){
            return(<div><h1>Gramy!</h1></div>)
        }
        else{
            return(<div><h1>Kliknij, aby rozpocząć</h1></div>)
        }
    }
    //czynności wykonywane podczas rozpoczęcia gry
    kliknietoKarty=()=>{
        //console.log(this.state.graRozpoczeta)
        
        if(!this.state.graRozpoczeta){
            this.setState({graRozpoczeta:true});
            Cards.get(`${request1}${this.state.idDecka}/draw/?count=2`)
            .then((res2)=>{
                //onsole.log(res2);
                this.setState({posiadaneKarty:res2.data.cards})
            })
            .catch((err)=>{
                console.log(err)
            });
        }

    }
//                    {!this.state.graRozpoczęta ? <h1>Kliknij, aby rozpocząć!</h1> : <h1>Trwa rozgrywka...</h1>}
    render(){
        return(
            <div className="background">
                <div className="oknoGry">

                    <div onClick={this.kliknietoKarty}>
                        {this.coNapisac()}
                        <CardSelector graRozpoczęta={this.state.graRozpoczeta} posiadaneKarty={this.state.posiadaneKarty} />
                    </div>
                    <div className="scoreCounter">
                        Twój wynik: {this.state.score}
                    </div>
                    <div className="interakcja">
                        <div className="dawaj" onClick={this.dowalKarte}>
                            Dawaj!
                        </div>
                        <div className="koncz">
                            Stop!
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default App