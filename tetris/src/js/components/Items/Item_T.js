import { Item } from './Item';
import {CONSTANT} from '../constant';

export const ITEM_T = 'item_T';

export class Item_T extends Item {

  getItem = () => {
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }

    if (this.curDir === CONSTANT.ITEM_DIR.UP) {
      this.itemData[0][0] = 1; //    x x x o
      this.itemData[1][0] = 1; //    o x o o
      this.itemData[2][0] = 1; //    o o o o
      this.itemData[1][1] = 1; //    o o o o
    } else if (this.curDir === CONSTANT.ITEM_DIR.RIGHT) {
      this.itemData[0][1] = 1; //    o x o o
      this.itemData[1][0] = 1; //    x x o o
      this.itemData[1][1] = 1; //    o x o o
      this.itemData[1][2] = 1; //    o o o o
    } else if (this.curDir === CONSTANT.ITEM_DIR.DOWN) {
      this.itemData[1][0] = 1; //    o x o o
      this.itemData[0][1] = 1; //    x x x o
      this.itemData[1][1] = 1; //    o o o o
      this.itemData[2][1] = 1; //    o o o o
    } else if (this.curDir === CONSTANT.ITEM_DIR.LEFT) {
      this.itemData[0][0] = 1; //    x o o o
      this.itemData[0][1] = 1; //    x x o o
      this.itemData[0][2] = 1; //    x o o o
      this.itemData[1][1] = 1; //    o o o o
    }

    return this.itemData;
  }
}