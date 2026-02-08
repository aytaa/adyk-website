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
  const body = { phone: phoneNumber }
  console.log('[sendOTP] Request:', `${BASE_API}/mobile/auth/send-code`, body)
  const response = await fetch(`${BASE_API}/mobile/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Kod gönderilemedi')
  }
  return data
}

export const verifyOTP = async (phoneNumber, code) => {
  const body = { phone: phoneNumber, code }
  console.log('[verifyOTP] Request:', `${BASE_API}/mobile/auth/verify-code`, body)
  const response = await fetch(`${BASE_API}/mobile/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

export const getPricing = async (hasTracker = false) => {
  const token = getAccessToken()
  const query = hasTracker !== null && hasTracker !== undefined ? `?hasTracker=${hasTracker}` : ''
  const response = await fetch(`${BASE_API}/pricing${query}`, {
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

export const getMyOrders = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/orders/my`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Siparişler alınamadı')
  }
  return data
}

export const getProfile = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Profil bilgisi alınamadı')
  }
  return data
}

export const updateProfile = async (profileData) => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Profil güncellenemedi')
  }
  return data
}

export const getMyDevices = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/user/vessels`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Cihaz bilgisi alınamadı')
  }
  return data
}

export const getMySubscriptions = async () => {
  const token = getAccessToken()
  const response = await fetch(`${BASE_API}/subscription/my`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Abonelik bilgisi alınamadı')
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
