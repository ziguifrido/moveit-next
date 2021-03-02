import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { IoPersonCircleOutline, IoLogoGithub } from 'react-icons/io5'

import styles from '../styles/components/LeftPane.module.css'

export function LeftPane() {
  const { openUsernameModal } = useContext(ChallengesContext)

  return (
    <div className={styles.container}>
      <img src="/logo.svg" alt="MoveIt"/>
      <div>
        <IoPersonCircleOutline onClick={openUsernameModal} title="Alterar Perfil"/>
        <a href="https://github.com/ziguifrido/moveit-next" target="_blank" title="GitHub">
          <IoLogoGithub />
        </a>
      </div>
    </div>
  )
}