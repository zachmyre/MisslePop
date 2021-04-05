const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Sets the width / height to the size of the window or viewport
canvas.width = innerWidth
canvas.height = innerHeight

const scoreId = document.querySelector('#score')
const bigScore = document.querySelector("#bigScore")
const startGameBtn = document.querySelector("#startGameBtn")
const menu = document.querySelector("#menu")

//Creates the player class
class Player {
    //Gives the player properties for every instance
    //of the player - also gives parameters
    constructor(x, y, radius, color) { 
        this.x = x //Sets the properties
        this.y = y // to the arguments
        this.radius = radius // that we passed
        this.color = color // through on constructor line.
        // Example --> cont player = new Player(1, 1, 10, 'red')
        }

        draw() { // Draws the player
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0,
                Math.PI * 2, false) // Draws a 360 degree circle
            c.fillStyle = this.color //Sets the color to whatever color is passed in 
            c.fill() // Fills the circle
        }
}

class Enemy {
    constructor(x, y, radius, color, velocity) { 
        this.x = x //Sets the properties
        this.y = y // to the arguments
        this.radius = radius // that we passed
        this.color = color // through on constructor line.
        this.velocity = velocity
        }

        draw() { // Draws the enemy
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0,
                Math.PI * 2, false) // Draws a 360 degree circle
            c.fillStyle = this.color //Sets the color to whatever color is passed in 
            c.fill() // Fills the circle
        }

        update() { // Updates classes properties over and over again
            this.draw()
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
}
}

//Creates the missle class
class Missle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() { // Draws the missle
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,
            Math.PI * 2, false) // Draws a 360 degree circle
        c.fillStyle = this.color //Sets the color to whatever color is passed in 
        c.fill() // Fills the circle
    }

    update() { // Updates classes properties over and over again
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) { 
        this.x = x //Sets the properties
        this.y = y // to the arguments
        this.radius = radius // that we passed
        this.color = color // through on constructor line.
        this.velocity = velocity
        this.alpha = 1 // makes it opaque and we will subtract from it to fade out
        }

        draw() { // Draws the enemy
            c.save() //beginning of state
            c.globalAlpha = this.alpha
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0,
                Math.PI * 2, false) // Draws a 360 degree circle
            c.fillStyle = this.color //Sets the color to whatever color is passed in 
            c.fill() // Fills the circle
            c.restore() //end of state
        }

        update() { // Updates classes properties over and over again
            this.draw()
            this.velocity.x *= friction
            this.velocity.y *= friction
            this.x = this.x + this.velocity.x
            this.y = this.y + this.velocity.y
            this.alpha -= 0.01
}
}

// Puts object in the center
const x = canvas.width / 2 
const y = canvas.height / 2

//Creates an instance of the Player class
let player = new Player(x, y, 15, 'white')
let missles = [] // Creates a list called missles
let enemies = [] // creates a list of enemies
let particles = [] // creates a list of particles

//initializes the objects (when resetting)
function init() {
    player = new Player(x, y, 15, 'white')
    missles = [] // Creates a list called missles
    enemies = [] // creates a list of enemies
    particles = [] // creates a list of particles
    score = 0
    scoreId.innerHTML = score
    bigScore.innerHTML = score
}

