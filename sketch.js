// Duration in seconds
const DRT = 10;
// Framerate
const FR = 20;

// Generated circles
const CIRCLES = 10;
const PLANET_SIZE = 40;
// Padding
const PADD = 10;

const COLORS = [];
const topCircles = [];
const leftCircles = [];
const plots = [];
let TIME = 0;
let TF;

function setup()
{
  createCanvas(580, 580);

  frameRate(FR);
  // Time factor
  TF = PI / (DRT * FR);

  background(0);
  noFill();

  const mg = PLANET_SIZE;

  // Generate colors
  for (let i = 0; i < CIRCLES; i++)
  {

    COLORS[i] = color('hsb(' + (i*20) + ', 100%, 85%)');
  }

  // Generate top planets
  for(let i = 1; i <= CIRCLES; i++)
  {
    const x = i * PLANET_SIZE + PADD * i + mg;
    topCircles[i - 1] = new Planet(x, PLANET_SIZE, PLANET_SIZE/2);
  }

  // Generate left planets
  for(let i = 1; i <= CIRCLES; i++)
  {
    const y = i * PLANET_SIZE + PADD * i + mg;
    leftCircles[i - 1] = new Planet(PLANET_SIZE, y, PLANET_SIZE/2);
  }

  // Generate inner graphs
  for(let i = 1; i <= CIRCLES; i++)
  {
    plots.push([]);
    for(let j = 1; j <= CIRCLES; j++)
    {
      const x = i * PLANET_SIZE + PADD * i + mg;
      const y = j * PLANET_SIZE + PADD * j + mg;
      plots[i - 1][j - 1] = new Graph(x,y);
    }
  }
}

function draw()
{
  background(0);
  topCircles.forEach( (circle, idx) => {
    stroke(COLORS[idx]);
    circle.setMoon(TIME * (idx + 1) * 2);
    circle.display();
    circle.axeY();
  });

  leftCircles.forEach( (circle, idx) => {
    stroke(COLORS[idx]);
    circle.setMoon(TIME * (idx + 1) * 2);
    circle.display();
    circle.axeX();
  });

  for(let i = 1; i <= CIRCLES; i++)
  {
    for(let j = 1; j <= CIRCLES; j++)
    {
      const pXPos = topCircles[i - 1].mx;
      const pYPos = leftCircles[j - 1].my;
      plots[i - 1][j - 1].setPos(pXPos, pYPos);
      stroke(COLORS[(i - 1) > (j -1) ? (i - 1) : (j -1)]);
      plots[i - 1][j - 1].display();
    }
  }

  TIME >= PI ? TIME = 0 : TIME += TF;
}

class Utils
{
  polarToCart(r, t)
  {
    return { x: r * cos(t), y: r * sin(t) };
  }
}

const UTL = new Utils();

class Planet
{
  constructor(x,y,r)
  {
    const off = UTL.polarToCart(r, 0);
    this.x = x;
    this.y = y;
    this.mx = x + off.x;
    this.my = y + off.y;
    this.r = r;
  }

  display()
  {
    ellipse(this.x, this.y, this.r * 2);
    this.moon();
  }

  setMoon(angle)
  {
    const {x, y} = UTL.polarToCart(this.r, angle);
    this.mx = this.x + x;
    this.my = this.y + y;

  }

  moon()
  {
    push();
    stroke(255,255,255);
    fill(255);
    ellipse(this.mx, this.my, 5);
    pop();
  }

  axeX()
  {
    push();
    stroke(100);
    line(this.mx, this.my, this.mx + (CIRCLES * PLANET_SIZE) + (CIRCLES * PADD), this.my);
    pop();
  }

  axeY()
  {
    push();
    stroke(100);
    line(this.mx, this.my, this.mx, this.my + (CIRCLES * PLANET_SIZE) + (CIRCLES * PADD));
    pop();
  }
}

class Graph
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.graph = [];
  }

  setPos(x,y)
  {
    this.x = x;
    this.y = y;
  }

  whiteDot()
  {
    push();
    stroke(255,255,255);
    fill(255);
    ellipse(this.x, this.y, 5);
    pop();
  }

  display()
  {
    this.whiteDot();
    noFill();
    beginShape();
    this.graph.forEach(p => {
      vertex(p.x, p.y)
    });
    endShape();
    if(TIME >= PI) {
      this.graph = [];
    }
    else
    {
      this.graph.push({ x: this.x, y: this.y});
    }
  }
}