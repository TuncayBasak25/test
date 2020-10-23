
let key = null;
const top1 = "top";
const left = "left";
const bot = "bot"
const right = "right"
const space = "space"
window.addEventListener('keydown', keyvala);

function keyvala({ which })
{

    if (which === 38) // 38 haut
    {
        key = top1;
    }
    else if (which === 37) // 37 gauche
    {
        key = left;
    }
    else if (which === 40) //  40 Bas
    {
        key = bot;
    }
    else if (which === 39) // 39 droite
    {
        key = right;
    }
    else if (which === 32) // 32 espace
    {
        key = space;
        stick.poseBombe();
    }

}
//32 espace
window.addEventListener('keyup', keyHundera);

function keyHundera({ which })
{

    if (which === 38) // 38 haut
    {
        key = null;
    }
    else if (which === 37) // 37 gauche
    {
        key = null;
    }
    else if (which === 40) //  40 Bas
    {
        key = null;
    }
    else if (which === 39) // 39 droite
    {
        key = null;
    }
     else if (which === 32) // 32 espace
    {
        key = space;

    }


}







let stickDiv = document.createElement('div');
stickDiv.style.height = "20px";
stickDiv.style.width = "20px";
stickDiv.style.position = "absolute";
stickDiv.style.backgroundColor = "blue";
stickDiv.style.left = "150px";
stickDiv.style.top = "150px";
stickDiv.style.borderRadius = "3000px";
stickDiv.style.border = "20px solid"
document.body.appendChild(stickDiv);




const stick =
{
    x: 150,
    y: 150,
    speed: 11,

    bombe: null, // il n'y a pas de bombe actuellement


    goLeft: function() {
        if (this.x <= this.speed)
        {
            this.x = 0;
        }
        else
        {
            this.x -= this.speed;
        }
        this.updateDiv();

    },

    goRight: function() {
        if (this.x >= window.innerWidth -50 - this.speed)
        {
            this.x = window.innerWidth -50;
        }
        else
        {
            this.x += this.speed;
        }

        this.updateDiv();

    },

    goTop: function() {
         if (this.y <= this.speed)
        {
            this.y = 0;
        }
        else
        {
            this.y -= this.speed;
        }
        this.updateDiv();
    },

    goBot: function() {
        if (this.y >= window.innerHeight -50 - this.speed)
        {
            this.y = window.innerHeight -50;
        }
        else
        {
            this.y += this.speed;
        }
        this.updateDiv();
    },

    updateDiv: function() { // mise a jour de l'image
        stickDiv.style.left = this.x + "px";
        stickDiv.style.top = this.y + "px";
    },

    poseBombe: function() { //Tu depose une bombe avec c'est fonction a l'interieure de bomberman
      if (this.bombe) return; //Si on a déjà une bombe on ne fais rien

      let bombDiv = document.createElement('div');
      bombDiv.style.height = "20px";
      bombDiv.style.width  = "20px";
      bombDiv.style.position = "absolute";
      bombDiv.style.borderRadius = "10px"

      bombDiv.style.left = this.x + "px";
      bombDiv.style.top = this.y + "px";

      bombDiv.style.backgroundColor = "red";

      this.bombe = bombDiv // Maintenant on a une bombe

      document.body.appendChild(bombDiv);
    }

}




let frame = 0;
function gameLoop()
{

    if (key === top1) // 38 haut
    {
        stick.goTop();
    }
    else if (key === left) // 37 gauche
    {
        stick.goLeft();
    }
    else if (key === bot) //  40 Bas
    {
        stick.goBot();
    }
    else if (key === right) // 39 droite
    {
        stick.goRight();
    }


    return setTimeout(gameLoop, 1000/60)
}
gameLoop(); //fps machine 60
