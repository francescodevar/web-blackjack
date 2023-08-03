const myModule = (() => {
    'use strict'

    let deck = []
    const types = ["C", "D", "H", "S"],
        especials = ["A", "j", "Q", "K"];

    let pointsPlayers = [];

    //references html
    const btnHit = document.querySelector('#btnHit'),
        btnStand = document.querySelector('#btnStand');

    const divCardsPlayers = document.querySelectorAll('.divCards'),
        pointHTML = document.querySelectorAll('small');



    const startGame = (numPlayers = 2) => {
        deck = createDeck();

        pointsPlayers = [];
        for (let i = 0; i < numPlayers; i++) {
            pointsPlayers.push(0);
        }

        pointHTML.forEach(elem => elem.innerText = 0);
        divCardsPlayers.forEach(elem => elem.innerHTML = '');

        btnHit.disabled = false;
        btnStand.disabled = false;

    }

    //create new deck
    const createDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let type of types) {
                deck.push(i + type);
            }
        }

        for (let type of types) {
            for (let esp of especials) {
                deck.push(esp + type);
            }
        }
        return _.shuffle(deck);
    }

    //Hit a card
    const hitCard = () => {
        if (deck.length === 0) {
            throw 'There\s no cards on the deck';
        }
        return deck.pop();
    }

    const cardValue = (card) => {
        const value = card.substring(0, card.length - 1);
        return (isNaN(value)) ?
            (value === 'A') ? 11 : 10
            : value * 1
    }


    const accumulatePoints = (card, turn) => {
        pointsPlayers[turn] = pointsPlayers[turn] + cardValue(card);
        pointHTML[turn].innerText = pointsPlayers[turn];
        return pointsPlayers[turn];
    }

    const createCard = (card, turn) => {

        const imgCard = document.createElement('img');
        imgCard.src = `assets/cartas/${card}.png`
        imgCard.classList.add('card');
        divCardsPlayers[turn].append(imgCard);

    }

    const determinateWinner = () => {

        const [minPoints, pointsComputer] = pointsPlayers;

        setTimeout(() => {
            if (pointsComputer === minPoints) {
                alert('Push');
            } else if (minPoints > 21) {
                alert('Dealer win')
            } else if (pointsComputer > 21) {
                alert('You win');
            } else {
                alert('Dealer win')
            }
        }, 100);

    }

    //computer turn
    const computerTurn = (minPoints) => {

        let pointsComputer = 0;

        do {
            const card = hitCard();
            pointsComputer = accumulatePoints(card, pointsPlayers.length - 1);
            createCard(card, pointsPlayers.length - 1);

        } while ((pointsComputer < minPoints) && (minPoints <= 21));

        determinateWinner();
    }



    //Eevents
    btnHit.addEventListener('click', () => {

        const card = hitCard();
        const pointsPlayer = accumulatePoints(card, 0);

        createCard(card, 0);


        if (pointsPlayer > 21) {
            console.warn('You lose');
            btnHit.disabled = true;
            btnStand.disabled = true;
            computerTurn(pointsPlayer);

        } else if (pointsPlayer === 21) {
            console.warn('Blackjack!');
            btnHit.disabled = true;
            btnStand.disabled = true;
            computerTurn(pointsPlayer);
        }


    });

    btnStand.addEventListener('click', () => {
        btnHit.disabled = true;
        btnStand.disabled = true;
        computerTurn(pointsPlayers[0]);
    })


    return {
        newGame: startGame
    };
})();
