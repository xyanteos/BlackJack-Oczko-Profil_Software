import React from 'react'
import CardSelector from './CardSelector'
import ZliczPunkty from './ZliczPunkty'
import Cards from './Api'


const request1 = "https://deckofcardsapi.com/api/deck/"


class Single extends React.Component{
    state={
        graTrwa:false,
        idDecka:null,
        posiadaneKarty:[],
        score:0,
        zliczonoPkt:false,
        wygrana: false,
        przegrana:false
    }
       //dodaje bardzo potrzebny system do ZLICZANIA PKT... ;)
       policzPunkty = () =>{
           var punktacja = 0
           this.state.posiadaneKarty.map((karta)=>{
                console.log(karta)
                console.log(karta.value)
                if(isNaN(karta.value)){
                    if(karta.value==="QUEEN")
                    punktacja+=3
                    if(karta.value==="KING")
                    punktacja+=4
                    if(karta.value==="JACK")
                    punktacja+=2
                    if(karta.value==="ACE")
                    punktacja+=11
                }
                else{
                    punktacja+=parseInt(karta.value)
                }
            })
        return(punktacja)
        }

        //logika
       componentDidUpdate(){
        if(this.state.posiadaneKarty.length>1 && !this.state.zliczonoPkt)
        {
            this.setState({score:this.policzPunkty()})
            this.setState({zliczonoPkt:true})

        }

        if(this.state.graTrwa){
            if(this.state.score===21 && this.state.wygrana===false){
                console.log('Wygrałeś/aś!')
                this.setState({wygrana:true})

            }
            if(this.state.score>21){
                if(this.state.posiadaneKarty.length>2){
                    if(this.state.przegrana===false){
                        this.setState({przegrana:true})
                        console.log('przegrałeś/aś...')
                    }

                }
                else{
                    if(!this.state.wygrana){
                        this.setState({wygrana:true})
                        console.log('Wygrałeś/aś!')
                    }

                }
            }
        }

        //logika gry, ktora mowi kiedy koniec itd
        // if(this.state.score>=21){
        //     console.log("Koniec?")
        //     if(this.state.posiadaneKarty.length>2){
        //         this.setState({idDecka:null})
        //         this.setState({posiadaneKarty:[]})
        //         this.setState({zliczonoPkt:false})
        //         this.setState({graTrwa:false})
        //     }
        //     else{
        //         if(this.state.posiadaneKarty)
        //         console.log('lel')
        //     }
        // }

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
    //konczenie w trakcie
    zakoncz=()=>{
        this.setState({graTrwa:false})
        this.setState({score:0})
    }
    //dodajemy opcje pobrania kolejnej karty z talii
    dowalKarte=()=>{
        //console.log("dowalam")
        Cards.get(`${request1}${this.state.idDecka}/draw/?count=1`)
        .then((res)=>{
            this.setState({posiadaneKarty:[...this.state.posiadaneKarty, res.data.cards[0]]})
            this.setState({zliczonoPkt:false})
            //console.log(this.state.posiadaneKarty)
        }).catch((err)=>{
            console.log(err)
        })
    }
    //Zmieniam tytuł h1 w zależności od etapu gry
    coNapisac=()=>{
        if(this.state.graTrwa){
            return(<h1>Gramy!</h1>)
        }
        else{
            return(<h1>Kliknij, aby rozpocząć</h1>)
        }
    }
    //czynności wykonywane podczas rozpoczęcia gry
    kliknietoKarty=()=>{
        //console.log(this.state.graTrwa)
        
        if(!this.state.graTrwa){
            this.setState({graTrwa:true});
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
    render(){
        return(
            <div className="singlePlayer">
                <div>Grasz w singla</div>
                <div onClick={this.kliknietoKarty} className="wyswietlacz">
                    {this.coNapisac()}
                    <CardSelector graRozpoczęta={this.state.graTrwa} posiadaneKarty={this.state.posiadaneKarty} />
                </div>
                <div className="scoreCounter">
                    Twój wynik: {this.state.score}
                </div>
                <div className="interakcja">
                    <div className="dawaj" onClick={this.dowalKarte}>
                        Dawaj!
                    </div>
                    <div className="koncz" onClick={this.zakoncz}>
                        Stop!
                    </div>
                </div>
            </div>

        )
    }
}


export default Single