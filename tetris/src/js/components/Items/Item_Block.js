import { Item } from './Item';
import {CONSTANT} from '../constant';

export const ITEM_BLOCK = 'item_block';

export class Item_Block extends Item {

  getItem = () => {
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }

    this.itemData[1][0] = 1; //    o x x o
    this.itemData[2][0] = 1; //    o x x o
    this.itemData[1][1] = 1; //    o o o o
    this.itemData[2][1] = 1; //    o o o o

    return this.itemData;
  }
}