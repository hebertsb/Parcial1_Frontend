"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getCurrentUser, setCurrentUser, logoutUser } from "../lib/auth"

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => Promise<void>
  clearExpiredSession: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    console.log('🔄 AuthContext useEffect: Iniciando...');
    const user = getCurrentUser()
    console.log('👤 AuthContext useEffect: Usuario obtenido:', user);
    
    // Verificar si hay token y si está expirado
    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken')
    if (token) {
      try {
        // Decodificar el JWT para verificar expiración
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Date.now() / 1000
        
        if (payload.exp && payload.exp < now) {
          console.log('🚨 Token expirado, limpiando sesión...');
          // Limpiar todos los tokens y datos de usuario
          localStorage.removeItem('authToken')
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          localStorage.removeItem('currentUser')
          sessionStorage.removeItem('access_token')
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
          return
        }
      } catch (error) {
        console.log('❌ Error al verificar token, limpiando sesión...');
        // Limpiar todos los tokens y datos de usuario
        localStorage.removeItem('authToken')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('currentUser')
        sessionStorage.removeItem('access_token')
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        return
      }
    }
    
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const login = (user: User) => {
    console.log('🔓 AuthContext login: Recibiendo usuario:', user);
    setCurrentUser(user)
    console.log('💾 AuthContext login: Usuario guardado en localStorage');
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })
    console.log('✅ AuthContext login: Estado actualizado');
  }

  const logout = async () => {
    try {
      logoutUser()
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if server logout fails
      logoutUser()
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const clearExpiredSession = () => {
    console.log('🧹 Limpiando sesión expirada...');
    // Limpiar todos los tokens y datos de usuario
    localStorage.removeItem('authToken')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('currentUser')
    sessionStorage.removeItem('access_token')
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const updateUser = (user: User) => {
    console.log('🔄 AuthContext updateUser: Actualizando usuario:', user);
    setCurrentUser(user, true);
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
    console.log('✅ AuthContext updateUser: Usuario actualizado');
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, clearExpiredSession, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
