import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import { UsernameModal } from '../components/UsernameModal'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesContextData {
  level: number 
  currentExperience: number
  experienceToNextLevel: number
  challengesCompleted: number
  name: string
  username: string
  levelUp: () => void
  startNewChallenge: () => void
  activeChallenge: Challenge
  resetChallenge: () => void
  completeChallenge: () => void
  openUsernameModal: () => void
}

interface ChallengesProviderProps {
  children: ReactNode,
  level: number,
  currentExperience: number,
  challengesCompleted: number,
  username: string,
  name: string
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  const [level, setLevel] = useState(rest.level ?? 0)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)
  const [name, setName] = useState(rest.name ?? "")
  const [username, setUsername] = useState(rest.username ?? "")
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(() => {
    Notification.requestPermission()
    if (level === 0) {
      setIsUsernameModalOpen(true)
    }
  }, [])

  useEffect(() => {
    Cookies.set('level', level.toString())
    Cookies.set('currentExperience', currentExperience.toString())
    Cookies.set('challengesCompleted', challengesCompleted.toString())
    Cookies.set('username', username)
  }, [level, currentExperience, challengesCompleted, username])

  function levelUp() {
    setLevel(level + 1)
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

  function openUsernameModal() {
    setIsUsernameModalOpen(true)
  }

  async function closeUsernameModal(username?:string) {
    let name: string = undefined
    
    if (username) {
      name = await fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => data.name)

      if (level === 0) setLevel(1)
    } else {
      setLevel(1)
      setCurrentExperience(0)
      setChallengesCompleted(0)
    }
    
    setName(name ?? "Anônimo")
    setUsername(username ?? "")
    setIsUsernameModalOpen(false)
  }

  function startNewChallenge() {
    const randomChallengesIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengesIndex]

    setActiveChallenge(challenge)

    if (Notification.permission === 'granted') {
      new Notification('Novo Desafio 🎉', {
        body: `Valendo ${challenge.amount} xp!`,
        icon: '/favicon.png',
        silent: true
      })
    }

    new Audio('/notification.mp3').play()
  }

  function resetChallenge() {
    setActiveChallenge(null)
  }

  function completeChallenge() {
    if (!activeChallenge) return

    const { amount } = activeChallenge
    let finalExperience = currentExperience + amount

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel
      levelUp()
    }

    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)

  }

  return (
    <ChallengesContext.Provider value={{
      level, 
      currentExperience, 
      experienceToNextLevel,
      challengesCompleted,
      name,
      username,
      levelUp, 
      startNewChallenge,
      activeChallenge,
      resetChallenge,
      completeChallenge,
      openUsernameModal
    }}>
      {children}

      { isLevelUpModalOpen && <LevelUpModal level={level} closeLevelUpModal={closeLevelUpModal}/> }
      { isUsernameModalOpen && <UsernameModal closeUsernameModal={closeUsernameModal} username={username} level={level}/> }
    </ChallengesContext.Provider>
  )
}