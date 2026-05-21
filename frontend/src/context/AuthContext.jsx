import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../lib/axios'

const AuthContext =
  createContext()

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } =
          await api.get('/user/me')

        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  async function logout() {
    await api.post('/user/logout')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}