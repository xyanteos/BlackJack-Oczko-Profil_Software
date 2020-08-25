import React from 'react'
import CartSelectorM from './CardSelectorM'
import Cards from '../Api'
import CardSelectorM from './CardSelectorM'

const request = "https://deckofcardsapi.com/api/deck/"
class Multi extends React.Component{
    state={
        gameStarted: false,
        choosingPlayers:true,
        playersCount: 0,
        deckID: null,
        currentPlayer: 0,
        ending: false,
        players: [],
        playersAdded:false,
        moveMade:false,
        winners:[] ,
        winnersShown: false
    }
    componentDidMount(){
        this.baseState = this.state
    }
    zresetujGre = () =>{
        this.setState(this.baseState)
    }

    winnersAddedToList = () =>{
        //moglbym z tego zrobic ogolna metode z 2ma inputami i outputem true/false, ale robie tylko na potrzeby tego przypadku...
        var tak=false;
        var listaZwyciezcow = [...this.state.winners]
        var listaGraczy = [...this.state.players]
        for(var i=0;i<listaZwyciezcow.length;i++){
            for(var k=0;k<listaGraczy.length;k++){
                if(listaGraczy[k]===listaZwyciezcow[i]){
                    tak=true
                }
            }
        }
        return(tak)
    }


    componentDidUpdate(){
        if(this.state.ending){
            //jesli jeszcze nie ma zwyciezcow
            var winnersShown=false
            if( !winnersShown && this.state.playersAdded && this.state.winnersShown){
                var osiagnietoMax=false
                for (var i=0;i<this.state.playersCount;i++){
                    //musze sie upewnic ze nie ma jeszcze dodanego tego winners
                    if(this.state.players[i].points===21 && !this.winnersAddedToList()){
                        this.setState({winners:[...this.state.winners,this.state.players[i]]})
                        if(!osiagnietoMax){
                            osiagnietoMax=true
                        }
                    }
                    
                    if(this.state.players[i].points===22 && this.state.players[i].posiadaneKarty.length===2 && !this.winnersAddedToList()){
                        //oczko, gracz ma 2 asy
                        this.setState({winners:[...this.state.winners, this.state.players[i]]})
                        osiagnietoMax=true
                    }
    
                }
                if(!osiagnietoMax){
                    var maxPointsValue=0
                    for(var j=0;j<this.state.playersCount;j++){
                        if(this.state.players[j].points>maxPointsValue && this.state.players[j].points<21)
                        maxPointsValue=this.state.players[j].points
                        //console.log(this.state.players[j].points)
                    }
                    //console.log(maxPointsValue)
                    for(var i=0;i<this.state.playersCount;i++){
                        if(this.state.players[i].points===maxPointsValue && !this.winnersAddedToList()){
                            this.setState({winners:[...this.state.winners,this.state.players[i]]})
                        }
                    }
                }
                winnersShown=true
                
            }
            if(this.state.winners.length===0 && this.state.checkIfWinnersShown){
                //brak zwyciezcow, wszyscy przegrali
                console.log('brak zwyciezcow, wszyscy przegrali...')
            }

            
        }
        //po zakonczonym ruchu zmien gracza
        if(this.state.moveMade){
            
            if(this.state.currentPlayer===this.state.playersCount-1)
            {
                
                this.setState({currentPlayer:0})
                this.setState({moveMade:false})
            }
            else{
                this.setState({currentPlayer: this.state.currentPlayer+1})  
                this.setState({moveMade:false})
            }
            
        }


        if(this.state.playersCount!==0 && this.state.choosingPlayers)
        {
            this.setState({choosingPlayers:false})
        }
        if(this.state.deckID===null){
            if(this.state.playersCount<=3){ 
                Cards.get(`${request}new/shuffle/?deck_count=1`).then((res)=>{
                    this.setState({deckID:res.data.deck_id})
                }).catch((err)=>{
                    console.log(err)
                })
        }
        //tutaj bedzie moglo sie znalezc zapytanie jak bedzie wiecej graczy niz 3.
        //Dodatkowo trzeba dodać taką opcję podczas wyboru ilości graczy oraz
        //zmienić sposób nadawania klucza (key) kartom w liście podczas ich renderowania w CardSelectorM.
        //przykład zapytania : \/
            // if(this.state.playersCount>3){
            //     var wielkoscDecka = Math.floor(this.state.playersCount/3)
            //     Cards.get(`${request}new/shuffle/?deck_count=${wielkoscDecka}`).then((res)=>{
            //         this.setState({deckID:res.data.deck_id})
            //         //console.log(`ID_decka : ${res.data.deck_id}`)
            //     }).catch((err)=>{
            //         console.log(err)
            //     })
            // }

        
    }

    //PONIZEJ JEST FORMAT DANYCH KAZDEGO Z GARCZY
    if(this.state.playersCount!==0 && this.state.players.length===0 && this.state.deckID!==null && !this.state.playersAdded){
        var wykonaniePetli=0
        for(var i=0;i<this.state.playersCount;i++){
            Cards.get(`${request}${this.state.deckID}/draw/?count=2`)
            .then((res2)=>{
                //musze policzyc points zanim rozpoczne rozgrywke zeby moc stwierdzic kto wygral od razu po rozdaniu
                var val = this.policzpoints(res2.data.cards)
                this.setState({players:[...this.state.players,{
                    id:i,
                    points:val,
                    posiadaneKarty:res2.data.cards,
                    zliczonopoints:false,
                    zakonczylGre:false
                }]})
            })
            .catch((err)=>{
                console.log(err)
            });
            wykonaniePetli+=1;
        }
        this.setState({playersAdded:true})
    }

}


