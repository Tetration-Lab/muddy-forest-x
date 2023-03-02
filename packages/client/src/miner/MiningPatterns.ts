export interface Rectangle {
  x: number
  y: number
}

export enum MiningPatternType {
  Spiral,
  SwissCheese,
  TowardsCenter,
  TowardsCenterV2,
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

export class TowardsCenterPattern implements MiningPattern {
  type: MiningPatternType = MiningPatternType.TowardsCenter
  fromChunk: Rectangle
  chunkSideLength: number
  private tipX: number
  private tipY: number
  private maxWidth = 1600

  constructor(center: Rectangle) {
    this.fromChunk = center
    if (center.x < 0) {
      this.tipX = center.x + 1
    } else {
      this.tipX = center.x - 1
    }
    if (center.y < 0) {
      this.tipY = center.y + 1
    } else {
      this.tipY = center.y - 1
    }
  }

  setFromChunk = (loc: Rectangle) => {
    this.fromChunk = loc
  }

  nextChunk(chunk: Rectangle): Rectangle {
    const homeX = this.fromChunk.x
    const homeY = this.fromChunk.y
    const currX = chunk.x
    const currY = chunk.y

    const absHomeX = Math.abs(homeX)
    const absHomeY = Math.abs(homeY)
    const absTipX = Math.abs(this.tipX)
    const absTipY = Math.abs(this.tipY)
    const absCurrX = Math.abs(currX)
    const absCurrY = Math.abs(currY)

    const endX = currX <= 0 ? Math.max(homeX, this.tipX - this.maxWidth) : Math.min(homeX, this.tipX + this.maxWidth)

    const nextBottomLeft = {
      x: currX,
      y: currY,
    }

    if (currX === homeX && currY === homeY) {
      nextBottomLeft.x = this.tipX
      nextBottomLeft.y = this.tipY
    } else if (currX === this.tipX && currY === this.tipY) {
      if (currX < 0) {
        nextBottomLeft.x = currX - 1
      } else if (currX > 0) {
        nextBottomLeft.x = currX + 1
      } else {
        // Exactly 0
        if (homeX < 0) {
          nextBottomLeft.x = currX - 1
        } else {
          nextBottomLeft.x = currX + 1
        }
      }
    } else if (absCurrX < absHomeX && currY === this.tipY && absCurrX - absTipX < this.maxWidth) {
      if (currX < 0) {
        nextBottomLeft.x = currX - 1
      } else if (currX > 0) {
        nextBottomLeft.x = currX + 1
      } else {
        // Exactly 0
        if (homeX < 0) {
          nextBottomLeft.x = currX - 1
        } else {
          nextBottomLeft.x = currX + 1
        }
      }
    } else if (currX === endX && currY === this.tipY) {
      nextBottomLeft.x = this.tipX
      if (currY < 0) {
        nextBottomLeft.y = currY - 1
      } else if (currY > 0) {
        nextBottomLeft.y = currY + 1
      } else {
        // Exactly 0
        if (homeY < 0) {
          nextBottomLeft.y = currY - 1
        } else {
          nextBottomLeft.y = currY + 1
        }
      }
    } else if (currX === this.tipX && absCurrY < absHomeY && absCurrY - absTipY < this.maxWidth) {
      if (currY < 0) {
        nextBottomLeft.y = currY - 1
      } else if (currY > 0) {
        nextBottomLeft.y = currY + 1
      } else {
        // Exactly 0
        if (homeY < 0) {
          nextBottomLeft.y = currY - 1
        } else {
          nextBottomLeft.y = currY + 1
        }
      }
    } else {
      if (this.tipX < 0) {
        this.tipX += 1
      } else if (this.tipX > 0) {
        this.tipX -= 1
      } else {
        this.tipX = 0
      }
      if (this.tipY < 0) {
        this.tipY += 1
      } else if (this.tipY > 0) {
        this.tipY -= 1
      } else {
        this.tipY = 0
      }
      nextBottomLeft.x = this.tipX
      nextBottomLeft.y = this.tipY
    }

    return nextBottomLeft
  }
}

export class TowardsCenterPatternV2 implements MiningPattern {
  type: MiningPatternType = MiningPatternType.TowardsCenterV2
  fromChunk: Rectangle
  chunkSideLength: number
  private rowRadius: number
  private yDominant: boolean
  private slopeToCenter: number

  constructor(center: Rectangle) {
    this.fromChunk = center
    this.rowRadius = 5 // In chunks
    this.yDominant = Math.abs(center.y) > Math.abs(center.x)
    this.slopeToCenter = center.x === 0 ? 1 : center.y / center.x // i.e. deltaY / deltaX
  }

  setFromChunk = (loc: Rectangle) => {
    this.fromChunk = loc
  }

  nextChunk(chunk: Rectangle): Rectangle {
    const homeX = this.fromChunk.x
    const homeY = this.fromChunk.y
    const currX = chunk.x
    const currY = chunk.y

    if (this.yDominant) {
      const centerOfRowX = Math.floor(homeX + (currY - homeY) / this.slopeToCenter)
      if (currX < centerOfRowX + 1 * (this.rowRadius - 1)) {
        return {
          x: currX + 1,
          y: currY,
        }
      } else {
        const nextCenterOfRowX = Math.floor(centerOfRowX + 1 / this.slopeToCenter)
        return {
          x: nextCenterOfRowX - (this.rowRadius - 1),
          y: currY < 0 ? currY + 1 : currY - 1,
        }
      }
    }

    // We are now in the X dominant case
    const centerOfRowY = Math.floor(homeY + (currX - homeX) * this.slopeToCenter)
    if (currY < centerOfRowY + 1 * (this.rowRadius - 1)) {
      return {
        x: currX,
        y: currY + 1,
      }
    } else {
      const nextCenterOfRowY = Math.floor(centerOfRowY + 1 * this.slopeToCenter)
      return {
        x: currX < 0 ? currX + 1 : currX - 1,
        y: nextCenterOfRowY - (this.rowRadius - 1),
      }
    }
  }
}
