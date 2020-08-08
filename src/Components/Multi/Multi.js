import React from 'react'
import CartSelectorM from './CardSelectorM'
import Cards from '../Api'
import CardSelectorM from './CardSelectorM'


            // this.state.gracze.forEach(gracz =>{
            //     //console.log(gracz)
            //     if(parseInt(gracz.punkty)===21)
            //     this.setState({zwyciezcy:[...zwyciezcy,gracz]})
            // })


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
        dodanoGraczy:false,
        wykonanoRuch:false,
        zwyciezcy:[] ,
        pokazanoZwyciezcow: false
    }
    componentDidMount(){
        this.baseState = this.state
    }
    zresetujGre = () =>{
        this.setState(this.baseState)
    }

    zwyciezcaDodanyDoListy = () =>{
        //moglbym z tego zrobic ogolna metode z 2ma inputami i outputem true/false, ale robie tylko na potrzeby tego przypadku...
        var tak=false;
        var listaZwyciezcow = [...this.state.zwyciezcy]
        var listaGraczy = [...this.state.gracze]
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
        if(this.state.konczymy){
            console.log('gra sie zakonczyla')

            //jesli jeszcze nie ma zwyciezcow
            var sprawdzonoZwyciezcow=false
            if( !sprawdzonoZwyciezcow && this.state.dodanoGraczy && this.state.pokazanoZwyciezcow){
                var osiagnietoMax=false
                for (var i=0;i<this.state.iloscGraczy;i++){
                    //musze sie upewnic ze nie ma jeszcze dodanego tego zwyciezcy
                    if(this.state.gracze[i].punkty===21 && !this.zwyciezcaDodanyDoListy()){
                        this.setState({zwyciezcy:[...this.state.zwyciezcy,this.state.gracze[i]]})
                        if(!osiagnietoMax){
                            osiagnietoMax=true
                        }
                    }
                    
                    if(this.state.gracze[i].punkty===22 && this.state.gracze[i].posiadaneKarty.length===2 && !this.zwyciezcaDodanyDoListy()){
                        //oczko, gracz ma 2 asy
                        this.setState({zwyciezcy:[...this.state.zwyciezcy, this.state.gracze[i]]})
                        osiagnietoMax=true
                    }
    
                }
                if(!osiagnietoMax){
                    var maxymalnaWartoscPkt=0
                    for(var j=0;j<this.state.iloscGraczy;j++){
                        if(this.state.gracze[j].punkty>maxymalnaWartoscPkt && this.state.gracze[j].punkty<21)
                        maxymalnaWartoscPkt=this.state.gracze[j].punkty
                        //console.log(this.state.gracze[j].punkty)
                    }
                    //console.log(maxymalnaWartoscPkt)
                    for(var i=0;i<this.state.iloscGraczy;i++){
                        if(this.state.gracze[i].punkty===maxymalnaWartoscPkt && !this.zwyciezcaDodanyDoListy()){
                            this.setState({zwyciezcy:[...this.state.zwyciezcy,this.state.gracze[i]]})
                        }
                    }
                }
                sprawdzonoZwyciezcow=true
                
            }
            if(this.state.zwyciezcy.length===0 && this.state.sprawdzonoZwyciezcow){
                //brak zwyciezcow, wszyscy przegrali
                console.log('brak zwyciezcow, wszyscy przegrali...')
            }

            
            // console.log('zwyciezcy:')
            // console.log(this.state.zwyciezcy)
            // console.log("indexy zwyciezkich graczy : "+this.state.zwyciezcy)
        }
        //po zakonczonym ruchu zmien gracza
        if(this.state.wykonanoRuch){
            
            if(this.state.aktualnyGracz===this.state.iloscGraczy-1)
            {
                
                this.setState({aktualnyGracz:0})
                this.setState({wykonanoRuch:false})
            }
            else{
                this.setState({aktualnyGracz: this.state.aktualnyGracz+1})  
                this.setState({wykonanoRuch:false})
            }
            
        }


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
        //tutaj bedzie moglo sie znalezc zapytanie jak bedzie wiecej graczy niz 3.
        
    }

    //PONIZEJ JEST FORMAT DANYCH KAZDEGO Z GARCZY
    if(this.state.iloscGraczy!==0 && this.state.gracze.length===0 && this.state.idDecka!==null && !this.state.dodanoGraczy){
        var wykonaniePetli=0
        for(var i=0;i<this.state.iloscGraczy;i++){
            Cards.get(`${request}${this.state.idDecka}/draw/?count=2`)
            .then((res2)=>{
                //console.log(res2);
                //musze policzyc punkty zanim rozpoczne rozgrywke zeby moc stwierdzic kto wygral od razu po rozdaniu
                var val = this.policzPunkty(res2.data.cards)
                this.setState({gracze:[...this.state.gracze,{
                    id:i,
                    punkty:val,
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
        //trzeba policzyc wyniki i powiedziec kiedy konczymy, nastepnie wytypowac zwyciezce


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
                    /<span>{this.state.iloscGraczy? this.state.iloscGraczy : null}</span>
                </div>
            )
        }
    }
    kliknieto = () =>{
    //po dodaniu graczy czas zaczac gre
        if(this.state.dodanoGraczy && !this.state.graRozpoczeta){
            this.setState({graRozpoczeta:true})
        }
        if(this.state.konczymy && this.state.pokazanoZwyciezcow){
            this.zresetujGre()
            //console.log(this.state)
        }
    }

    policzPunkty = (kartyLista) =>{
        var punktacja = 0
        kartyLista.map((karta)=>{
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

     dowalKarte = () =>{
        Cards.get(`${request}${this.state.idDecka}/draw/?count=1`)
        .then((res1)=>{
            //console.log(res1);
            var val = this.policzPunkty(res1.data.cards)
            //okazuje sie ze zeby zmienic "nested"(zagniezdzony) state, trzeba uzyc tymczasowej zmiennej... (._ .)
            var listaGraczy = [...this.state.gracze]
            listaGraczy[this.state.aktualnyGracz].punkty+=val;
            
            listaGraczy[this.state.aktualnyGracz].posiadaneKarty=[...listaGraczy[this.state.aktualnyGracz].posiadaneKarty,res1.data.cards[0]]
            listaGraczy[this.state.aktualnyGracz].zliczonoPunkty=true;
            //console.log([...listaGraczy[this.state.aktualnyGracz].posiadaneKarty,res1.data.cards[0]]) => działa
            //console.log(listaGraczy[this.state.aktualnyGracz].punkty+val) -> działa
            this.setState({gracze:listaGraczy})

            //ciezkie, ale działa \/
            if(this.state.gracze[this.state.aktualnyGracz].punkty>=21){
                var gracz = this.state.gracze[this.state.aktualnyGracz]
                gracz.zakonczylGre = true

                var zakonczylo =0
                for (var i=0; i<this.state.iloscGraczy;i++){
                   if(this.state.gracze[i].zakonczylGre){
                       zakonczylo++
                   }
                   if(parseInt(zakonczylo)===parseInt(this.state.iloscGraczy) && this.state.konczymy===false){
                       this.setState({konczymy:true})
                   }
               }



                this.setState({wykonanoRuch:true})
            }

        })
        .catch((err)=>{
            console.log(err)
        });



     }
     zakoncz = () =>{
         var gracz = this.state.gracze[this.state.aktualnyGracz]
         gracz.zakonczylGre = true



         
         var zakonczylo =0
         for (var i=0; i<this.state.iloscGraczy;i++){
            if(this.state.gracze[i].zakonczylGre){
                zakonczylo++
            }
            if(parseInt(zakonczylo)===parseInt(this.state.iloscGraczy) && this.state.konczymy===false){
                this.setState({konczymy:true})
            }
        }
        this.setState({wykonanoRuch:true})
     }

     sprawdzCzyWyswietlonoZwyciezcow = ()=>{
         this.setState({pokazanoZwyciezcow:true})
     }
    render(){
        return(
            <div className='multiPlayer'>
                <div className="wyswietlaczMulti">
                    {this.coNapisac()}
                    <div onClick={(e)=>{this.kliknieto()}}>
                        {this.state.dodanoGraczy ? <CardSelectorM graRozpoczeta={this.state.graRozpoczeta} zakonczono={this.state.konczymy} zwyciezcy={this.state.zwyciezcy} pokazanoZwyciezcow={this.state.pokazanoZwyciezcow} zwyciezcyPokazani={this.sprawdzCzyWyswietlonoZwyciezcow} aktualnyGracz={this.state.aktualnyGracz} listaGraczy={this.state.gracze}/> : null}
                    </div>
                    Wynik gracza: {this.state.graRozpoczeta && this.state.gracze? this.state.gracze[this.state.aktualnyGracz].punkty : 0}
                    {this.state.graRozpoczeta? (
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