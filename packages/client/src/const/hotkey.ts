export const PHASER_HOTKEY = {
  move: {
    label: 'Move',
    keys: [
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
    ],
  },
  zoomIn: { label: 'Zoom In', keys: [Phaser.Input.Keyboard.KeyCodes.X] },
  zoomOut: { label: 'Zoom Out', keys: [Phaser.Input.Keyboard.KeyCodes.Z] },
  followExplorer: { label: 'Follow Explorer', keys: [Phaser.Input.Keyboard.KeyCodes.G] },
  followShip: { label: 'Follow Ship', keys: [Phaser.Input.Keyboard.KeyCodes.H] },
  unfollow: { label: 'Unfollow', keys: [Phaser.Input.Keyboard.KeyCodes.F] },
  clear: { label: 'Clear Lines/Selections', keys: [Phaser.Input.Keyboard.KeyCodes.ESC] },
}

export const PHASER_REVERSE_KEYMAP = Object.fromEntries(
  Object.entries(Phaser.Input.Keyboard.KeyCodes).map((e) => [e[1], e[0]]),
)
