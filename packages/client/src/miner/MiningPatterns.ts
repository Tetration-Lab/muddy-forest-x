export interface Rectangle {
  x: number
  y: number
}

export enum MiningPatternType {
  Spiral,
  SwissCheese,
}

export interface MiningPattern {
  type: MiningPatternType
  fromChunk: Rectangle
  setFromChunk: (loc: Rectangle) => void
  nextChunk: (prevLoc: Rectangle) => Rectangle
}

export class SpiralPattern implements MiningPattern {
  type: MiningPatternType = MiningPatternType.Spiral
  fromChunk: Rectangle

  constructor(center: Rectangle) {
    this.fromChunk = center
  }

  setFromChunk = (loc: Rectangle) => {
    this.fromChunk = loc
  }

  nextChunk(chunk: Rectangle): Rectangle {
    const homeX = this.fromChunk.x
    const homeY = this.fromChunk.y
    const currX = chunk.x
    const currY = chunk.y

    const nextBottomLeft = { x: currX, y: currY }

    if (currX === homeX && currY === homeY) {
      nextBottomLeft.y = homeY + 1
    } else if (currY - currX > homeY - homeX && currY + currX >= homeX + homeY) {
      if (currY + currX === homeX + homeY) {
        // break the circle
        nextBottomLeft.y = currY + 1
      } else {
        nextBottomLeft.x = currX + 1
      }
    } else if (currX + currY > homeX + homeY && currY - currX <= homeY - homeX) {
      nextBottomLeft.y = currY - 1
    } else if (currX + currY <= homeX + homeY && currY - currX < homeY - homeX) {
      nextBottomLeft.x = currX - 1
    } else {
      // if (currX + currY < homeX + homeY && currY - currX >= homeY - homeX)
      nextBottomLeft.y = currY + 1
    }

    return nextBottomLeft
  }
}

export class SwissCheesePattern implements MiningPattern {
  type: MiningPatternType = MiningPatternType.SwissCheese
  fromChunk: Rectangle
  chunkSideLength: number

  constructor(center: Rectangle) {
    this.fromChunk = center
  }

  setFromChunk = (loc: Rectangle) => {
    this.fromChunk = loc
  }

  nextChunk(chunk: Rectangle): Rectangle {
    const homeX = this.fromChunk.x
    const homeY = this.fromChunk.y
    const currX = chunk.x
    const currY = chunk.y

    const nextBottomLeft = { x: currX, y: currY }

    if (currX === homeX && currY === homeY) {
      nextBottomLeft.y = homeY + 2
    } else if (currY - currX > homeY - homeX && currY + currX >= homeX + homeY) {
      if (currY + currX === homeX + homeY) {
        // break the circle
        nextBottomLeft.y = currY + 2
      } else {
        nextBottomLeft.x = currX + 2
      }
    } else if (currX + currY > homeX + homeY && currY - currX <= homeY - homeX) {
      nextBottomLeft.y = currY - 2
    } else if (currX + currY <= homeX + homeY && currY - currX < homeY - homeX) {
      nextBottomLeft.x = currX - 2
    } else {
      // if (currX + currY < homeX + homeY && currY - currX >= homeY - homeX)
      nextBottomLeft.y = currY + 2
    }

    return nextBottomLeft
  }
}
