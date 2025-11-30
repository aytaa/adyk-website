const API_URL = 'https://api.adyk.online/api/auth'

export const register = async (name, email, phone, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Kayıt başarısız')
    }

    return data
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Giriş başarısız')
    }

    if (data.success && data.accessToken) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } else {
      throw new Error('Geçersiz yanıt formatı')
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken')
}

export const getUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  return null
}
