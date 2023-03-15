import { SPRITE } from '../constant/resource'

export const initConfigAnim = (scene: Phaser.Scene) => {
  createAnimIdle(SPRITE.EXPLORER, SPRITE.EXPLORER, 0, 15, scene)
  createAnimIdle(SPRITE.APE_AI_CAPITAL, SPRITE.APE_AI_CAPITAL, 0, 74, scene)
  createAnimIdle(SPRITE.APE_APE_CAPITAL, SPRITE.APE_APE_CAPITAL, 0, 74, scene)
  createAnimIdle(SPRITE.APE_ALINE_CAPITAL, SPRITE.APE_ALINE_CAPITAL, 0, 74, scene)
  createAnimIdle(SPRITE.Capital_4, SPRITE.Capital_4, 0, 74, scene)
  createAnimIdle(SPRITE.TELEPORT, SPRITE.TELEPORT, 0, 60, scene, 0, 20)
  createAnimIdle(SPRITE.DOGE, SPRITE.DOGE, 0, 74, scene)
  createAnimIdle(SPRITE.P1_1, SPRITE.P1_1, 0, 74, scene)
  createAnimIdle(SPRITE.P1_2, SPRITE.P1_2, 0, 74, scene)
  createAnimIdle(SPRITE.P1_3, SPRITE.P1_3, 0, 74, scene)
  createAnimIdle(SPRITE.P2_1, SPRITE.P2_1, 0, 74, scene)
  createAnimIdle(SPRITE.P2_2, SPRITE.P2_2, 0, 74, scene)
  createAnimIdle(SPRITE.P2_3, SPRITE.P2_3, 0, 74, scene)
  createAnimIdle(SPRITE.P3, SPRITE.P3, 0, 74, scene)
  createAnimIdle(SPRITE.P5, SPRITE.P5, 0, 74, scene)
  createAnimIdle(SPRITE.P7_1, SPRITE.P7_1, 0, 110, scene)
  createAnimIdle(SPRITE.P7_2, SPRITE.P7_2, 0, 110, scene)
  createAnimIdle(SPRITE.P8_1, SPRITE.P8_1, 0, 110, scene)
  createAnimIdle(SPRITE.P8_2, SPRITE.P8_2, 0, 110, scene)
  createAnimIdle(SPRITE.BOMB, SPRITE.BOMB, 0, 7, scene, 0, 20)
}

function createAnimIdle(
  keyname: string,
  sheetName: string,
  start: number,
  end: number,
  scene: Phaser.Scene,
  repeat = -1, // 0 is no repeat, -1 is means repeat forever
  frameRate = 12,
) {
  console.log('createAnimIdle', keyname, sheetName, start, end, repeat, frameRate)
  const config = {
    key: keyname,
    frames: scene.anims.generateFrameNumbers(sheetName, { start: start, end: end }),
    frameRate: frameRate,
    repeat: repeat,
  }
  scene.anims.create(config)
}
