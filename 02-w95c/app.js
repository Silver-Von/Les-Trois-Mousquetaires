/* ---------------------------------- CLASS --------------------------------- */
class Calculator {
  constructor(defaultNumber, digits) {
    this.clearNumbers('clear-all')
    this.defaultNumber = defaultNumber
    this.digits = digits
    this.memoryCache = 0

    displayNumber.innerText = this.defaultNumber
  }

  inputNumber(number) {
    if (number !== '+/-') {
      if (this.formula.length === 3) this.formula = []
      if (number !== '.' && this.defaultNumber === '0') this.defaultNumber = ''
      if (number === '.' && this.defaultNumber.includes('.')) return
      this.defaultNumber = this.defaultNumber.toString() + number.toString()
    } else {
      if (this.formula.length < 3) {
        if (this.defaultNumber !== '0')
          this.defaultNumber =
            this.defaultNumber.includes('-') ?
              -parseFloat(this.defaultNumber) :
              -parseFloat(this.defaultNumber)
        if (this.defaultNumber === '0' || !this.defaultNumber)
          this.defaultNumber = '0'
      } else {
        this.formula = []
        this.defaultNumber =
          displayNumber.innerText.includes('-')
            ? -parseFloat(displayNumber.innerText)
            : -parseFloat(displayNumber.innerText)
      }
      this.defaultNumber = this.defaultNumber.toString()
    }

    if (this.defaultNumber.includes('.')) this.digits = 14
    displayNumber.innerText = this.defaultNumber.substr(0, this.digits)
  }

  clearNumbers(key) {
    switch (key) {
      case 'clear-all':
        displayNumber.innerText = '0'
        this.defaultNumber = ''
        this.firstOperand = NaN
        this.secondOperand = NaN
        this.currentOperator = undefined
        this.previousOperator = undefined
        this.formula = []
        this.resultNumber = NaN
        break;

      case 'clear-entry':
        displayNumber.innerText = '0'
        this.defaultNumber = ''
        this.secondOperand = NaN
        break;

      case 'backspace':
        if (!this.resultNumber) {
          displayNumber.innerText = displayNumber.innerText.slice(0, -1)
          this.defaultNumber = this.defaultNumber.slice(0, -1)
        }
        if (!displayNumber.innerText.length) displayNumber.innerText = '0'
        break;

      default: break;
    }
  }

  writeFormula(operator) {
    this.currentOperator = operator

    if (this.currentOperator !== 'equals') {
      if (this.formula.length === 3) this.formula.pop()
      this.previousOperator = this.currentOperator

      if (!this.formula.length) {
        this.firstOperand = parseFloat(this.defaultNumber)
        this.formula.push(this.firstOperand, this.currentOperator)
        this.defaultNumber = ''
      }

      if (this.formula.length && !this.defaultNumber) {
        this.formula.pop()
        this.formula.push(this.currentOperator)
      }

      if (this.defaultNumber) {
        this.secondOperand = parseFloat(this.defaultNumber)
        this.formula.push(this.secondOperand)
        this.basicCalculation()
      }
    } else {
      if (!this.formula.length) return

      if (this.formula.length === 2 && !this.defaultNumber) {
        this.secondOperand = this.firstOperand
        this.formula.push(this.secondOperand)
      }

      if (this.formula.length === 2 && this.defaultNumber) {
        this.secondOperand = parseFloat(this.defaultNumber)
        this.formula.push(this.secondOperand)
      }

      if (this.formula.length === 3) {
        this.basicCalculation()
        return
      }

      this.basicCalculation()
    }
  }

  basicCalculation() {
    switch (this.formula[1]) {
      case 'addition': this.resultNumber = this.formula[0] + this.formula[2]
        break;
      case 'subtraction': this.resultNumber = this.formula[0] - this.formula[2]
        break;
      case 'multiplication': this.resultNumber = this.formula[0] * this.formula[2]
        break;
      case 'division':
        if (this.formula[2] !== 0)
          this.resultNumber =
            this.formula[0] === 88888888 && this.formula[2] === 7.2
              ? "My dad taught me this, he's awesome! " + "12345678"
              : this.resultNumber = this.formula[0] / this.formula[2]
        else this.resultNumber = 'Cannot divide by zero'
        break;
      default: break;
    }

    displayNumber.innerText = this.resultNumber.toString()
    this.formula = []
    this.defaultNumber = ''

    if (this.currentOperator !== 'equals')
      this.formula.push(this.resultNumber, this.currentOperator)
    else
      this.formula.push(this.resultNumber, this.previousOperator, this.secondOperand)
  }

