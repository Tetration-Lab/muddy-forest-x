import { IDLE_ANIM, SPRITE } from '../constant/resouce'

export const initConfigAnim = (scene: Phaser.Scene) => {
  const idle = {
    key: 'doge',
    frames: scene.anims.generateFrameNumbers('dogeSheet', { start: 0, end: 74 }),
    frameRate: 12,
    repeat: -1,
  }
  const p1Idle = {
    key: 'p1Idle',
    frames: scene.anims.generateFrameNumbers('p1Sheet', { start: 0, end: 74 }),
    frameRate: 12,
    repeat: -1,
  }
  const p2Idle = {
    key: 'p2Idle',
    frames: scene.anims.generateFrameNumbers('p2Sheet', { start: 0, end: 74 }),
    frameRate: 12,
    repeat: -1,
  }
  const p8Idle = {
    key: 'p8Idle',
    frames: scene.anims.generateFrameNumbers('p8Sheet', { start: 0, end: 110 }),
    frameRate: 12,
    repeat: -1,
  }
  createAnimIdle(IDLE_ANIM.Explorer_Idle, 'explorerSheet', 0, 15, scene)
  createAnimIdle(IDLE_ANIM.Capital_1, SPRITE.Capital_1, 0, 74, scene)
  createAnimIdle(IDLE_ANIM.Capital_2, SPRITE.Capital_2, 0, 74, scene)
  createAnimIdle(IDLE_ANIM.Capital_3, SPRITE.Capital_3, 0, 74, scene)
  createAnimIdle(IDLE_ANIM.Capital_4, SPRITE.Capital_4, 0, 74, scene)
  scene.anims.create(idle)
  scene.anims.create(p1Idle)
  scene.anims.create(p2Idle)
  scene.anims.create(p8Idle)
}

function createAnimIdle(keyname: string, sheetName: string, start: number, end: number, scene: Phaser.Scene) {
  const config = {
    key: keyname,
    frames: scene.anims.generateFrameNumbers(sheetName, { start: start, end: end }),
    frameRate: 12,
    repeat: -1,
  }
  scene.anims.create(config)
}
