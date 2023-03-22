import { AUDIO } from './constant/resource'

export class AudioManager {
  scene: Phaser.Scene
  pew: Phaser.Sound.BaseSound
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.pew = this.scene.sound.add(AUDIO.PEW, { volume: 1 })
  }
  playPew() {
    this.pew.play()
  }
}
