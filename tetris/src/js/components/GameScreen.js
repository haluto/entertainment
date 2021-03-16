import React from 'react';
import {Item_L, ITEM_L, Item_Anti_L, ITEM_ANTI_L} from './Items/Item_L';
import {Item_Z, ITEM_Z, Item_Anti_Z, ITEM_ANTI_Z} from './Items/Item_Z';
import {Button} from 'antd';
import {CONSTANT} from './constant';

const ITEMS = {
  [ITEM_L]: Item_L,
  [ITEM_ANTI_L]: Item_Anti_L,
  [ITEM_Z]: Item_Z,
  [ITEM_ANTI_Z]: Item_Anti_Z,
};

const MAP_WIDTH = CONSTANT.GAME_PANEL.MAP_WIDTH;
const MAP_HEIGHT = CONSTANT.GAME_PANEL.MAP_HEIGHT;
const GRID_SIDE_LEN = CONSTANT.GAME_PANEL.GRID_SIDE_LEN;
const MAP_STYLE_BORDER = CONSTANT.GAME_PANEL.MAP_STYLE_BORDER;
const NEW_ITEM_DEFAULT_X = 4;
const COLLISION_DETECTION_DIR = {LEFT:0, RIGHT:1, DOWN:2};

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    /*game panel*/
    this.gamePanel = null;
    this.canvas = null;
    this.setGamePanelRef = element => {
      this.gamePanel = element;
    };
    this.setCanvasRef = element => {
      this.canvas = element;
    };

    this.mapData = [];
    this.curItem = null;
    this.nextItem = null;
    this.prePos = {x:NEW_ITEM_DEFAULT_X, y:0};
    this.curPos = {x:NEW_ITEM_DEFAULT_X, y:0};

    this.gameStatus = CONSTANT.GAME_STATUS.NOT_START;
    this.state = {
      buttonStr: "Start",
      score: 0,
    };
  }

  drawCurItem = (drawItem) => {
    // drawItem === 0 means clean the item.
    if (drawItem === 0) {
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          // only clean the black grid, otherwise the mapData draw will be broken.
          if (data[i][j] === 1) {
            this.drawGrid(0, x, y);
          }
        }
      }
    } else {
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          // only draw the black grid, otherwise the mapData draw will be broken.
          if (data[i][j] === 1) {
            this.drawGrid(data[i][j], x, y);
          }
        }
      }
    }
  }

  drawScreen = () => {
    if (this.curItem) {
      let data = this.curItem.getItem();
      // set current item to map.
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          if (data[i][j] === 1) {
            this.mapData[i+this.curPos.x][j+this.curPos.y] = data[i][j];
          }
        }
      }
    }

    this.curItem = null;

    for (let i=0;i<MAP_WIDTH;i++) {
      for (let j=0;j<MAP_HEIGHT;j++) {
        this.drawGrid(this.mapData[i][j], i, j);
      }
    }
  }

  drawGrid = (black, x, y) => {
    this.ctx.save();
    if (black) {
      this.ctx.fillStyle = "rgba(100, 100, 100, 1)";
      this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    } else {
      this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
      // TODO: if need game help
      this.ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
      //this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    }
    this.ctx.clearRect(x*GRID_SIDE_LEN, y*GRID_SIDE_LEN, GRID_SIDE_LEN, GRID_SIDE_LEN);
    this.ctx.fillRect(x*GRID_SIDE_LEN+2, y*GRID_SIDE_LEN+2, GRID_SIDE_LEN-4, GRID_SIDE_LEN-4);
    this.ctx.strokeRect(x*GRID_SIDE_LEN+1, y*GRID_SIDE_LEN+1, GRID_SIDE_LEN-2, GRID_SIDE_LEN-2);
    this.ctx.restore();
  }

  genRandomItem = () => {
    let debugItem = false;

    let dir = getRandomInt(CONSTANT.ITEM_DIR.DIR_NUM);
    
    if (debugItem) {
      //this.curItem = new Item_L(dir);
      //this.curItem = new Item_Anti_L(dir);
      this.curItem = new Item_Z(dir);
    } else {
      let itemTypesArr = Object.keys(ITEMS);
      let numOfItems = itemTypesArr.length;
      let idx = getRandomInt(numOfItems);
      let itemType = itemTypesArr[idx];
      this.curItem = new ITEMS[itemType](dir);
    }
  }

  genItemAndDraw = () => {
    this.genRandomItem();
    this.curPos.x = NEW_ITEM_DEFAULT_X;
    this.curPos.y = 0;
    this.prePos.x = this.curPos.x;
    this.prePos.y = this.curPos.y;
    this.drawCurItem(1);

    // Check gameover.
    let gameover = false;
    let data = this.curItem.getItem();
    for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
      for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
        let x = i+this.curPos.x;
        let y = j+this.curPos.y;
        if (data[i][j] === 1 && this.mapData[x][y] === 1) {
          gameover = true;
          break;
        }
      }
    }
    if (gameover) {
      // TODO: draw gameover animation.
      this.gameStatus = CONSTANT.GAME_STATUS.NOT_START;
      this.setButtonString();
      this.curItem = null;
    }
  }

  checkAndDrawElimination = async () => {
    let fullLineArr = [];
    for (let j=0;j<MAP_HEIGHT;j++) {
      let lineIsFull = true;
      for (let i=0;i<MAP_WIDTH;i++) {
        if (this.mapData[i][j] === 0) {
          lineIsFull = false;
          break;
        }
      }
      if (lineIsFull) {
        fullLineArr.push(j);
      }
    }

    if (fullLineArr.length > 0) {
      // Score
      let score = 0;
      switch (fullLineArr.length) {
        case 1:
          score = CONSTANT.CONFIG.SCORE.ONE_LINE;
          break;
        case 2:
          score = CONSTANT.CONFIG.SCORE.TWO_LINES;
          break;
        case 3:
          score = CONSTANT.CONFIG.SCORE.THREE_LINES;
          break;
        case 4:
          score = CONSTANT.CONFIG.SCORE.FOUR_LINES;
          break;
        default:
          break;
      }
      score += this.state.score;
      this.setState({score:score});

      // Draw animation.
      let animFrames = CONSTANT.CONFIG.ELIMINATE_ANIM.FRAMES;
      let drawBlack = false;
      while (animFrames > 0) {
        for (let j=0;j<fullLineArr.length;j++) {
          for (let i=0;i<MAP_WIDTH;i++) {
            this.drawGrid(drawBlack, i, fullLineArr[j]);
          }
        }
        await sleep(CONSTANT.CONFIG.ELIMINATE_ANIM.PER_FRAME_TIMEOUT);
        animFrames --;
        drawBlack = !drawBlack;
      }

      // Eliminate the full line.
      while (fullLineArr.length > 0) {
        let lineNum = fullLineArr.pop();
        // Would lineNum === 0 happen? No.
        for (let j=lineNum;j>=0;j--) {
          for (let i=0;i<MAP_WIDTH;i++) {
            if (j > 0)
              this.mapData[i][j] = this.mapData[i][j-1];
            else if (j === 0)
              this.mapData[i][j] = 0;
          }
        }
      }

      // Redraw the screen.
      this.drawScreen();
    }
  }

  gameLoop = async () => {
    if (this.gameStatus === CONSTANT.GAME_STATUS.RUNNING) {

      this.inGameLoop = true;

      if (this.curItem === null) {
        this.initData();
        this.drawScreen();
        this.genItemAndDraw();
      } else {
        if (!this.doCollisionDetection(COLLISION_DETECTION_DIR.DOWN)) {
          this.drawCurItem(0);
          this.prePos.x = this.curPos.x;
          this.prePos.y = this.curPos.y;
          this.curPos.y ++;
          this.drawCurItem(1);
        } else {
          this.drawScreen();
          await this.checkAndDrawElimination();
          this.genItemAndDraw();
        }
      }
      let loopTimeout = CONSTANT.CONFIG.DROP_DOWN_TIMEOUT_DEFAULT;
      if (this.speedUp) {
        loopTimeout = CONSTANT.CONFIG.SPEED_UP_DROP_DOWN_TIMEOUT;
      }

      this.gameLoopTimeout = setTimeout(this.gameLoop, loopTimeout);

      this.inGameLoop = false;
    }
  }

  moveLeftLoop = () => {
    if (!this.doCollisionDetection(COLLISION_DETECTION_DIR.LEFT)) {
      this.drawCurItem(0);
      this.prePos.x = this.curPos.x;
      this.prePos.y = this.curPos.y;
      this.curPos.x --;
      this.drawCurItem(1);
    }
  }

  moveRightLoop = () => {
    if (!this.doCollisionDetection(COLLISION_DETECTION_DIR.RIGHT)) {
      this.drawCurItem(0);
      this.prePos.x = this.curPos.x;
      this.prePos.y = this.curPos.y;
      this.curPos.x ++;
      this.drawCurItem(1);
    }
  }

  tryRotateItem = () => {
    if (this.curItem) {
      let canRotate = true;
      this.curItem.rotateItem(true);
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          if (data[i][j] === 1) {
            if (x >= MAP_WIDTH || y >= MAP_HEIGHT) {
              canRotate = false;
              break;
            } else if (this.mapData[x][y] === 1) {
              canRotate = false;
              break;
            }
          }
        }
      }
      if (canRotate) {
        this.curItem.rotateItem(false);
        this.drawCurItem(0);
        this.curItem.rotateItem(true);
        this.drawCurItem(1);
      } else {
        this.curItem.rotateItem(false);
      }
    }
  }

  doCollisionDetection = (cdDir) => {
    if (cdDir === COLLISION_DETECTION_DIR.DOWN) {
      let ret = false;
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          if (y < MAP_HEIGHT-1 &&
                data[i][j] === 1 &&
                this.mapData[x][y+1] === 1) {
            ret = true;
            break;
          } else if (y === MAP_HEIGHT-1 && data[i][j] === 1) {
            ret = true;
            break;
          }
        }
      }
      return ret;
    }

    if (cdDir === COLLISION_DETECTION_DIR.LEFT) {
      let ret = false;
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          if (x > 0 &&
                data[i][j] === 1 && 
                this.mapData[x-1][y] === 1) {
            ret = true;
            break;
          } else if (x === 0 && data[i][j] === 1) {
            ret = true;
            break;
          }
        }
      }
      return ret;
    }

    if (cdDir === COLLISION_DETECTION_DIR.RIGHT) {
      let ret = false;
      let data = this.curItem.getItem();
      for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
        for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
          let x = i+this.curPos.x;
          let y = j+this.curPos.y;
          if (x < MAP_WIDTH-1 &&
                data[i][j] === 1 && 
                this.mapData[x+1][y] === 1) {
            ret = true;
            break;
          } else if (x === MAP_WIDTH-1 && data[i][j] === 1) {
            ret = true;
            break;
          }
        }
      }
      return ret;
    }
  }

  setButtonString = () => {
    let buttonStr = 'Start';
    if (this.gameStatus === CONSTANT.GAME_STATUS.NOT_START) {
      buttonStr = 'Start';
    } else if (this.gameStatus === CONSTANT.GAME_STATUS.RUNNING) {
      buttonStr = 'Pause';
    } else if (this.gameStatus === CONSTANT.GAME_STATUS.PAUSE) {
      buttonStr = 'Resume';
    } else {
      buttonStr = 'Error';
    }
    this.setState({
      buttonStr: buttonStr,
    });
  }

  buttonClickCb = () => {
    // change status.
    if (this.gameStatus === CONSTANT.GAME_STATUS.NOT_START) {
      // start game
      this.gameStatus = CONSTANT.GAME_STATUS.RUNNING;
      this.gameLoop();
    } else if (this.gameStatus === CONSTANT.GAME_STATUS.RUNNING) {
      this.gameStatus = CONSTANT.GAME_STATUS.PAUSE;
    } else if (this.gameStatus === CONSTANT.GAME_STATUS.PAUSE) {
      this.gameStatus = CONSTANT.GAME_STATUS.RUNNING;
      this.gameLoop();
    }

    // then assign string as new status.
    this.setButtonString();
  }

  initData = () => {
    for (let i=0;i<MAP_WIDTH;i++) {
      for (let j=0;j<MAP_HEIGHT;j++) {
        this.mapData[i][j] = 0;
      }
    }

    this.setState({score: 0});
  }

  handleKeyDown = (e) => {
    if (e.which >= CONSTANT.KEY.ARROW_START && e.which <= CONSTANT.KEY.ARROW_END) {
      switch (e.which) {
        case CONSTANT.KEY.LEFT_ARROW:
        if (this.gameStatus === CONSTANT.GAME_STATUS.RUNNING) {
          // Press the key and hold, in some browser,
          // the DOWN EVENT will be sent continously.
          if (!this.leftInterval) {
            this.leftInterval = setInterval(this.moveLeftLoop, CONSTANT.CONFIG.LR_INTERVAL);
          }
        }
        break;
        case CONSTANT.KEY.RIGHT_ARROW:
        if (this.gameStatus === CONSTANT.GAME_STATUS.RUNNING) {
          if (!this.rightInterval) {
            this.rightInterval = setInterval(this.moveRightLoop, CONSTANT.CONFIG.LR_INTERVAL);
          }
        }
        break;
        case CONSTANT.KEY.UP_ARROW:
        this.tryRotateItem();
        break;
        case CONSTANT.KEY.DOWN_ARROW:
        this.speedUp = true;

        if (!this.inGameLoop) {
          if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
            this.gameLoopTimeout = null;
            this.gameLoop();
          }
        }
        break;

        default:
        break;
      }
      e.preventDefault();
      return;
    }
  }

  handleKeyUp = (e) => {
    if (e.which >= CONSTANT.KEY.ARROW_START && e.which <= CONSTANT.KEY.ARROW_END) {
      switch (e.which) {
        case CONSTANT.KEY.LEFT_ARROW:
        if (this.leftInterval) {
          clearInterval(this.leftInterval);
          this.leftInterval = null;
        }
        break;
        case CONSTANT.KEY.RIGHT_ARROW:
        if (this.rightInterval) {
          clearInterval(this.rightInterval);
          this.rightInterval = null;
        }
        break;
        case CONSTANT.KEY.UP_ARROW:
        // do nothing
        break;
        case CONSTANT.KEY.DOWN_ARROW:
        this.speedUp = false;
        break;

        default:
        break;
      }
      e.preventDefault();
      return;
    }
  }

  componentDidMount = () => {
    let width = MAP_WIDTH * GRID_SIDE_LEN;
    let height = MAP_HEIGHT * GRID_SIDE_LEN;
    this.gamePanel.style.width = `${width+MAP_STYLE_BORDER*2}px`;
    this.gamePanel.style.height = `${height+MAP_STYLE_BORDER*2}px`;
    this.gamePanel.style.border = `${MAP_STYLE_BORDER}px solid rgb(80, 80, 80)`;
    this.gamePanel.style.background = `rgb(255, 255, 255)`;

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');

    this.mapData = new Array(MAP_WIDTH);
    for (let i=0;i<MAP_WIDTH;i++) {
      this.mapData[i] = new Array(MAP_HEIGHT);
    }
  }

  render = () => {
    return (
      <div tabIndex="1" className="game-screen" style={{padding: '5px'}}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      >
        <div ref={this.setGamePanelRef}>
          <canvas ref={this.setCanvasRef}></canvas>
        </div>
        <div className="game-status">
          <Button style={{width: '100px'}} onClick={this.buttonClickCb}>{this.state.buttonStr}</Button>
          <div>
            Score: {this.state.score}
          </div>
        </div>
      </div>
    );
  }
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}