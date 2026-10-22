import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const nodePositions = [
  { left: '2%', top: '14%', delay: '0s' },
  { left: '35%', top: '56%', delay: '0.6s' },
  { left: '66%', top: '14%', delay: '1.2s' }
]

export default function AutomationScene({ t }: SceneProps) {
  const { automation } = t
  return (
    <>
      <AppHeader title={automation.title} />
      <Piece
        name="<FlowCanvas />"
        order={1}
        depth={30}
        className={`${S.card} ${S.flow}`}
      >
        <svg
          viewBox="0 0 270 130"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={S.flowPath}
            style={{ '--path-delay': '0.25s' } as CSSProperties}
            d="M60 38 C 95 38, 95 92, 125 92"
          />
          <path
            className={S.flowPath}
            style={{ '--path-delay': '0.85s' } as CSSProperties}
            d="M175 92 C 205 92, 205 38, 222 38"
          />
        </svg>
        {automation.nodes.map((node, index) => (
          <div
            key={node.label}
            className={`${S.node} ${index === 1 ? S.nodeAi : ''}`}
            style={
              {
                left: nodePositions[index].left,
                top: nodePositions[index].top,
                '--node-delay': nodePositions[index].delay
              } as CSSProperties
            }
          >
            <small className={S.nodeLabel}>{node.label}</small>
            {node.text}
          </div>
        ))}
      </Piece>
      <SceneButton
        label={automation.cta}
        success={automation.success}
        order={2}
      />
    </>
  )
}
