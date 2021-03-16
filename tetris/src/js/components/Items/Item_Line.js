import { Item } from './Item';
import {CONSTANT} from '../constant';

export const ITEM_LINE = 'item_Z';

export class Item_Line extends Item {

  getItem = () => {
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }

    if (this.curDir === CONSTANT.ITEM_DIR.UP || this.curDir === CONSTANT.ITEM_DIR.DOWN) {
      this.itemData[1][0] = 1; //    o x o o
      this.itemData[1][1] = 1; //    o x o o
      this.itemData[1][2] = 1; //    o x o o
      this.itemData[1][3] = 1; //    o x o o
    } else if (this.curDir === CONSTANT.ITEM_DIR.RIGHT || this.curDir === CONSTANT.ITEM_DIR.LEFT) {
      this.itemData[0][1] = 1; //    o o o o
      this.itemData[1][1] = 1; //    x x x x
      this.itemData[2][1] = 1; //    o o o o
      this.itemData[3][1] = 1; //    o o o o
    }

    return this.itemData;
  }
}