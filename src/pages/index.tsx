import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { CompletedChallenges } from '../components/CompletedChallenges'
import { Countdown } from '../components/Countdown'
import { ExperienceBar } from '../components/ExperienceBar'
import { Profile } from '../components/Profile'
import { ChallengeBox } from '../components/ChallengeBox'
import { CountdownProvider } from '../contexts/CountdownContext'
import { ChallengesProvider } from '../contexts/ChallengesContext'

import styles from '../styles/pages/Home.module.css'
import { LeftPane } from '../components/LeftPane'

interface HomeProps {
  level: number,
  currentExperience: number,
  challengesCompleted: number,
  username: string, 
  name: string
}

export default function Home(props: HomeProps) {
  return (
    <ChallengesProvider 
      level={props.level} 
      currentExperience={props.currentExperience} 
      challengesCompleted={props.challengesCompleted}
      username={props.username}
      name={props.name}
    >
      <div className={styles.container}>
        <div className={styles.aside}>
          <LeftPane />
        </div>
        <div className={styles.main}>
          <Head>
            <title>Início | move.it</title>
          </Head>

          <ExperienceBar />

          <CountdownProvider>
            <section>
              <div>
                <Profile />
                <CompletedChallenges />
                <Countdown />
              </div>
              <div>
                <ChallengeBox />
              </div>
            </section>
          </CountdownProvider>

        </div>
      </div>      
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { level, currentExperience, challengesCompleted, username } = context.req.cookies

  let name: string = undefined

  if (username) {
    name = await fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(data => data.name)
  }

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      username: username ?? "",
      name: name ?? "Anônimo"
    } 
  }
}