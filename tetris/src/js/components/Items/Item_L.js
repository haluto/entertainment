import { Item, ITEM_DIR } from './Item';

export const ITEM_L = 'item_L';

export class Item_L extends Item {

  getItem = () => {
    for (let i=0;i<this.MAX_WIDTH;i++) {
      for (let j=0;j<this.MAX_HEIGHT;j++) {
        this.itemData[i][j] = 0;
      }
    }
    console.log("Item_L");

    if (this.curDir === ITEM_DIR.UP) {
      this.itemData[0][0] = 1;
      this.itemData[0][1] = 1;
      this.itemData[0][2] = 1;
      this.itemData[1][2] = 1;
    }

    return this.itemData;
  }
}