    coNapisac = () => {
        if (!this.state.gameStarted && this.state.choosingPlayers) {
            //gra nie jest jeszcze rozpoczeta
            return (
                <div>
                    <h1>
                        Tryb wieloosobowy. Zaznacz ilość graczy:
                        <select className="select-css wewnatrz" onChange={(e) => {
                            this.setState({playersCount: e.target.value})
                            //na razie bedzie opcja wyboru 2-3 graczy, ale moze dodam jeszcze "niestandardowa"
                        }}>
                            <option value={null} selected disabled hidden>wybierz</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            
                            {/* <option value="wpisz_wartość">wpisz_wartość</option> */}

                        </select>
                    </h1>

                </div>
            )
        }


        if(!this.state.choosingPlayers && !this.state.gameStarted) {
            //console.log(this.state.gameStarted)
            //gra sie rozpoczela
            return (
                <div className="ekranGry">
                    <div className="playerCounter">
                        <div className="tryb">
                            <img src="user-symbol.png" alt="User Symbol" />
                            <span>{this.state.playersCount}</span>
                        </div>
                        <div className="aktualny">
                            <span id="text">
                                {this.state.gameStarted? this.state.currentPlayer + 1 : null} 
                            </span>
                        </div>
                    </div>
                    <h1> Kliknij, aby rozpocząć </h1>
                </div>

            )

        }
        if(this.state.gameStarted){
            return(
                <div className="aktualny">
                    <span id="text">
                        <img src="user-symbol.png" alt="currentPlayer"></img>
                        {this.state.gameStarted? this.state.currentPlayer + 1 : null}
                    </span>
                    /<span>{this.state.playersCount? this.state.playersCount : null}</span>
                </div>
            )
        }
    }
    kliknieto = () =>{
    //po dodaniu graczy czas zaczac gre
        if(this.state.playersAdded && !this.state.gameStarted){
            this.setState({gameStarted:true})
        }
        if(this.state.ending && this.state.winnersShown){
            this.zresetujGre()
        }
    }

    policzpoints = (kartyLista) =>{
        var punktacja = 0
        kartyLista.map((karta)=>{
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

     dowalKarte = () =>{
        Cards.get(`${request}${this.state.deckID}/draw/?count=1`)
        .then((res1)=>{
            var val = this.policzpoints(res1.data.cards)
            //okazuje sie ze zeby zmienic "nested"(zagniezdzony) state, trzeba uzyc tymczasowej zmiennej.
            var listaGraczy = [...this.state.players]
            listaGraczy[this.state.currentPlayer].points+=val;
            
            listaGraczy[this.state.currentPlayer].posiadaneKarty=[...listaGraczy[this.state.currentPlayer].posiadaneKarty,res1.data.cards[0]]
            listaGraczy[this.state.currentPlayer].zliczonopoints=true;
            this.setState({players:listaGraczy})

            //ciezkie pod wzgl. obliczen, ale działa \/
            if(this.state.players[this.state.currentPlayer].points>=21){
                var gracz = this.state.players[this.state.currentPlayer]
                gracz.zakonczylGre = true

                var zakonczylo =0
                for (var i=0; i<this.state.playersCount;i++){
                   if(this.state.players[i].zakonczylGre){
                       zakonczylo++
                   }
                   if(parseInt(zakonczylo)===parseInt(this.state.playersCount) && this.state.ending===false){
                       this.setState({ending:true})
                   }
               }



                this.setState({moveMade:true})
            }

        })
        .catch((err)=>{
            console.log(err)
        });



     }
     zakoncz = () =>{
         var gracz = this.state.players[this.state.currentPlayer]
         gracz.zakonczylGre = true



         
         var zakonczylo =0
         for (var i=0; i<this.state.playersCount;i++){
            if(this.state.players[i].zakonczylGre){
                zakonczylo++
            }
            if(parseInt(zakonczylo)===parseInt(this.state.playersCount) && this.state.ending===false){
                this.setState({ending:true})
            }
        }
        this.setState({moveMade:true})
     }

     checkIfWinnersShown = ()=>{
         this.setState({winnersShown:true})
     }
    render(){
        return(
            <div className='multiPlayer'>
                <div className="wyswietlaczMulti">
                    {this.coNapisac()}
                    <div onClick={(e)=>{this.kliknieto()}}>
                        {this.state.playersAdded ? <CardSelectorM gameStarted={this.state.gameStarted} zakonczono={this.state.ending} winners={this.state.winners} winnersShown={this.state.winnersShown} checkIfWinnersShown={this.checkIfWinnersShown} currentPlayer={this.state.currentPlayer} listaGraczy={this.state.players}/> : null}
                    </div>
                    Wynik gracza: {this.state.gameStarted && this.state.players? this.state.players[this.state.currentPlayer].points : 0}
                    {this.state.gameStarted? (
                    <div className="interakcja">
                        <div className="dawaj" onClick={this.dowalKarte}>
                            Dobierz!
                        </div>
                        <div className="koncz" onClick={this.zakoncz}>
                            Pass!
                        </div>
                    </div>
                    ):
                    null}
                </div>
            </div>
        )
    }




}


export default Multi