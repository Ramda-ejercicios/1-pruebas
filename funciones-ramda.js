import * as R from 'ramda';
import fetch from "node-fetch";


//*********************MAP, aplica una función a todos los atributos de un arreglo
const letters = ['a', 'b', 'c', 'd']
R.map(R.toUpper)(letters)
    // ['A', 'B', 'C', 'D']


//****************Filter and reject, Filtra de acuerdo a condiciones
R.filter(n => n % 2 === 0)([1, 2, 3, 4, 5, 6, 7, 8, 9])
    // [2, 4, 6, 8]
R.reject(n => n % 2 === 0)([1, 2, 3, 4, 5, 6, 7, 8, 9])
    // [1, 3, 5, 7, 9]

//*****************Reduce, aplica función a un arreglo con un argumento acumulador que almacena los resultados
R.reduce(R.add, 0)([1, 2, 3, 4, 5, 6, 7, 8, 9])
    // 45


R.reduce(R.concat, '')(['a', '1', 'b', '2', 'c', '3'])
    // a1b2c3

//Convierte un arreglo en un objeto donde los atributos son la key y los indices el valor
R.invertObj(['one', 'two', 'three'])
    // { 'one': 0, 'two': 1, 'three': 2 }

//*****************Pluck, extrae atributo de un objeto en arreglo de objetos
R.pluck('name')([
        { name: 'Axl Rose', instrument: 'vocals' },
        { name: 'Slash', instrument: 'guitar' },
        { name: 'Izzy Stradlin', instrument: 'guitar' },
        { name: 'Steven Adler', instrument: 'drums' },
        { name: 'Duff McKagan', instrument: 'bass guitar' }
    ])
    // [ 'Axl Rose', 'Slash', 'Izzy Stradlin', 'Steven Adler', 'Duff McKagan']

//**************Ordenamiento, ordena de acuerdo a función suministrada R.gt para mayor que y R.lt para menor que
const unsorted = [2, 1, 5, 4, 3]
R.sort(R.gt, unsorted)
    // [1, 2, 3, 4, 5]
R.sort(R.lt, unsorted)
    // [5, 4, 3, 2, 1]
R.reverse(unsorted)
    // [3, 4, 5, 1, 2]

//**************Lenses, nos proporciona herramientas para trabajar con objetos y sus atributos

const gunsAndRoses = {
    yearsActive: '1985-present',
    origin: 'Los Angeles',
    members: {
        /*...*/
    }
}

//Hace un acercamiento a la propiedad 'origin' del objeto
const originLens = R.lensProp('origin')

//Muestra la propiedad acercada con lens del objeto dado
R.view(originLens, gunsAndRoses)
    // 'Los Angeles'

//Realiza una modificación a la propiedad acercada con lens del objeto
R.set(originLens, 'Los Angeles, California', gunsAndRoses)
    // {... 'origin': 'Los Angeles, California' ...}

//Aplica una funcion a la propiedad acercada con lens del objeto
R.over(originLens, R.replace('Los Angeles', 'LA'), gunsAndRoses)
    // {... 'origin': 'LA' ...}

//****************Envolve, Similar a over, aplica una colección de transformaciones sobre un objeto
const theWho = {
    yearsActive: '1964-1982, 1989, 1996-present',
    origin: 'London',
    members: {
        singer: 'Roger Daltrey',
        guitarist: 'Pete Townshend',
        bassGuitarist: 'John Entwistle',
        drummer: 'Keith Moon'
    },
    followers: 787989,
    website: null,
    active: false
}

const bandUpdates = {
    bandName: 'The Who', // No existe la key, no aplica
    members: {
        drummer: R.always('Kenney Jones') // Es una función, aplica la transformación
    },
    followers: R.add(1500),
    website: R.always('theWho.com'),
    origin: 'London, UK', // No es una función, no aplica
    active: R.not
}

R.evolve(bandUpdates, theWho)
    // {
    //   yearsActive: '1964-1982, 1989, 1996-present',
    //   origin: 'London',
    //   members: {
    //     singer: 'Roger Daltrey',
    //     guitarist: 'Pete Townshend',
    //     bassGuitarist: 'John Entwistle',
    //     drummer: 'Kenney Jones'
    //   },
    //   followers: 789489,
    //   website: 'theWho.com',
    //   active: true
    // }

//******converge, Nos permite aplicar una lista de funciones sobre el mismo objeto

/* const theWho = {
    yearsActive: '1964-1982, 1989, 1996-present',
    origin: 'London',
    demonym: 'British',
    members: {
        singer: 'Roger Daltrey',
        guitarist: 'Pete Townshend',
        bassGuitarist: 'John Entwistle',
        drummer: 'Keith Moon'
    },
    followers: 787989,
    website: null,
    active: false
} */

let acdc = {
    bandName: 'AC/DC',
    yearsActive: '1973-present',
    origin: 'Sydney',
    demonym: 'Australian',
    members: {
        singer: 'Brian Johnson',
        guitarist: 'Angus Young',
        bassGuitarist: 'Stevie Young',
        drummer: 'Chris Slade'
    }
}

const pickSinger = R.path(['members', 'singer'])
const pickDemonym = R.prop('demonym')
const pickBandName = R.propOr('', 'bandName')
const processBand = (singer, demonym, bandName) => `${singer} is the lead singer of the ${demonym} rock band ${bandName}`

