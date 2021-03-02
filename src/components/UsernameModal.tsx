import { useState } from 'react'
import styles from '../styles/components/UsernameModal.module.css'

interface UsernameModalProps {
  closeUsernameModal: (username?: string) => void
  username: string
  level: number
}

export function UsernameModal({ closeUsernameModal, level, ...rest }: UsernameModalProps) {
  const [username, setUsername] = useState(rest.username ?? "")

  const usernameAux: string = rest.username

  const hasUsername = username.length > 0

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <strong>
          Nome de usuário no GitHub
        </strong>
        <input type="text" className={styles.usernameInput} value={username} onChange={e => setUsername(e.target.value)}/>
        <div>
          <button className={styles.confirmar} disabled={!hasUsername} onClick={() => closeUsernameModal(username)}>
            Confirmar
          </button>
          <button className={styles.anonimo} onClick={() => closeUsernameModal()}>
            Anônimo
          </button>
        </div>
        {level > 0 &&
          <img 
            src="/icons/close.svg" 
            alt="Fechar modal" 
            onClick={() => closeUsernameModal(usernameAux)}
          />
        }
      </div>
    </div>
  )
}