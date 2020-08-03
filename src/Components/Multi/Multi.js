import React from 'react'
import CardSelectorMulti from './CardSelectorM'

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

    render() {
        return (
            <div className="multiPlayer">
                {this.coNapisac()}
                <CardSelectorMulti graRozpoczeta={this.state.graRozpoczeta} iloscGraczy={this.state.iloscGraczy} aktualnyGracz={this.state.aktualnyGracz} posiadaneKarty={this.state.posiadaneKarty}/>
            </div>
        )
    }
}


export default Multi