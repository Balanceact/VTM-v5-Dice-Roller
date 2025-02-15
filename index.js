const formRoller = document.querySelector(".form-roller");
const result = document.querySelector(".result");
const icons =  document.querySelector(".icons");
const willpowerReRoll = document.querySelector(".btn-WPRR");
const btnD10 = document.querySelector(".btn-d10");
const formDamage = document.querySelector(".form-damage");
const resultDamage = document.querySelector(".damage");
const resultCrit = document.querySelector(".crit");
const resultD10 = document.querySelector(".d10");

let black = [];
let red = [];
let damage = [];
let successes = 0;
let crits = 0;
let rerollable = 0;
let damageCrits = 0;
let damageSum = 0;
let d10Sum = 0;

function vampireDice() {
    return Math.floor(Math.random() * 10) + 1;
}

function clearArrays() {
    for (let index = 0; index < red.length; index++) {
        red[index] = 0;
    }
    for (let index = 0; index < black.length; index++) {
        black[index] = 0;
    }
}

function clearResults() {
    successes = 0;
    crits = 0;
    rerollable = 0;
    result.innerHTML = "Successes: " + successes;
    icons.innerHTML = " ";
}

function fillRed(hunger) {
    for (let index = 0; index < hunger; index++) {
        red[index] = vampireDice();
    }
}

function fillBlack(pool) {
    for (let index = 0; index < pool; index++) {
        black[index] = vampireDice();
    }
}

function sortBoth() {
    red.sort(function(a, b){return b - a});
    black.sort(function(a, b){return b - a});
}

function countSuccesses() {
    for (let index = 0; index < red.length; index++) {
        if (red[index] >= 6) {
            successes = successes + 1;
        }
        if (red[index] == 10) {
            crits = crits + 1;
        }
    }
    for (let index = 0; index < black.length; index++) {
        if (black[index] >= 6) {
            successes = successes + 1;
        }
        if (black[index] == 10) {
            crits = crits + 1;
        }
    }
    while (crits >= 2) {
        successes = successes + 2;
        crits = crits - 2;
    }
}

function printResults() {
    result.innerHTML = "Successes: " + successes;
    icons.innerHTML = "";
    for (let index = 0; index < red.length; index++) {
        switch (red[index]) {
            case 10:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/red-crit.png">';
                break;
            case 9:
            case 8:
            case 7:
            case 6:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/red-success.png">';
                break;
            case 5:
            case 4:
            case 3:
            case 2:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/red-fail.png">';
                break;
            case 1:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/bestial-fail.png">';
                break;
        }
    }
    icons.innerHTML = icons.innerHTML + '<div style="width: 100px;"></div>';
    for (let index = 0; index < black.length; index++) {
        switch (black[index]) {
            case 10:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/normal-crit.png">';
                break;
            case 9:
            case 8:
            case 7:
            case 6:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/normal-success.png">';
                break;
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
                icons.innerHTML = icons.innerHTML + '<img src="/assets/normal-fail.png">';
                break;
        }
    }
}

function rerollableNumber() {
    for (let index = 0; index < black.length; index++) {
        switch (black[index]) {
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
                if (rerollable < 3) {
                    rerollable++;
                }
                break;
        }
    }
}

function damageDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function fillDamage(d6s) {
    for (let index = 0; index < d6s; index++) {
        damage[index] = damageDice();
    }
}

function countDamage() {
    damageCrits = 0;
    damageSum = 0;
    resultDamage.innerHTML = "Damage dealt: ";
    resultCrit.innerHTML = " ";
    for (let index = 0; index < damage.length; index++) {
        switch (damage[index]) {
            case 6:
                damageCrits = damageCrits + 1;
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
                damageSum = damageSum + damage[index];
                resultDamage.innerHTML = resultDamage.innerHTML + damage[index];
                if (index < damage.length - 1) {
                    resultDamage.innerHTML = resultDamage.innerHTML + ", ";
                }
                break;
        }
    }
    if (damageCrits >= 2) {
        damageSum = damageSum + 5;
        resultCrit.innerHTML = "CRIT!";
    } else {
        resultCrit.innerHTML = " ";
    }

    resultDamage.innerHTML = resultDamage.innerHTML + " = " + damageSum;
}

function clearDamage() {
    for (let index = 0; index < damage.length; index++) {
        damage[index] = 0;
    }
}

function countD10s() {
    resultD10.innerHTML = "d10 = ";
    switch (d10Sum) {
        case 10:
            d10Sum += vampireDice();
            break;
        case 1:
            d10Sum -= vampireDice();
            break;
    }
    resultD10.innerHTML += d10Sum;
}

function clearD10s() {d10Sum = 0;}

formRoller.addEventListener("submit", (event) => {
    event.preventDefault();

    const hunger = formRoller.querySelector("#hunger").value;
    const pool = formRoller.querySelector("#pool").value - hunger;    

    clearArrays();
    clearResults();
    fillRed(hunger);
    fillBlack(pool);
    sortBoth();
    clearResults();
    countSuccesses();
    printResults();
    rerollableNumber();
});

willpowerReRoll.addEventListener("click", () => {
    for (let index = 0; index < black.length; index++) {
        if (black[index] <= 5 && rerollable > 0) {
            black[index] = vampireDice();
            rerollable--;
        }
    }
    sortBoth();
    clearResults();
    countSuccesses();
    printResults();
});

formDamage.addEventListener("submit", (event) => {
    event.preventDefault();

    const d6s = formDamage.querySelector(".select").value;

    fillDamage(d6s);
    countDamage();
    clearDamage();
});

btnD10.addEventListener("click", () => {
    d10Sum = vampireDice();
    countD10s();
    clearD10s();
});