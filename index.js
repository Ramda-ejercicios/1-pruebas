/* //ordenar
import { always, ascend, comparator, cond, descend, equals, ifElse, multiply, pipe, prop, sort, when } from 'ramda';

let people = [{
    height: 23
}, {
    height: 230
}, {
    height: 2.3
}];


//const byHeight = ascend(prop('height'));
//ascendente
//const result = sort(ascend(prop('height')), people);
//descendente
let result = sort(descend(prop('height')), people);

console.log({ result });

// ordenar con comparador


people = [{ height: 20 }, { height: 10 }];

const compareHeights = (a, b) => a.height < b.height;
const byHeight = comparator(compareHeights);
//const byHeight = comparator(ascend(prop('height')));

//result = sort(byHeight, people);
result = sort(
    comparator(
        ascend(
            prop('height')
        )
    ), people);
console.log({ result });




const hasAccess = true;

let logAccess = ifElse(
    (hasAccess) => hasAccess,
    () => 'Access granted.',
    () => 'Access denied.');

result = logAccess(true)
console.log({ result });


//operador ifElse
logAccess = ifElse(
    equals(true),
    always('Access granted.'),
    always('Access denied.')
);

result = logAccess(true);

console.log({ result });

//operador when
let isEven = (num) => num % 2 === 0;

let doubleIfEven = when(
    isEven,
    (num) => num * 2
);

console.log(
    doubleIfEven(100),
    doubleIfEven(101)
);


// otra forma usando el operador multiplicación de ramda
isEven = (num) => num % 2 === 0;

doubleIfEven = when(
    isEven,
    multiply(2)
);

console.log(
    doubleIfEven(100),
    doubleIfEven(101)
);

//

let findAnimal = pipe(
    when(equals('lion'), always('Africa and India')),
    when(equals('tiger'), always('China, Russia, India, Vietnam, and many more')),
    when(equals('hyena'), always('African Savannah')),
    when(equals('grizzly bear'), always('North America')),
);

console.log(findAnimal('lion'));




findAnimal = cond([
    [equals('lion'), always('Africa and India')],
    [equals('tiger'), always('China, Russia, India, Vietnam, and many more')],
    [equals('hyena'), always('African Savannah')],
    [equals('grizzly bear'), always('North America')],
    [always(true), always('Not sure, try Googling it!')]
]);

console.log(findAnimal('cow'));


///////////////////

import { compose } from 'ramda';

const doMath = compose(
    double, // 162
    square, // 81
    triple, // 9
    increment // 2 + 1 = 3
    // start here
);

const result = doMath(2);

console.log({ result });



import { pipe } from 'ramda';

const upperAndReverseFirstName = pipe(
    getFirstName,
    uppercaseString,
    reverseString
);

const result = upperAndReverseFirstName({
    firstName: 'Bobo'
});

console.log({ result }); */

/* // solucion con funcion flecha map,reduce
import { prop, map, sum, reduce } from 'ramda';
import cart from './cart.js';

const getTotalPrice = (items) => items
    .map(item => item.price)
    .reduce((acc, val) => acc + val);
const price = getTotalPrice(cart); // '$44.20'
console.log({ price });
 */
// solucion con ramda

/* import { add, map, pipe, pluck, prop, reduce, sum } from 'ramda';
import cart from './cart.js';

const toUSD = (amount) => amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
});

const getTotalPrice = pipe(
    //map(prop('price')),
    pluck('price'),
    //reduce(add, 0),
    sum,
    toUSD
);

const result = getTotalPrice(cart);

console.log({ result }); */
//////////////////////////////////////////////////////////////////////////////

/* import { head, pipe, pluck, prop, sortBy, sortWith } from 'ramda';

import cart from './cart2.js';

const getCheapestItem = pipe(
    sortBy(prop('price')),
    head,
    prop('name')
);

const cheapestItem = getCheapestItem(cart); // 'apple'
console.log(cheapestItem)
 */

///////////////////////////////////////////////
/* 
import { pipe, sort, prop, descend, slice } from 'ramda';
import menu from './menu';

const getTop3MealsFor = pipe(
    sort(
        descend(prop('rating'))
    ),
    slice(0, 3)
);
console.log(getTop3MealsFor(menu)) */

///////////////////////////////////////////////////////////

/* import { lensPath, map, view, set, toUpper, concat, compose, pipe, over } from 'ramda';
import employees from './employees';
const flavorPath = lensPath([
    "interests",
    "foods",
    "sweets",
    "iceCream",
    "favoriteFlavor"
]);

const FlavorsModificador = map(
    over(
        flavorPath,
        pipe(
            toUpper,
            (atributo) => `${atributo} IS A GREAT FLAVOR`
        )
    ), employees)

const atributos = map(view(flavorPath), FlavorsModificador)
console.log(atributos) */

import { map, compose, lensProp, over, propEq, T, cond, identity, match, add, not, empty, isEmpty, propSatisfies } from 'ramda';

const blackSabbath = { name: 'Black Sabbath', category: 'Heavy Metal', price: 140, purchased: 9376, total: 20000 }
const defLeppard = { name: 'Def Leppard', category: 'Rock', price: 125, purchased: 8423, total: 15000 }
const greenDay = { name: 'Green Day', category: 'Punk Rock', price: 80, purchased: 1425, total: 15000 }
const acdc = { name: 'AC/DC', category: 'Hard Rock', price: 200, purchased: 24765, total: 25000 }
const rollingStones = { name: 'The Rolling Stones', category: 'Rock', price: 130, purchased: 5671, total: 25000 }

const nextConcerts = [greenDay, defLeppard, blackSabbath, acdc, rollingStones]

//Lenses
const priceLens = lensProp('price')
const radioLens = lensProp('radio')
const purchasedLens = lensProp('purchased')

//Discounts
const calculateDiscount = perc => amt => amt - amt * (perc / 100)
const discount = d => over(priceLens, calculateDiscount(d))
const fivePercentDiscount = discount(5)
const tenPercentDiscount = discount(10)
const twentyPercentDiscount = discount(20)

//Other transformations not related with the price
const includeRadioAds = over(radioLens, T)
const partnershipRadioTickets = over(purchasedLens, add(300))

//Campaings predicates
const isAlmostFull = ({ total, purchased }) => total - purchased < 1000
const isGreenDay = propEq('name', 'Green Day')
const containsRock = compose(not, isEmpty, match(/(rock)/gi))
const hasRockCategory = propSatisfies(containsRock, 'category')

//Special campaings
const lastTicketsCampaing = compose(twentyPercentDiscount, includeRadioAds)
const radioRockCampaing = compose(fivePercentDiscount, includeRadioAds, partnershipRadioTickets)
const greenDayCampaing = tenPercentDiscount

//Map campaings with its transformations
const configureCampaings = cond([
    [isAlmostFull, lastTicketsCampaing],
    [isGreenDay, greenDayCampaing],
    [hasRockCategory, radioRockCampaing],
    [T, identity]
])

//Apply the campaings to all the concerts
const applyCampaings = map(configureCampaings)

//Run it!
applyCampaings(nextConcerts)