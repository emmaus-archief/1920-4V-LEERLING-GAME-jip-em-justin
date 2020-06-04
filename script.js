/// @ts-check
/// <reference path=".gitpod/p5.global-mode.d.ts" />
"use strict";

/* Game opdracht
   Informatica - Emmauscollege Rotterdam
   Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
 */




/* ********************************************* */
/* globale variabelen die je gebruikt in je game */
/* ********************************************* */


let img;
function preload() {
    img = loadImage('./space-background.jpg');
}


const UITLEG = 0;
const SPELEN = 1;
const GAMEOVER = 2;
var spelStatus = SPELEN;

var spelerX = 600; // x-positie van speler
var spelerY = 750; // y-positie van speler

const spelerSnelheid = 5;

var kogelX = 0;    // x-positie van kogel
var kogelY = 0;    // y-positie van kogel

var vijandX = 0;   // x-positie van vijand
var vijandY = 0;   // y-positie van vijand

var score = 0; // aantal behaalde punten

var balletjes = []; // nested array van vijand balletjes (zie uitleg hieronder)
// een nested array is een array in een array. De x positie van het balletje
// staat in de eerste waarde van de array, de y positie in de tweede waarde.
// Als je bijvoorbeeld 2 balletjes wilt, eentje met x = 10 en y = 20 en de andere
// met x = 50 en y = 100, krijg je dit: [ [10,20], [50,100] ]

var balletjesInterval = 600; // het aantal milliseconden tussen de balletjes in



/* ********************************************* */
/*      functies die je gebruikt in je game      */
/* ********************************************* */


// VELD

var tekenVeld = function() {
 // plaats gamebackground
 image(img, 0, 0, 1200, 800);
}

// SPELER

var tekenSpeler = function(x, y) {
 fill("green");
 ellipse(x, y, 50, 50);
};

var beweegSpeler = function() {
  if(keyIsDown(UP_ARROW)) {
    spelerY -= spelerSnelheid;
  }
  if(keyIsDown(DOWN_ARROW)) {
    spelerY += spelerSnelheid;
  }
};

// BALLETJES

var nieuwBalletje = function() {
  var balletjeY = random(100, 670); // bepaal een willekeurige Y positie voor het balletje
  balletjes.push([-20, balletjeY]); // voeg het balletje toe aan de array, de X begint bij -20 (het balletje begint links van het scherm)
  setTimeout(nieuwBalletje, balletjesInterval); // voer deze functie na een bepaald aantal miliseconden nog een keer uit om weer een nieuw balletje toe te voegen
};
var tekenBalletje = function(x, y) {
  fill("red");
  ellipse(x, y, 20, 20); // teken het balletje
};
var beweegBalletje = function(index) {
  balletjes[index][0] += 5; // op basis van de index die deze functie heeft gekregen tel je een getal bij de X positie op zodat het balletje naar rechts beweegt
};


var checkSpelerGeraakt = function(balletjeX, balletjeY) {
  return false;
};


/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
  createCanvas(1200, 800);

  // Kleur de achtergrond blauw, zodat je het kunt zien
  background('black');

  nieuwBalletje(); // voeg het eerste balletje toe aan het scherm
}



/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  switch (spelStatus) {
    case SPELEN:
      tekenVeld();
      tekenSpeler(spelerX, spelerY);
      beweegSpeler();

      // dit hierna gaat allemaal over de balletjes
      var teVerwijderen;
      balletjes.forEach(function(balletjeArray, index) { // ga door de lijst van balletjes heen
        // belangrijk om te weten: de index is de plaats in de array
        var balletjeX = balletjeArray[0]; // de x positie is de eerste waarde van de array
        var balletjeY = balletjeArray[1]; // de y positie is de tweede waarde van de array
        tekenBalletje(balletjeX, balletjeY); // teken het balletje
        beweegBalletje(index); // beweeg het balletje, geef de x positie door om die te kunnen veranderen
        if(balletjeX > 1250) { // als het balletje uit het veld is
          teVerwijderen = index;
        }
        if(checkSpelerGeraakt(balletjeX, balletjeY)) { // check of de speler geraakt is op basis van de positie van het balletje
          spelStatus = GAMEOVER; // als de speler geraakt is verandert de spelstatus naar game over
        }
      });
      if(teVerwijderen) { // als teVerwijderen een waarde heeft gekregen dan moet er een balletje weggehaald worden
        balletjes.splice(teVerwijderen, 1); // verwijder het balletje uit de array (om geheugen te besparen)
      }

      break;
    case GAMEOVER:
      fill("white");
      textSize(50);
      text("Game over!", 300, 200);
      textSize(30);
      text("je bent dood", 300, 400);
  }
}

setInterval(function() {
    // laat de balletjes steeds sneller gaan
    // dit stukje code wordt elke seconde uitgevoerd,
    // dus elke seconde gaat er 50 af van de interval waarmee
    // de balletjes worden gespawnd. Er komen dus steeds meer balletjes totdat de interval 50 is
    if(balletjesInterval > 50) {
        balletjesInterval -= 25;
    }
}, 1000)