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
  const H1Idle = {
    key: 'H1Idle',
    frames: scene.anims.generateFrameNumbers('H1Sheet', { start: 0, end: 74 }),
    frameRate: 12,
    repeat: -1,
  }
  scene.anims.create(idle)
  scene.anims.create(p1Idle)
  scene.anims.create(p2Idle)
  scene.anims.create(H1Idle)
  scene.anims.create(p8Idle)
}
