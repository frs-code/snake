var sw = 20,
    sh = 20,
    row = 33,
    col = 33,
    snake = null,
    food = null,
    snakeWrapper = document.getElementById('snake-wrapper'),
    startBtn = document.getElementsByClassName('start-btn')[0];

function Square(x, y, classname){
    this.x = x * sw;
    this.y = y * sh;
    this.classname = classname;
    this.dom = document.createElement('div');
    this.dom.classList.add(this.classname);
    this.father = snakeWrapper;
}
Square.prototype.create = function(){
    this.dom.style.width = sw + 'px';
    this.dom.style.height = sh + 'px';
    this.dom.style.left = this.x +'px';
    this.dom.style.top = this.y + 'px';
    this.father.appendChild(this.dom);
};
Square.prototype.remove = function(){
    this.father.removeChild(this.dom);
};
function Snake(){
    this.head = null;
    this.foot = null;
    this.pos = [];
    this.directionSelection = {
        left:{
            x:-1,
            y:0,
            rotate:180
        },
        right:{
            x:1,
            y:0,
            rotate:0
        },
        up:{
            x:0,
            y:-1,
            rotate:-90
        },
        down:{
            x:0,
            y:1,
            rotate:90
        }
    }
}
Snake.prototype.init = function(){
    var snakeHead = new Square(2,0,'snake-head');
    snakeHead.create();
    this.head = snakeHead;
    this.pos.push([2,0]);
    var snakeBody1 = new Square(1,0,'snake-body');
    snakeBody1.create();
    this.pos.push([1,0]);
    var snakeBody2 = new Square(0,0,'snake-body');
    this.foot = snakeBody2;
    snakeBody2.create();
    this.pos.push([0,0]);
//    让蛇形成链表
    snakeHead.last = null;
    snakeHead.next = snakeBody1;
    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;
    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;
    this.direction = this.directionSelection.right;
};
Snake.prototype.getNextPro = function(){
    var nextPro = [
        this.head.x/sw + this.direction.x,
        this.head.y/sh + this.direction.y
    ];
    this.nextPro = nextPro;
    //下一点是自己
    var collisionFlag = false;
    this.pos.forEach(function(item,index){
        if(item[0] == nextPro[0] && item[1] == nextPro[1]){
            collisionFlag = true;
        }
    });
    if(collisionFlag){
        console.log('撞到自己');
        this.collied.die.call(this);
        return;
    }
    //下一点是墙
    var rx = row -1;
    var by = col -1;
    if(nextPro[0] < 0 || nextPro[1] < 0 || nextPro[0] > rx || nextPro[1] > by){
        collisionFlag = true;
    }
    if(collisionFlag){
        console.log('撞到墙');
        this.collied.die.call(this);
        return;
    }
    //下一个点是食物
    if(food && food.pos[0] == nextPro[0] && food.pos[1] == nextPro[1]){
        this.collied.eat.call(this);
    }
    //下一点什么也没有
   this.collied.move.call(this);
};
Snake.prototype.collied = {
    move: function(addFlag){
        var newBody = new Square(this.head.x/sw,this.head.y/sh,'snake-body');
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        this.head.remove();
        newBody.create();
        var newHead = new Square(this.nextPro[0],this.nextPro[1],'snake-head');
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
        newHead.dom.style.transform ='rotate('+this.direction.rotate+'deg)';
        this.head = newHead;
        this.pos.splice(0,0,[this.nextPro[0],this.nextPro[1]]);
        newHead.create();
        if(!addFlag){
            this.foot.remove();
            this.foot = this.foot.last;
            this.pos.pop();
        }
    },
    eat: function(){
        this.collied.move.call(this,true);
        createFood();
        game.score++;
    },
    die: function(){
        game.over();
    }
};
snake = new Snake();
function createFood(){
    var fx = null;
    var fy = null;
    var flag = true;
    while(flag){
        fx = Math.round(Math.random()*(row-1));
        fy = Math.round(Math.random()*(col-1));
        snake.pos.forEach(function(item){
            if(fx != item[0] && fy!= item[1]){
                flag = false;
            }
        });
    }
    food = new Square(fx,fy,'snake-food');
    food.pos = [fx,fy];
    var foodDom = document.getElementsByClassName('snake-food')[0];
    if(foodDom){
        foodDom.style.left = fx*sw + 'px';
        foodDom.style.top = fy*sh + 'px';
    }else{
        food.create();
    }

}

function Game(){
    this.timer = null;
    this.score = 0;
}
Game.prototype.init = function(){
    snake.init();
    createFood();
    document.onkeydown = function(e){
        if(e.which ==37 && snake.direction != snake.directionSelection.right){
            snake.direction = snake.directionSelection.left;
        }else if(e.which ==38 && snake.direction != snake.directionSelection.down){
            snake.direction = snake.directionSelection.up;
        }else if(e.which ==39 && snake.direction != snake.directionSelection.left){
            snake.direction = snake.directionSelection.right;
        }else if(e.which ==40 && snake.direction != snake.directionSelection.up){
            snake.direction = snake.directionSelection.down;
        }
    };
    this.start();
};
Game.prototype.start = function(){
    this.timer = setInterval(function(){
        snake.getNextPro();
    },200)

};
Game.prototype.over = function(){
    clearInterval(this.timer);
    alert(game.score);
    snakeWrapper.innerHTML='';
    snake = new Snake();
    game = new Game();
    startBtn.style.display = 'block';

};
Game.prototype.pause = function(){
    clearInterval(this.timer);
};
var game =new Game();
var startBtn = document.getElementsByClassName('start-btn')[0];
startBtn.addEventListener('click',function(){
    startBtn.style.display = 'none';
    game.init();
});
var pauseBtn = document.getElementsByClassName('pause-btn')[0];
snakeWrapper.addEventListener('click',function(){
    game.pause();
    pauseBtn.style.display='block';
});
pauseBtn.addEventListener('click',function(){
    game.start();
    pauseBtn.style.display='none';
});
var left = document.getElementsByClassName('left')[0];
left.addEventListener('click',function(){
    snake.getNextPro();
});