R.converge(processBand, [pickSinger, pickDemonym, pickBandName])(acdc)
    // Brian Johnson is the lead singer of the Australian rock band AC/DC

R.converge(processBand, [pickSinger, pickDemonym, pickBandName])(theWho)
    // Roger Daltrey is the lead singer of the British rock band


//**************** __ Underscore, nos ayuda a saltar argumentos en caso de ser necesario
const pickMetallicaProp = R.path(R.__, acdc)
pickMetallicaProp(['members', 'singer'])
    // Brian Johnson
pickMetallicaProp(['origin'])
    // Sydney

//***********************Tap, Ejecuta la función que se pasa como argumento al objeto que se incluye también como argumento y devuelve el objeto inicial.
const ledZeppelin = {
    bandName: 'Led Zeppelin',
    yearsActive: '1968-present',
    origin: 'London',
    demonym: 'United Kindom',
    members: {
        singer: 'Robert Plant',
        guitarist: 'Jimmy Page',
        bassGuitarist: 'John Paul Jones',
        drummer: 'John Bonham'
    }
}

const trace = R.tap(console.log)

const doSomeStuffWithBand = R.compose(
        trace, R.concat('Mr. '),
        trace, R.head,
        trace, R.reverse,
        trace, R.split(' '),
        trace, R.path(['members', 'drummer'])
    ) // Recordemos que compose va de derecha a izquierda

doSomeStuffWithBand(ledZeppelin)
    // 'Mr. Bonham'

//*********Memoize, Crea una nueva función que, cuando se invoca, almacena en caché el resultado de llamar fn a un conjunto de argumentos dado

let count = 0
const factorial = R.memoizeWith(R.identity, n => {
    count++
    return R.product(R.range(1, n + 1))
})

const factorialize = () => {
    console.time('factorialize')
    factorial(20000000)
    console.timeEnd('factorialize')
}

factorialize() // factorialize: 790.96484375ms
factorialize() // factorialize: 0.305908203125ms
factorialize() // factorialize: 0.044677734375ms
factorialize() // factorialize: 0.037841796875ms
factorialize() // factorialize: 0.06396484375ms

//**************Invoker

fetch('https://api.spotify.com/v1/artists/5M52tdBnJaKSvOpJGz8mfZ')
    .then(R.invoker(0, 'json'))
    .then(R.pickAll(['name', 'popularity', 'type']))
    // { 'name': 'Black Sabbath', 'popularity': 70, 'type': 'artist' }


//*********************************Logic, como cond, when, ifElse, or, not.
const blackSabbath = { name: 'Black Sabbath', category: 'Heavy Metal', tour: 'The End', ticketPrice: 140 }
const greenDay = { name: 'Green Day', category: 'Punk Rock', tour: '99 Revolutions Tour', ticketPrice: 80 }
acdc = { name: 'AC/DC', category: 'Hard Rock', tour: 'Rock or Bust World Tour', ticketPrice: 200 }
const rollingStones = { name: 'The Rolling Stones', category: 'Rock', tour: '', ticketPrice: 130 }

const tours = [blackSabbath, greenDay, acdc, rollingStones]

//Cond, es similar a un switch case, recibe un lista con arrays de 2 elementos, predicado y transformación

const assistanceChooser = R.cond([
    [R.propEq('category', 'Rock'), band => `I'll assit to the ${band.name} concert`], // Es un concierto de categoría Rock?
    [R.propSatisfies(R.lt(R.__, 100), 'ticketPrice'), R.always("As its cheap, I ll assist to the concert ")], // Es un concierto de menos de 100? [R.T, band => `I won'
    [R.T, band => `I won't assist to ${band.name} concert`] // Default case
])

assistanceChooser(greenDay)
    // 'As it's cheap, I'll assist to the concert'
assistanceChooser(rollingStones)
    // 'I'll assit to the The Rolling Stones concert'
assistanceChooser(blackSabbath)
    // 'I won't assist to Black Sabbath concert'

//When, aplica la segunda función pasada como parámetro, si la primera devuelve true al ejecutarse contra el objeto.
//Además aquí usamos allPass, para indicar que queremos aplicar una lista de condiciones y que todas se tienen que cumplir.

const purchaseTicket = R.when(
    R.allPass([
        R.propEq('name', 'Black Sabbath'),
        R.propSatisfies(R.lt(R.__, 150), 'ticketPrice')
    ]),
    R.assoc('ticketPurchased', true)
)

purchaseTicket(rollingStones)
    // No aplica ninguna transformación, no cumple ninguna de las condiciones de allPass
purchaseTicket(acdc)
    // No aplica ninguna transformación, el precio es superior a 150
purchaseTicket(blackSabbath)
    // Cumple todas las condiciones, añade ticketPurchased al objeto resultante
    // {'category': 'Heavy Metal', 'name': 'Black Sabbath', 'ticketPrice': 140, 'ticketPurchased': true, 'tour': 'The End'}

//and, or, any, both, not, isEmpty…
R.isEmpty(tours) // false, no esta vacio
R.not(R.isEmpty(tours)) // true, no esta vacio
R.not(R.isEmpty([])) // false, esta vacio

//Type, grupo de funciones para hacer comprobaciones u obtener el tipo de dato
R.is(Number, greenDay) // false
R.is(Object, acdc) // true