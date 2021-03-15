import { Item } from './Item';
import {CONSTANT} from '../constant';

export const ITEM_L = 'item_L';

export class Item_L extends Item {

  getItem = () => {
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }

    if (this.curDir === CONSTANT.ITEM_DIR.UP) {
      this.itemData[0][0] = 1;
      this.itemData[0][1] = 1;
      this.itemData[0][2] = 1;
      this.itemData[1][2] = 1;
    } else if (this.curDir === CONSTANT.ITEM_DIR.RIGHT) {
      this.itemData[0][0] = 1;
      this.itemData[1][0] = 1;
      this.itemData[2][0] = 1;
      this.itemData[0][1] = 1;
    } else if (this.curDir === CONSTANT.ITEM_DIR.DOWN) {
      this.itemData[0][0] = 1;
      this.itemData[1][0] = 1;
      this.itemData[1][1] = 1;
      this.itemData[1][2] = 1;
    } else if (this.curDir === CONSTANT.ITEM_DIR.LEFT) {
      this.itemData[0][1] = 1;
      this.itemData[1][1] = 1;
      this.itemData[2][1] = 1;
      this.itemData[2][0] = 1;
    }

    return this.itemData;
  }
}