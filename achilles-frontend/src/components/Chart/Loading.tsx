import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface ProgressBarProps {
  readonly progress: number
}

const StyledProgressBar = styled('div')<ProgressBarProps>`
  width: ${props => props.progress}%;
  height: 100%;
  background: #0ff;
  transition: all ease 1s;
`

export const Loading = (props: any) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (props.progress) {
      setProgress(props.progress)
    }
  }, [props.progress])

  return (
    <div>
      <p>{progress.toFixed(2)}%</p>
      <div style={{ width: '100%', height: '40px', position: 'relative' }}>
        <StyledProgressBar progress={progress}/>
      </div>
    </div>
  )
}

export default Loading