  advancedCalculation(operator) {
    switch (operator) {
      case 'square-root':
        this.resultNumber =
          !displayNumber.innerText.includes('-')
            ? Math.sqrt(parseFloat(displayNumber.innerText))
            : 'Result of function is undefined.'
        break;

      case 'percent':
        if (this.formula.length === 2) {
          this.secondOperand = parseFloat(displayNumber.innerText);
          this.resultNumber = this.firstOperand * this.secondOperand * 0.01;
        } else this.resultNumber = 0;
        break;

      case 'reciprocal':
        this.resultNumber =
          displayNumber.innerText !== '0'
            ? 1 / parseFloat(displayNumber.innerText)
            : 'Cannot divide by zero'
        break;

      default: break;
    }

    if (!isNaN(this.resultNumber)) this.defaultNumber = this.resultNumber.toString()
    displayNumber.innerText = this.resultNumber.toString()
    this.formula = []
  }

  memoryActions(key) {
    switch (key) {
      case 'memory-clear': this.memoryCache = 0
        break;
      case 'memory-recall':
        if (this.memoryCache) {
          displayNumber.innerText = this.memoryCache.toString()
          this.defaultNumber = this.memoryCache.toString()
        }
        break;
      case 'memory-store':
        if (displayNumber.innerText !== '0')
          if (!this.formula.length && this.defaultNumber !== '0' ||
            this.formula.length === 2 && this.defaultNumber ||
            this.formula.length === 3 && this.resultNumber) {
            this.memoryCache = parseFloat(displayNumber.innerText)
          }
        this.defaultNumber = ''
        break;
      case 'memory-add':
        if (this.formula.length === 3) {
          this.memoryCache += this.resultNumber
          this.formula = []
        }
        this.defaultNumber = ''
        break;
      default:
        break;
    }



    displayMemory.style.display = this.memoryCache ? 'block' : 'none'
  }
}


/* -------------------------------- ELEMENTS -------------------------------- */
// DISPLAY
const displayNumber = document.getElementById('number-display');
const displayMemory = document.getElementById('memory-display');

// CLEANSING BUTTONS
const cleansingButtons = document.querySelectorAll('[cleansing-buttons]')

// NUMBER BUTTONS
const numberButtons = document.querySelectorAll('.numbers');

// OPERATOR BUTTONS
const basicOperatorButtons = document.querySelectorAll('[basic-operators]');
const advancedOperatorButtons = document.querySelectorAll('[advanced-operators]');

// MEMORY BUTTONS
const memoryButtons = document.querySelectorAll('[memory-buttons]')


/* -------------------------------- INSTANCE -------------------------------- */
const calculator = new Calculator('0', digits = 13)


/* --------------------------------- EVENTS --------------------------------- */
cleansingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.clearNumbers(button.attributes[1].value);
  })
})

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.inputNumber(button.innerText);
  })
})

basicOperatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.writeFormula(button.attributes[1].value);
  })
})

advancedOperatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.advancedCalculation(button.attributes[1].value);
  })
})

memoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.memoryActions(button.attributes[1].value);
  })
})


/*
MC = Memory Clear sets the memory to 0
MR = Memory Recall uses the number in memory, acts as if you had keyed in that number yourself
MS = Memory Store puts the number on the display into the memory
M+ = Memory Add takes the number on the display, adds it to the memory, and puts the result into memory

The buttons can be handy for doing repeated calculations with a single number. For instance, if you wanted to multiply a bunch of numbers by pi, you could key in the following:

3.14159.. MS (stores the number)
4 x MR = (gives you 4 times pi)
25 x 25 x MR = (gives you 25x25 times pi)

The M+ button can be handy for figuring out complicated expressions if you don't happen to have a scientific calculator. For example, to calculate (5 x 6) + (12 x 2) + (3 x 7), you can do the following:

5 x 6 = (calculator says 30)
MS (stores 30 in memory)
12 x 2 = (calculator says 24)
M+ (takes 24, adds it to 30, stores result 54 in memory)
3 x 7 = (21)
M+ (takes 54, adds 21, stores the result 75)
MR (displays the result 75)
*/
