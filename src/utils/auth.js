const API_URL = 'https://api.adyk.online/api/auth'
const BASE_API = 'https://api.adyk.online/api'

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

// Phone-based auth
export const sendOTP = async (phoneNumber) => {
  const response = await fetch(`${API_URL}/mobile/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Kod gönderilemedi')
  }
  return data
}

export const verifyOTP = async (phoneNumber, code) => {
  const response = await fetch(`${API_URL}/mobile/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, code }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Doğrulama başarısız')
  }
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken)
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    localStorage.setItem('phoneNumber', phoneNumber)
  }
  return data
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('phoneNumber')
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken')
}

export const getPhoneNumber = () => {
  return localStorage.getItem('phoneNumber') || ''
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

export const getSubscriptionStatus = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/subscription/status`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Abonelik durumu alınamadı')
  }
  return data
}

export const getPricing = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/pricing`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Fiyat bilgisi alınamadı')
  }
  return data
}

export const createOrder = async (orderData) => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Sipariş oluşturulamadı')
  }
  return data
}

export const initPayment = async (orderId) => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/payments/paytr/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Ödeme başlatılamadı')
  }
  return data
}
