class Ballon
{
  static ballonList = [];

  static update() {
    Ballon.ballonList.map(ballon => ballon.update());

    let offset = 0;
    for (let i=0; i<Ballon.ballonList.length-offset; i++) {
      if (Ballon.ballonList[i].destroy) {
        Ballon.ballonList[i].element.remove();
        Ballon.ballonList.splice(i, 1);
        offset++;
      }
    }

    let ballonList = [...Ballon.ballonList];

    while (ballonList.length > 1) {
      const actual = ballonList.pop();
      ballonList.map(ballon => ballon.collision(actual));
    }
    ballonList = [...Ballon.ballonList];
    while (ballonList.length > 1) {
      const actual = ballonList.pop();
      ballonList.map(ballon => ballon.gravity(actual));
    }
  }

  constructor(pos, speed, size)
  {
    Ballon.ballonList.push(this);
    this.pos = pos;
    this.speed = speed;
    this.size = size;
    this.mass = size**5;

    this.element = document.createElement('div');
    this.style = this.element.style;

    this.style.position = 'absolute';
    this.style.width = this.size + 'px';
    this.style.height = this.size + 'px';
    this.style.backgroundColor = 'blue';
    this.style.borderRadius = '100%';

    this.style.marginLeft = -this.size/2 + 'px';
    this.style.marginTop = -this.size/2 + 'px';
    this.style.left = pos.x + 'px';
    this.style.top = pos.y + 'px';

    document.body.appendChild(this.element);
  }

  update()
  {
    const { speed, pos, size, style } = this;
    pos.x += speed.x * time;
    pos.y += speed.y * time;

    // if (pos.x < size/2) {
    //   speed.x *= -1;
    //   pos.x = size/2;
    // }
    // else if (pos.x > window.innerWidth - size/2) {
    //   speed.x *= -1;
    //   pos.x = window.innerWidth - size/2;
    // }
    // if (pos.y < size/2) {
    //   speed.y *= -1;
    //   pos.y = size/2;
    // }
    // else if (pos.y > window.innerHeight - size/2) {
    //   speed.y *= -1;
    //   pos.y = window.innerHeight - size/2;
    // }

    style.left = pos.x + 'px';
    style.top = pos.y + 'px';

  }

  collision(other) {
    if (!this.isTouching(other)) return;

    if (this.mass < other.mass/1000) {
      this.destroy = true;
      return;
    }
    else if (other.mass < this.mass/1000) {
      other.destroy = true;
      return;
    }

    const res = [(this.speed.x - other.speed.x) * time, (this.speed.y - other.speed.y) * time];
    if (res[0] *(other.pos.x - this.pos.x) + res[1] * (other.pos.y - this.pos.y) < 0 ) return;

    const rotate = (v, theta) => ({ x: v.x * Math.cos(theta) - v.y * Math.sin(theta), y: v.x * Math.sin(theta) + v.y * Math.cos(theta) });

    const theta = -Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);

    const v1 = rotate(this.speed, theta);
    const v2 = rotate(other.speed, theta);

    const u1 = rotate({ x: v1.x * (this.mass - other.mass)/(this.mass + other.mass) + v2.x * 2 * other.mass/(this.mass + other.mass), y: v1.y }, -theta);
    const u2 = rotate({ x: v2.x * (other.mass - this.mass)/(this.mass + other.mass) + v1.x * 2 * this.mass/(this.mass + other.mass), y: v2.y }, -theta);

    this.speed.x = u1.x;
    this.speed.y = u1.y;
    other.speed.x = u2.x;
    other.speed.y = u2.y;
  }

  gravity(other) {
    if (this.isTouching(other)) return;
    const force = this.mass * other.mass / this.distance(this.pos, other.pos)**2 / 1000;

    const theta1 = Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);
    const theta2 = Math.atan2(this.pos.y - other.pos.y, this.pos.x - other.pos.x);

    this.speed.x += force * time / this.mass / 10000 * Math.cos(theta1);
    this.speed.y += force * time / this.mass / 10000 * Math.sin(theta1);

    other.speed.x += force * time / other.mass / 10000 * Math.cos(theta2);
    other.speed.y += force * time / other.mass / 10000 * Math.sin(theta2);
  }

  isTouching(other) {
    if (this.distance(this.pos, other.pos) < this.size/2 + other.size/2) return true;
    return false;
  }

  distance(pos1, pos2) {
    return ((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2)**0.5;
  }
}

document.body.style.height = window.innerHeight + 'px';

const shower = document.createElement('div');
shower.size = 50;

shower.style.position = 'absolute';
shower.style.width = 50 + 'px';
shower.style.height = 50 + 'px';
shower.style.backgroundColor = 'blue';
shower.style.opacity = '0.5';
shower.style.borderRadius = '100%';

shower.style.marginLeft = -shower.size/2 + 'px';
shower.style.marginTop = -shower.size/2 + 'px';


document.body.appendChild(shower);

shower.addEventListener('mousedown', ({clientX: mouseX, clientY: mouseY}) => {
  shower.x = mouseX;
  shower.y = mouseY;

  shower.style.opacity = '1';
});

shower.addEventListener('mouseup', ({clientX: mouseX, clientY: mouseY}) => {
  const speed = {
    x: -(mouseX - shower.x) / 20,
    y: -(mouseY - shower.y) / 20
  }
  new Ballon({ x: mouseX, y: mouseY }, speed, shower.size);
  shower.style.opacity = '0.5';
});

document.body.addEventListener('mousewheel', ({deltaY}) => {
  if (deltaY > 0) shower.size *= 0.9;
  else shower.size *= 1.1;
  shower.style.width = shower.size + 'px';
  shower.style.height = shower.size + 'px';
  shower.style.marginLeft = -shower.size/2 + 'px';
  shower.style.marginTop = -shower.size/2 + 'px';
});

document.body.addEventListener('mousemove', ({clientX: mouseX, clientY: mouseY}) => {
  shower.style.left = mouseX + 'px';
  shower.style.top = mouseY + 'px';
});

let time = 1;

const timeRange = document.createElement('input');
timeRange.type = 'range';
timeRange.min = 1;
timeRange.max = 20;
timeRange.step = 1;
timeRange.value = 10;
timeRange.style.zIndex = 100;
timeRange.style.position = 'relative';
timeRange.style.margin = '50px';

timeRange.addEventListener('input', ({target}) => {
  const {value} = target;
  if (value > 9) time = value-9;
  else time = 1/(11-value);
});

document.body.appendChild(timeRange);

setInterval(Ballon.update, 1000/60);
