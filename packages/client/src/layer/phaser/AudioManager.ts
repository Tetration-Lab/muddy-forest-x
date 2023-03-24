import { AUDIO } from './constant/resource'

export class AudioManager {
  scene: Phaser.Scene
  pew: Phaser.Sound.BaseSound
  pew2: Phaser.Sound.BaseSound
  pew3: Phaser.Sound.BaseSound
  pew4: Phaser.Sound.BaseSound
  huh1: Phaser.Sound.BaseSound
  huh2: Phaser.Sound.BaseSound
  huh3: Phaser.Sound.BaseSound
  oh: Phaser.Sound.BaseSound
  bgm: Phaser.Sound.BaseSound
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.pew = this.scene.sound.add(AUDIO.PEW, { volume: 0.5 })
    this.pew2 = this.scene.sound.add(AUDIO.PEW_2, { volume: 0.5 })
    this.pew3 = this.scene.sound.add(AUDIO.PEW_3, { volume: 0.5 })
    this.pew4 = this.scene.sound.add(AUDIO.PEW_4, { volume: 0.5 })

    this.huh1 = this.scene.sound.add(AUDIO.HUH_1, { volume: 1 })
    this.huh2 = this.scene.sound.add(AUDIO.HUH_2, { volume: 1 })
    this.huh3 = this.scene.sound.add(AUDIO.HUH_3, { volume: 1.25 })

    this.oh = this.scene.sound.add(AUDIO.OH, { volume: 0.5 })

    this.bgm = this.scene.sound.add(AUDIO.BGM, { volume: 1, loop: true })
  }

  playBgm() {
    if (!this.scene.sound.locked) {
      this.bgm.play()
    } else {
      this.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.bgm.play()
      })
    }
  }

  playPew() {
    const effectList = [this.pew, this.pew2, this.pew3, this.pew4, this.huh1, this.huh2, this.huh3]
    const randomIndex = Math.floor(Math.random() * effectList.length)
    effectList[randomIndex].play()
    this.playEffect()
  }

  playEffect() {
    if (Math.random() < 0.3) {
      setTimeout(() => {
        this.oh.play()
      }, 500)
    }
  }
}
