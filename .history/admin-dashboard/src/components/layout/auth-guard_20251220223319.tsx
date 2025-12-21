"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

// Chạy redirect trên client, không chặn render server
export function AuthGuard() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push('/login')
      else if (!isAdmin) router.push('/login?role=admin')
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  return null
}

