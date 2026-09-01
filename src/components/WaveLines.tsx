import type { CSSProperties } from 'react'
import flowPattern from '../assets/simba/brand/simba-flow-pattern.svg'

type WaveLinesProps = {
  className?: string
  style?: CSSProperties
}

export default function WaveLines({ className = '', style }: WaveLinesProps) {
  return <img src={flowPattern} alt="" aria-hidden="true" className={`object-cover ${className}`} style={style} />
}
