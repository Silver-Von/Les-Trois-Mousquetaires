/* ---------------------------------- CLASS --------------------------------- */
class FlipClock {
  constructor(format = '24') {
    this.format = format
    this.date = new Date
    this.currentNumber = undefined
    this.nextNumber = undefined
  }

  present(unit) {
    if (unit === 'second') this.currentNumber = this.date.getSeconds()
    else if (unit === 'minute') this.currentNumber = this.date.getMinutes()
    else if (unit === 'hour') {
      this.currentNumber = this.date.getHours()
      if (this.format !== '24' && this.currentNumber >= 13)
        this.currentNumber = this.date.getHours() - 12
    }

    if (this.currentNumber < 10
      && unit === 'second'
      || this.currentNumber < 10
      && unit === 'minute') {
      this.currentNumber = `0${this.currentNumber}`
    }

    return this.currentNumber
  }

  future(unit) {
    if (unit === 'second' || unit === 'minute') {
      this.present(unit)

      if (this.currentNumber < 10) {
        this.currentNumber = parseInt(`0${this.currentNumber}`)
        this.nextNumber = this.currentNumber < 9
          ? `0${this.currentNumber + 1}`
          : this.currentNumber + 1
      }
      else if (this.currentNumber >= 10 && this.currentNumber <= 59) {
        this.nextNumber = this.currentNumber + 1
        if (this.nextNumber === 60) this.nextNumber = '00'
      }
    }

    else if (unit === 'hour') {
      this.present('hour')

      if (this.format === '24') {
        if (this.currentNumber < 23) {
          this.nextNumber = this.currentNumber + 1
        }
        else this.nextNumber = 0
      }
      else {
        this.nextNumber = this.currentNumber === 12
          ? 1
          : this.currentNumber + 1
      }
    }

    return this.nextNumber
  }
}


/* ------------------------------ GET ELEMENTS ------------------------------ */
// Seconds
const fixedSecondsAbove = document.getElementById('fixed-s-n-a')
const fixedSecondsBelow = document.getElementById('fixed-s-n-b')

const flippingSeconds = document.getElementById('flexible-s-container')
const flippingSecondsFront = document.getElementById('flexible-s-n-f')
const flippingSecondsBack = document.getElementById('flexible-s-n-b')

// Minutes
const fixedMinutesAbove = document.getElementById('fixed-m-n-a')
const fixedMinutesBelow = document.getElementById('fixed-m-n-b')

const flippingMinutes = document.getElementById('flexible-m-container')
const flippingMinutesFront = document.getElementById('flexible-m-n-f')
const flippingMinutesBack = document.getElementById('flexible-m-n-b')

// Hours
const fixedHoursAbove = document.getElementById('fixed-h-n-a')
const fixedHoursBelow = document.getElementById('fixed-h-n-b')

const flippingHours = document.getElementById('flexible-h-container')
const flippingHoursFront = document.getElementById('flexible-h-n-f')
const flippingHoursBack = document.getElementById('flexible-h-n-b')

// Shadows
const shadows = document.querySelectorAll('.shadow')

// Switch Button
const switchButton = document.getElementById('format-switch-button')

// AM | PM
const amOrPm = document.head.appendChild(document.createElement("style"));


/* ------------------------- Today is GROUNDHOG DAY ------------------------- */
setTimeout(() => showTime(), 500)

setInterval(() => {
  if (fixedSecondsBelow.innerText === '59'
    && fixedMinutesBelow.innerText === '59') {
    flippingHours.classList.add('flipping')
    shadows[2].classList.add('move')

    setTimeout(() => {
      flippingHours.classList.remove('flipping')
      shadows[2].classList.remove('move')
    }, 800)
  }

  if (fixedSecondsBelow.innerText === '59') {
    flippingMinutes.classList.add('flipping')
    shadows[1].classList.add('move')

    setTimeout(() => {
      flippingMinutes.classList.remove('flipping')
      shadows[1].classList.remove('move')
    }, 800)
  }

  flippingSeconds.classList.toggle('flipping')
  shadows[0].classList.toggle('move')

  setTimeout(() => {
    showTime()
    flippingSeconds.classList.toggle('flipping')
    shadows[0].classList.toggle('move')
  }, 800)

}, 1000)

/* ------------------------- EVENT(S) & FUNCTION(S) ------------------------- */
let defaultFormat = '24'

amOrPm.innerHTML = ".clock-container:before, :after {display: none;}";


switchButton.addEventListener('click', () => {
  switchFormat()
})

function showTime(format = defaultFormat) {
  const clock = new FlipClock(format)

  flippingHoursBack.innerText = clock.future('hour')
  fixedHoursAbove.innerText = clock.future('hour')
  flippingHoursFront.innerText = clock.present('hour')
  fixedHoursBelow.innerText = clock.present('hour')

  flippingMinutesBack.innerText = clock.future('minute')
  fixedMinutesAbove.innerText = clock.future('minute')
  flippingMinutesFront.innerText = clock.present('minute')
  fixedMinutesBelow.innerText = clock.present('minute')

  flippingSecondsBack.innerText = clock.future('second')
  fixedSecondsAbove.innerText = clock.future('second')
  flippingSecondsFront.innerText = clock.present('second')
  fixedSecondsBelow.innerText = clock.present('second')

  if (defaultFormat === '12') {
    if (clock.date.getHours() < 11) {
      amOrPm.innerHTML = ".clock-container:before {display: block;}";
      amOrPm.innerHTML = ".clock-container:after {display: none;}";
    }
    else {
      amOrPm.innerHTML = ".clock-container:after {display: block ;}";
      amOrPm.innerHTML = ".clock-container:before {display: none;}";
    }
  }
  else amOrPm.innerHTML = ".clock-container:before, :after {display: none;}";
}

function switchFormat() {
  defaultFormat = defaultFormat === '24' ? '12' : '24'

  if (defaultFormat === '12') {
    switchButton.classList.add('switch-12')
    switchButton.classList.remove('switch-24')

    switchButton.innerText = '12'
  }
  else {
    switchButton.classList.remove('switch-12')
    switchButton.classList.add('switch-24')

    switchButton.innerText = '24'
  }
}