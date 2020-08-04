import React from 'react'
import CartSelectorM from './CardSelectorM'
import Cards from '../Api'
import CardSelectorM from './CardSelectorM'

const request = "https://deckofcardsapi.com/api/deck/"
class Multi extends React.Component{
    state={
        graRozpoczeta: false,
        wybieranieGraczy:true,
        iloscGraczy: 0,
        idDecka: null,
        aktualnyGracz: 0,
        konczymy: false,
        gracze: [],
        dodanoGraczy:false
    }

    componentDidUpdate(){
        if(this.state.iloscGraczy!==0 && this.state.wybieranieGraczy)
        {
            this.setState({wybieranieGraczy:false})
        }
        if(this.state.idDecka===null){
            if(this.state.iloscGraczy<=3){ 
                Cards.get(`${request}new/shuffle/?deck_count=1`).then((res)=>{
                    this.setState({idDecka:res.data.deck_id})
                    //console.log(`ID_decka : ${res.data.deck_id}`)
                }).catch((err)=>{
                    console.log(err)
                })
        }
        
    }

    //PONIZEJ JEST FORMAT DANYCH KAZDEGO Z GARCZY
    if(this.state.iloscGraczy!==0 && this.state.gracze.length===0 && this.state.idDecka!==null && !this.state.dodanoGraczy){
        var wykonaniePetli=0
        for(var i=0;i<this.state.iloscGraczy;i++){
            Cards.get(`${request}${this.state.idDecka}/draw/?count=2`)
            .then((res2)=>{
                //onsole.log(res2);
                this.setState({gracze:[...this.state.gracze,{
                    punkty:0,
                    posiadaneKarty:res2.data.cards,
                    zliczonoPunkty:false,
                    zakonczylGre:false
                }]})
            })
            .catch((err)=>{
                console.log(err)
            });
            wykonaniePetli+=1;
        }
        this.setState({dodanoGraczy:true})
        //console.log(`petla wykonala sie ${wykonaniePetli} razy`)
    }
    if(this.state.gracze.length!==0){
            //console.log(this.state.gracze)
    }

}


    coNapisac = () => {
        if (!this.state.graRozpoczeta && this.state.wybieranieGraczy) {
            //gra nie jest jeszcze rozpoczeta
            return (
                <div>
                    <h1>
                        Tryb wieloosobowy. Zaznacz ilość graczy:
                        <select className="select-css wewnatrz" onChange={(e) => {
                            this.setState({iloscGraczy: e.target.value})
                            //na razie bedzie opcja wyboru 2-3 graczy, ale moze dodam jeszcze "niestandardowa"
                        }}>
                            <option value={null} selected disabled hidden>wybierz</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </h1>

                </div>
            )
        }
        if(!this.state.wybieranieGraczy && !this.state.graRozpoczeta) {
            //console.log(this.state.graRozpoczeta)
            //gra sie rozpoczela
            return (
                <div className="ekranGry">
                    <div className="playerCounter">
                        <div className="tryb">
                            <img src="user-symbol.png" alt="User Symbol" />
                            <span>{this.state.iloscGraczy}</span>
                        </div>
                        <div className="aktualny">
                            <span id="text">
                                {this.state.graRozpoczeta? this.state.aktualnyGracz + 1 : null}
                            </span>
                        </div>
                    </div>
                    <h1> Kliknij, aby rozpocząć </h1>
                </div>

            )

        }
        if(this.state.graRozpoczeta){
            return(
                <div className="aktualny">
                    <span id="text">
                        <img src="user-symbol.png" alt="aktualnyGracz"></img>
                        {this.state.graRozpoczeta? this.state.aktualnyGracz + 1 : null}
                    </span>
                </div>
            )
        }
    }
    kliknieto = () =>{
    //po dodaniu graczy czas zaczac gre
    if(this.state.dodanoGraczy && !this.state.graRozpoczeta){
        this.setState({graRozpoczeta:true})
    }
    }


    render(){
        return(
            <div className='multiPlayer'>
                <div className="wyswietlaczMulti">
                    {this.coNapisac()}
                    <div onClick={(e)=>{this.kliknieto()}}>
                        {this.state.dodanoGraczy ? <CardSelectorM graRozpoczeta={this.state.graRozpoczeta} aktualnyGracz={this.state.aktualnyGracz} listaGraczy={this.state.gracze} iloscGraczy={this.state.iloscGraczy}/> : null}
                    </div>
                    Wynik gracza: {this.state.graRozpoczeta? this.state.gracze[this.state.aktualnyGracz].punkty : 0}
                    {this.state.graRozpoczeta? (
                    <div className="interakcja">
                        <div className="dawaj" onClick={this.dowalKarte}>
                            Dawaj!
                        </div>
                        <div className="koncz" onClick={this.zakoncz}>
                            Pass!
                        </div>
                    </div>
                    ):
                    null
                    }
                </div>
            </div>
        )
    }




}



export default Multi