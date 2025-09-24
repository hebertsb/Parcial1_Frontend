"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getCurrentUser, setCurrentUser, logoutUser } from "../lib/auth"

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => Promise<void>
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
      await logoutUser()
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if server logout fails
      setCurrentUser(null)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  return <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
