import React from 'react';
import {Item_L, ITEM_L} from './Items/Item_L';
import {CONSTANT} from './constant';

const MAP_WIDTH = CONSTANT.GAME_PANEL.MAP_WIDTH;
const MAP_HEIGHT = CONSTANT.GAME_PANEL.MAP_HEIGHT;
const GRID_SIDE_LEN = CONSTANT.GAME_PANEL.GRID_SIDE_LEN;
const MAP_STYLE_BORDER = CONSTANT.GAME_PANEL.MAP_STYLE_BORDER;

export default class GamePanel extends React.Component {
  constructor(props) {
    super(props);
    this.gamePanel = null;
    this.canvas = null;
    this.setGamePanelRef = element => {
      this.gamePanel = element;
    };
    this.setCanvasRef = element => {
      this.canvas = element;
    };
  }

  drawScreen = () => {
    this.curItem = new Item_L(0);
    let data = this.curItem.getItem();
    for(let i=0;i<this.curItem.MAX_WIDTH;i++) {
      for(let j=0;j<this.curItem.MAX_HEIGHT;j++) {
        //TODO: (4,0) is the initial position.
        this.mapData[i+4][j] = data[i][j];
      }
    }

    for (let i=0;i<MAP_WIDTH;i++) {
      for (let j=0;j<MAP_HEIGHT;j++) {
        this.ctx.save();
        if (this.mapData[i][j] === 1) {
          this.ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
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

    this.initData();

    this.drawScreen();
  }

  render = () => {

    return (
      <div ref={this.setGamePanelRef}>
        <canvas ref={this.setCanvasRef}></canvas>
      </div>
    );
  }
}