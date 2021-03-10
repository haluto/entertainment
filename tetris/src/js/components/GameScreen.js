import React from 'react';
import {Item_L, ITEM_L} from './Items/Item_L';
import {Button} from 'antd';
import {CONSTANT} from './constant';

const MAP_WIDTH = CONSTANT.GAME_PANEL.MAP_WIDTH;
const MAP_HEIGHT = CONSTANT.GAME_PANEL.MAP_HEIGHT;
const GRID_SIDE_LEN = CONSTANT.GAME_PANEL.GRID_SIDE_LEN;
const MAP_STYLE_BORDER = CONSTANT.GAME_PANEL.MAP_STYLE_BORDER;

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
    this.prePos = {x:4, y:0};
    this.curPos = {x:4, y:0};

    this.state = {
      status: CONSTANT.GAME_STATUS.NOT_START,
    };
  }

  drawScreen = () => {
    let data = this.curItem.getItem();
    // reset previous item to empty.
    for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
      for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
        
        this.mapData[i+this.prePos.x][j+this.prePos.y] = 0;
      }
    }
    // set current item to map.
    for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
      for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
        
        this.mapData[i+this.curPos.x][j+this.curPos.y] = data[i][j];
      }
    }

    for (let i=0;i<MAP_WIDTH;i++) {
      for (let j=0;j<MAP_HEIGHT;j++) {
        this.ctx.save();
        if (this.mapData[i][j] === 1) {
          this.ctx.fillStyle = "rgba(100, 100, 100, 1)";
          this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        } else {
          this.ctx.save();
          this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
          // TODO: if need game help
          //this.ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
          this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        }
        this.ctx.fillRect(i*GRID_SIDE_LEN+2, j*GRID_SIDE_LEN+2, GRID_SIDE_LEN-4, GRID_SIDE_LEN-4);
        this.ctx.strokeRect(i*GRID_SIDE_LEN+1, j*GRID_SIDE_LEN+1, GRID_SIDE_LEN-2, GRID_SIDE_LEN-2);
        this.ctx.restore();
      }
    }
  }

  gameLoop = () => {
    this.drawScreen();
    //TODO: need check bottom.
    this.prePos.x = this.curPos.x;
    this.prePos.y = this.curPos.y;
    this.curPos.y ++;
    console.log("gameLoop");
    setTimeout(this.gameLoop, 1000);
  }

  buttonClickCb = () => {
    let status = this.state.status;
    if (status === CONSTANT.GAME_STATUS.NOT_START) {
      // start game
      status = CONSTANT.GAME_STATUS.RUNNING;
      let dir = getRandomInt(CONSTANT.ITEM_DIR.DIR_NUM);
      this.curItem = new Item_L(dir);
      this.curPos.x = 4;
      this.curPos.y = 0;
      this.initData();
      this.gameLoop();
    } else if (status === CONSTANT.GAME_STATUS.RUNNING) {
      status = CONSTANT.GAME_STATUS.PAUSE;
    } else if (status === CONSTANT.GAME_STATUS.PAUSE) {
      status = CONSTANT.GAME_STATUS.NOT_START;
    }

    this.setState({
      status: status,
    });
  }

  initData = () => {
    for (let i=0;i<MAP_WIDTH;i++) {
      for (let j=0;j<MAP_HEIGHT;j++) {
        this.mapData[i][j] = 0;
      }
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

    let buttonStr = '';
    if (this.state.status == CONSTANT.GAME_STATUS.NOT_START) {
      buttonStr = 'Start';
    } else if (this.state.status == CONSTANT.GAME_STATUS.RUNNING) {
      buttonStr = 'Pause';
    } else if (this.state.status == CONSTANT.GAME_STATUS.PAUSE) {
      buttonStr = 'Resume';
    } else {
      buttonStr = 'Error';
    }

    return (
      <div className="game-screen">
        <div ref={this.setGamePanelRef}>
          <canvas ref={this.setCanvasRef}></canvas>
        </div>
        <div className="game-status">
          <Button style={{width: '100px'}} onClick={this.buttonClickCb}>{buttonStr}</Button>
        </div>
      </div>
    );
  }
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}