function spawnEnemies() { // Spawns enemies every second (1000 ms)
    setInterval(() => {
        const radius = Math.random() * (30 - 6) + 6 // Any random value from 4 to 30
        let x
        let y

        if (Math.random() < 0.5) {
         x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
         y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        // using ` lets you use ${} which lets the function interpret it as an integer instead of string
        const color = `hsl(${Math.random() * 360}, 50%, 50%)` // changes color to random

        const angle = Math.atan2(canvas.height / 2 - y, 
            canvas.width / 2 - x)
        const velocity = { //creates velocity object
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

const missle = new Missle( // Passing parameters
    canvas.width / 2, canvas.height / 2, // Sets missle beginning point at center
    5,
    'red',
    { // Creates an object for the velocity
        x: 1,
        y: 1
    }
)

let animationId
let score = 0
// Animation function
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)' //sets background to black and adds trail effect.
    if(score > 1000){
        c.fillStyle = 'rgba(255, 255, 0, 0.1)'
    }
    if(score > 5000) {
        c.fillStyle = 'rgba(0, 255, 0, 0.1)'
    }
    if(score > 10000) {
        c.fillStyle = 'rgba(0, 0, 255, 0.1)'
    }
    c.fillRect(0, 0, canvas.width, canvas.height) // Loops through animate function over and over again
    player.draw() // Calls the player instance and draws it
    particles.forEach((particle, index) => { // for each particle in particles it will update the frame with the particle
        if(particle.alpha <= 0){
            particles.splice(index, 1)
        } else {
        particle.update()
        }
    })
    missles.forEach((missle, index) =>{
        missle.update()
        //removes missles from edges of screen
        if (missle.x + missle.radius < 0 || 
            missle.x - missle.radius > canvas.width ||
            missle.y + missle.radius < 0 ||
            missle.y - missle.radius > canvas.height) { // if missle is off screen it will remove from screen
            setTimeout(() => { // Waits til next frame to remove enemy
                missles.splice(index, 1) // removes current missle 
               }, 0) 
        }
    })

    enemies.forEach((enemy, index) => { // loops through each enemy in enemies list
        enemy.update()
        // Ends game if enemy touches player
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (distance - enemy.radius - player.radius < 0.25){
            cancelAnimationFrame(animationId) // Cancels the animation frame
            menu.style.display = 'flex'
            bigScore.innerHTML = score
        }

        missles.forEach((missle, missleIndex) => { // For each missle in missles it performs the following
           const distance = Math.hypot(missle.x - enemy.x, missle.y - enemy.y) // Checks distance between 2 points (missle and enemy)
            // If missle and enemy touch it will remove them from screen
           if (distance - enemy.radius - missle.radius < 0.25){
               //creates particles
            for(let i = 0; i < enemy.radius * 2; i++) {
                particles.push(new Particle(
                    missle.x, 
                    missle.y,
                    Math.random() * 2, 
                    enemy.color, 
                    {x: (Math.random() - 0.5) * (Math.random() * 5), 
                    y: (Math.random() - 0.5) * (Math.random() * 5) }))
            }

            if(enemy.radius - 10 > 5) { // shrinks enemy when hit//increases score
                score += 50
                scoreId.innerHTML = score

                gsap.to(enemy, {
                    radius: enemy.radius - 10
                })
                setTimeout(() => {
                    missles.splice(missleIndex, 1)
                }, 0)
            } else {
                //increases score
                score += 100
                scoreId.innerHTML = score
                setTimeout(() => { // Waits til next frame to remove enemy
                    enemies.splice(index, 1) // removes 1 enemy index (index means current)
                    missles.splice(missleIndex, 1) // removes current missle 
                   }, 0) 
            }   
           }
        })
    })
}

addEventListener('click', (event) => { // when we click it calls this function below
    const angle = Math.atan2(event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2)
    const velocity = { //creates velocity object
        x: Math.cos(angle) * 3, // sets speed (velocity)
        y: Math.sin(angle) * 3 // sets speed (velocity)
    }
    missles.push(new Missle(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'rgb(250, 0, 0, .75',
        velocity
    ))
})

// when start button is clicked it will animate and spawn enemies
startGameBtn.addEventListener('click', () => {
    init() //resets everything
    animate()
    spawnEnemies()

    menu.style.display = 'none' // removes menu when start button is clicked
})

//https://www.youtube.com/watch?v=eI9idPTT0c4&t=3s

//TO DO LIST
//1) Add different shapes? maybe images instead
//2) Add power ups and different levels
//3) Make look more professional and add a name
