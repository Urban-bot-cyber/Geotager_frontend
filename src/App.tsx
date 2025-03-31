import { FC, useEffect } from 'react'
import Routes from 'routes/Routes'
import { usePageIdentification } from 'hooks/usePageIdentification'
import { observer } from 'mobx-react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { logUserAction } from 'utils/logUserAction'

const App: FC = () => {
  usePageIdentification()

  useEffect(() => {
    // Log click events
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const componentType = target.tagName.toLowerCase() // e.g., button, a, input
      logUserAction('click', componentType)
    }

    // Log scroll events (consider debouncing for performance)
    const handleScroll = () => {
      logUserAction('scroll')
    }

    // Log input change events
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      if (target && (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea')) {
        logUserAction('input', target.tagName.toLowerCase(), target.value)
      }
    }

    // Attach global event listeners
    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('input', handleInputChange)

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('input', handleInputChange)
    }
  }, [])

  return <Routes />
}

export default observer(App)