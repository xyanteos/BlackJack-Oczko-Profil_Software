import React from 'react'
import CardSelector from './CardSelector'
import Cards from '../Api'


const request1 = "https://deckofcardsapi.com/api/deck/"


class Single extends React.Component{
    state={
        graTrwa:false,
        idDecka:null,
        posiadaneKarty:[],
        score:0,
        zliczonoPkt:false,
        wygrana: false,
        przegrana:false,
        remis: false,
        wynikKrup:0
    }
       //dodaje bardzo potrzebny system do ZLICZANIA PKT... ;)
       policzPunkty = () =>{
           var punktacja = 0
           this.state.posiadaneKarty.map((karta)=>{
                //console.log(karta)
                //console.log(karta.value)
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
            //logika remisu i ogl wyniku gry gdy nie zostaly osiagniete/przekroczone progi punktowe jest zawarta w przycisku pass-owania.

        }


        //jesli zabraknie kart w talii to gra sie sypie.

    }

    pobierzDecka = () =>{
        Cards.get(`${request1}new/shuffle/?deck_count=1`).then((res)=>{
            //console.log(res)
            this.setState({idDecka:res.data.deck_id})
            //console.log(this.state.idDecka)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    //od razu po zaladowaniu strony wysylam zapytanie o decka (lub decki(?))
    componentDidMount(){
        this.pobierzDecka()
    }


    //konczenie w trakcie
    zakoncz=()=>{

        //dodaj wygrana i przegrana jesli numer sie zgadza
        if(!this.state.wygrana && !this.state.przegrana && !this.state.remis)
        {
            var wynikKrupiera = (Math.floor(Math.random()*20)+2)

            if(this.state.score>wynikKrupiera)
            {
                this.setState({wygrana:true})
                console.log('Wynik Krupiera:'+wynikKrupiera)
            }
            else if(this.state.score<wynikKrupiera){
                this.setState({przegrana:true})
                console.log('Wynik Krupiera:'+wynikKrupiera)
            }
            else{
                this.setState({remis:true})
                console.log("Niemozliwe stalo sie mozliwe")
            }
            console.log(wynikKrupiera)
            this.setState({wynikKrup:wynikKrupiera})
        }
        // - randomowy numer pomiedzy 2-21
        //this.pobierzDecka()
        // this.setState({graTrwa:false})
        // this.setState({score:0})
        // this.setState({posiadaneKarty:[]})
    }
    //dodajemy opcje pobrania kolejnej karty z talii
    dowalKarte=()=>{
        //console.log("dowalam")
        if(this.state.graTrwa && !this.state.przegrana && !this.state.wygrana)
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
        if(this.state.graTrwa && !this.state.wygrana && !this.state.przegrana && !this.state.remis){
            return(<h1>Gramy!</h1>)
        }
        else if(this.state.graTrwa && this.state.przegrana){
            return(<div><h1>Przegrana...</h1><p>Kliknij, aby zagrać ponownie</p></div>)
        }
        else if(this.state.graTrwa && this.state.wygrana){
            return(<div><h1>Wygrana!  </h1><p>Kliknij, aby zagrać ponownie</p></div>)
        }
        else if(this.state.graTrwa && this.state.remis)
        {
            return(<div><h1>Remis!</h1><p>Kliknij, aby zagrać ponownie</p></div>)
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
        if(this.state.graTrwa && (this.state.wygrana || this.state.przegrana || this.state.remis)){
            this.restart()

        }
    }
    restart = () =>{
        this.setState({graTrwa:false})
        this.pobierzDecka()
        this.setState({score:0})
        this.setState({posiadaneKarty:[]})
        this.setState({wygrana:false})
        this.setState({przegrana:false})
        this.setState({zliczonoPkt:false})
        this.setState({remis:false})
        this.setState({wynikKrup:0})
    }
    render(){
        return(
            <div className="singlePlayer">
                <div>Grasz w singla</div>
                <div onClick={this.kliknietoKarty} className="wyswietlacz">
                    {this.coNapisac()}
                    <CardSelector graRozpoczęta={this.state.graTrwa} posiadaneKarty={this.state.posiadaneKarty} />
                </div>
                <div className="scoreCounter" id="wynikGracza">
                    Twój wynik: {this.state.score}<br/>
                    <span id="wynikKrupiera">{this.state.wynikKrup ===0 ? null: `Krupier:` + this.state.wynikKrup}</span>
                </div>
                <div className="interakcja">
                    <div className="dawaj" onClick={this.dowalKarte}>
                        Dawaj!
                    </div>
                    <div className="koncz" onClick={this.zakoncz}>
                        Pass!
                    </div>
                </div>
            </div>

        )
    }
}


export default Single