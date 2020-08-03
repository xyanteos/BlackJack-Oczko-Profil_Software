import React from 'react'
import CardSelectorMulti from './CardSelectorM'
import Cards from '../Api'
const request = "https://deckofcardsapi.com/api/deck/"
class Multi extends React.Component {
    state = {
        graRozpoczeta: false,
        iloscGraczy: 0,
        idDecka: null,
        aktualnyGracz: 0,
        konczymy: false,
        gracze: []
    }
    //zliczenie pkt
    policzPunkty = () => {
        var punktacja = 0
        this.state.posiadaneKarty.map((karta) => {
            //console.log(karta)
            //console.log(karta.value)
            if (isNaN(karta.value)) {
                if (karta.value === "QUEEN")
                    punktacja += 3
                if (karta.value === "KING")
                    punktacja += 4
                if (karta.value === "JACK")
                    punktacja += 2
                if (karta.value === "ACE")
                    punktacja += 11
            }
            else {
                punktacja += parseInt(karta.value)
            }
        })
        return (punktacja)
    }
    coNapisac = () => {
        if (!this.state.graRozpoczeta) {
            //gra nie jest jeszcze rozpoczeta
            return (
                <div>
                    <h1>
                        Tryb wieloosobowy. Zaznacz ilość graczy:
                        <select className="select-css wewnatrz" onChange={(e) => {
                            this.setState({ iloscGraczy: e.target.value })
                            this.pobierzTalie(e.target.value)
                            this.stworzGraczy(e.target.value)
                            this.setState({ graRozpoczeta: true })
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
        else {

            //gra sie rozpoczela
            return (
                <div className="playerCounter">
                    <div className="tryb">
                        <img src="user-symbol.png" alt="Aktualny Gracz" />
                        <span>{this.state.iloscGraczy}</span>
                    </div>
                    <div className="aktualny">
                        <span id="text">
                            {this.state.aktualnyGracz + 1}
                        </span>
                    </div>
                </div>
            )

        }


    }
    //talie trzeba stworzyc przed wywolaniem graczy, zeby mozna bylo z niej dobierac karty dla kazdego gracza.
    //przekaze ilosc graczy do tworzenia talii, zeby w przyszlosci moc stworzyc talie z wiekszej ilosci kart w ramach potrzeb (3<iloscGraczy) - pozwoli to pozbyc sie problemu\/
    //braku kart w talii do pobrania podczas gry
    pobierzTalie = (iluGraczy) =>{
        if(iluGraczy<=3){
            Cards.get(`${request}new/shuffle/?deck_count=1`).then((res)=>{
                //console.log(res)
                this.setState({idDecka:res.data.deck_id})
                //console.log(this.state.idDecka)
            })
            .catch((err)=>{
                console.log(err)
            })


        }
        else{
            var iloscTalii = Math.floor(iluGraczy/3)
            Cards.get(`${request}new/shuffle/?deck_count=${iloscTalii}`).then((res)=>{
                //console.log(res)
                this.setState({idDecka:res.data.deck_id})
                //console.log(this.state.idDecka)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
    stworzGraczy = (ilu) =>{
        var kartyStartowe = []
        for (var i=0;i<ilu;i++){
            Cards.get(`${request}${this.state.idDecka}/draw/?count=2`)
            .then((res)=>{
                //console.log(res2);
                kartyStartowe=res
            })
            .catch((err)=>{
                console.log(err)
            });
            this.setState({
                gracze:[...this.state.gracze, {
                    posiadaneKarty:kartyStartowe,
                    punkty:0,
                    zliczonoPunkty:false,
                    zakonczyl:false,
                }]
            })
        }
    }
    kliknietoKarty = () =>{
        if(this.state.graRozpoczeta && this.state.konczymy){
            this.restart()
        }
        if(!this.state.graRozpoczeta && this.state.iloscGraczy!=0){
            this.setState({graRozpoczeta:true})
        }
    }

    restart = () =>{
        this.setState({konczymy:false})
        this.setState({graRozpoczeta:false})
        this.setState({iloscGraczy:0})
        this.setState({idDecka:null})
        this.setState({aktualnyGracz:0})
        this.setState({gracze:[]})
    }


    render() {
        return (
            <div className="multiPlayer">
                {this.coNapisac()}
                <div className="wyswietlacz" onClick={this.kliknietoKarty()}>
                    <CardSelectorMulti graRozpoczeta={this.state.graRozpoczeta} gracze={this.state.gracze} aktualnyGracz={this.state.aktualnyGracz} konczymy={this.state.konczymy}/>
                </div>
                
            </div>
        )
    }
}


export default Multi