import { FACTION } from '../../../../const/faction'
import { GameItemEntry } from '../PlanetModal/GameItemEntry'

export interface SpriteEntryProps {
  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image
  name: string
  position: Phaser.Types.Math.Vector2Like
  faction?: number
  onClick?: () => void
}
export const SpriteEntry = ({ name, position, sprite, faction, onClick }: SpriteEntryProps) => {
  return (
    <GameItemEntry
      iconUrl={sprite?.texture?.manager?.getBase64(sprite?.texture?.key)}
      title={name}
      description={`${position.x}, ${position.y}`}
      onClick={onClick}
      sx={{
        border: `1px solid ${FACTION[faction]?.color}`,
        //borderStyle: 'outset',
      }}
    />
  )
}
