let display = document.getElementById("display");
let current = "0";
let previous = null;
let operator = null;
let lastDivZero = false; // flag to mark a divide-by-zero event


function updateDisplay() {
display.textContent = current;
}


function handleNumber(value) {
// If we just hit a divide-by-zero, typing a number should replace the 0
if (lastDivZero) {
current = value;
lastDivZero = false;
return;
}


if (current === "0") current = value;
else current += value;
}


function handleDecimal() {
if (lastDivZero) {
current = "0.";
lastDivZero = false;
return;
}
if (!current.includes(".")) current += ".";
}


function handleOperator(op) {
// If previous operation ended with divide-by-zero, treat previous as 0
if (lastDivZero) {
previous = "0";
lastDivZero = false;
} else {
previous = current;
}
operator = op;
current = "0";
}

function calculate() {
if (previous === null || !operator) return;


const a = parseFloat(previous);
const b = parseFloat(current);


if (Number.isNaN(a) || Number.isNaN(b)) {
// Reset to a clean state if something went wrong
current = "0";
previous = null;
operator = null;
lastDivZero = false;
return;
}


let result = 0;


switch (operator) {
case "+": result = a + b; break;
case "-": result = a - b; break;
case "*": result = a * b; break;
case "/":
if (b === 0) {
// Instead of producing NaN, return an actual 0 and reset state
current = "0";
previous = null;
operator = null;
lastDivZero = true;
return;
}
result = a / b;
break;
}


// Normalize result (avoid long floating strings)
if (Number.isFinite(result)) {
// trim trailing zeros
current = String(Number(result.toPrecision(12))).replace(/(?:\.0+|(?<=\.)0+)$/,'');
} else {
current = "0"; // fallback
}


previous = null;
operator = null;
lastDivZero = false;
}

function handleAction(action) {
if (action === "clear") {
current = "0";
previous = null;
operator = null;
lastDivZero = false;
} else if (action === "plus-minus") {
current = String(parseFloat(current) * -1);
} else if (action === "percent") {
current = String(parseFloat(current) / 100);
} else if (action === "equals") {
calculate();
}
}


// Button clicks
document.querySelectorAll(".btn").forEach(btn => {
btn.addEventListener("click", () => {
const value = btn.dataset.value;
const action = btn.dataset.action;


if (value !== undefined) {
if (value === ".") handleDecimal();
else handleNumber(value);
} else if (action) {
handleAction(action);
}


if (btn.classList.contains("operator") && value) {
handleOperator(value);
}


updateDisplay();
});
});