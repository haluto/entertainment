export const ITEM_DIR = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

export class Item {
  MAX_WIDTH = 4;
  MAX_HEIGHT = 4;
  curDir = ITEM_DIR.UP;

  constructor(dir) {
    this.itemData = new Array(this.MAX_WIDTH);
    for (let i=0;i<this.MAX_WIDTH;i++) {
      this.itemData[i] = new Array(this.MAX_HEIGHT);
    }
    this.curDir = dir;
  }

  rotateItem = (isClockwise) => {
    if (isClockwise) {
      if (this.curDir === ITEM_DIR.UP) {
        this.curDir = ITEM_DIR.RIGHT;
      } else if (this.curDir === ITEM_DIR.RIGHT) {
        this.curDir = ITEM_DIR.DOWN;
      } else if (this.curDir === ITEM_DIR.DOWN) {
        this.curDir = ITEM_DIR.LEFT;
      } else if (this.curDir === ITEM_DIR.LEFT) {
        this.curDir = ITEM_DIR.UP;
      }
    } else {
      if (this.curDir === ITEM_DIR.UP) {
        this.curDir = ITEM_DIR.LEFT;
      } else if (this.curDir === ITEM_DIR.RIGHT) {
        this.curDir = ITEM_DIR.UP;
      } else if (this.curDir === ITEM_DIR.DOWN) {
        this.curDir = ITEM_DIR.RIGHT;
      } else if (this.curDir === ITEM_DIR.LEFT) {
        this.curDir = ITEM_DIR.DOWN;
      }
    }
    return this.getItem();
  }

  getItem = () => {
    // specific item do its item configuration.
    /*
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }
    return this.itemData;
    */
  }
}