export const CONSTANT = {
  GAME_PANEL: {
    MAP_WIDTH: 12,
    MAP_HEIGHT: 20,
    GRID_SIDE_LEN: 20, //px
    MAP_STYLE_BORDER: 2, //px
  },

  GAME_STATUS: {
    NOT_START: 0,
    RUNNING: 1,
    PAUSE: 2
  },

  ITEM_DIR: {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    DIR_NUM: 4
  },

  ITEM: {
    MAX_WIDTH: 4,
    MAX_HEIGHT: 4
  },

  CONFIG: {
    LR_INTERVAL: 100, // left right interval in ms
    DROP_DOWN_TIMEOUT_DEFAULT: 1000,
    SPEED_UP_DROP_DOWN_TIMEOUT: 50,
    ELIMINATE_ANIM: {
      PER_FRAME_TIMEOUT: 80,
      FRAMES: 5,
    },
    SCORE: {
      ONE_LINE: 100,
      TWO_LINES: 300,
      THREE_LINES: 600,
      FOUR_LINES: 1000,
    },
  },

  KEY: {
    ARROW_START: 37,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    ARROW_END: 40,
  }
};