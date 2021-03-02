import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/components/Profile.module.css'
import { IoPersonCircleOutline } from 'react-icons/io5'

export function Profile () {
  const { level, name, username } = useContext(ChallengesContext)
  
  return (
    <div className={styles.profileContainer}>
      { username ?
          <img src={`https://github.com/${username}.png`} alt="Avatar"/>
        :
          <IoPersonCircleOutline />
      }
      <div>
        <strong>{name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level {level}
        </p>
      </div>
    </div>
  )
}