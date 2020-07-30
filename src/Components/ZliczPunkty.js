import React from 'react'

const ZliczPunkty = (props) =>{
    var wartosc=0
    console.log(props)
    const karty = props.karty.map((karta)=>{
        console.log(karta)
        if(isNaN(karta.value)){
            switch(karta.value){
                case 'KING':
                    {
                        wartosc+=4
                        return(4)
                    }

                case 'QUEEN':
                    {
                        wartosc+=3
                        return(3)
                    }


                case 'ACE':
                    {
                        wartosc+=11
                        return(11)
                    }

                case 'JACK':
                    {
                        wartosc+=2
                        return(2)
                    }


                default:
                    {
                        console.log("cos poszlo nie tak ze switch-casem w zliczaniu");
                        return(0)
                    }

            }
            

        }
        // else{
        //     return wartosc=parseInt(wartosc)+parseInt(karta.value)
        // }
        return wartosc=parseInt(wartosc)+parseInt(karta.value)
    })

    console.log(wartosc)

    return(wartosc)
}



export default ZliczPunkty