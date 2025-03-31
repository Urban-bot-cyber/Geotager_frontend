import * as API from 'api/Api'
import authStore from 'stores/auth.store'

export const logUserAction = async (action: string, componentType?: string, newValue?: string, url?: string) => {
  try {
    const token = authStore.token // Ensure you have the token if needed
    const payload = {
      action,
      component_type: componentType,
      new_value: newValue,
      url: url || window.location.href,
    }
    // Call your logging endpoint (adjust method and path if needed)
    await API.logUserAction(payload, token || '')
  } catch (error) {
    // Handle logging error silently, or report it if needed.
    console.error('Failed to log user action', error)
  }
}