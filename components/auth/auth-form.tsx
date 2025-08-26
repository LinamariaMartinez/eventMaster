'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface AuthFormProps {
  mode: 'login' | 'register'
  redirectTo?: string
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        await signUp(email, password, name)
        toast.success('¡Cuenta creada! Revisa tu email para confirmar tu cuenta')
      } else {
        const result = await signIn(email, password)
        
        if (result.user) {
          toast.success('¡Bienvenida de vuelta!')
          
          // Small delay to ensure session is properly set
          setTimeout(() => {
            const destination = redirectTo || '/dashboard'
            router.push(destination)
            router.refresh() // Force refresh to update auth state
          }, 100)
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header with elegant typography */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-playfair font-semibold text-text-primary mb-3">
          {mode === 'login' ? 'Acceso del Equipo' : 'Crear Cuenta'}
        </h2>
        <p className="text-text-secondary text-base font-inter">
          {mode === 'login' 
            ? 'Ingresa a tu cuenta para gestionar eventos' 
            : 'Únete al equipo de Catalina Lezama'
          }
        </p>
      </div>
      
      {/* Luxury form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'register' && (
          <div className="space-y-3">
            <Label 
              htmlFor="name"
              className="text-sm font-inter font-medium text-text-primary tracking-wide"
            >
              Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 px-4 border-2 border-cream-dark/30 focus:border-burgundy focus:ring-burgundy/20 rounded-xl bg-cream-light/30 font-inter placeholder:text-text-muted"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <Label 
            htmlFor="email"
            className="text-sm font-inter font-medium text-text-primary tracking-wide"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 px-4 border-2 border-cream-dark/30 focus:border-burgundy focus:ring-burgundy/20 rounded-xl bg-cream-light/30 font-inter placeholder:text-text-muted"
          />
        </div>

        <div className="space-y-3">
          <Label 
            htmlFor="password"
            className="text-sm font-inter font-medium text-text-primary tracking-wide"
          >
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 px-4 border-2 border-cream-dark/30 focus:border-burgundy focus:ring-burgundy/20 rounded-xl bg-cream-light/30 font-inter placeholder:text-text-muted"
          />
        </div>

        {/* Luxury gradient button */}
        <Button 
          type="submit" 
          className="w-full h-12 luxury-gradient hover:burgundy-gradient text-cream-light font-inter font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] luxury-shadow disabled:opacity-50 disabled:transform-none mt-8"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-cream-light/30 border-t-cream-light rounded-full animate-spin" />
              Cargando...
            </div>
          ) : (
            mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
          )}
        </Button>
      </form>

      {/* Navigation links with luxury styling */}
      <div className="mt-8 text-center">
        {mode === 'login' ? (
          <p className="text-text-secondary font-inter">
            ¿No tienes cuenta?{' '}
            <Link 
              href="/register" 
              className="text-burgundy hover:text-burgundy-dark font-medium transition-colors duration-200 font-playfair"
            >
              Regístrate aquí
            </Link>
          </p>
        ) : (
          <p className="text-text-secondary font-inter">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/login" 
              className="text-burgundy hover:text-burgundy-dark font-medium transition-colors duration-200 font-playfair"
            >
              Inicia sesión
            </Link>
          </p>
        )}
      </div>

      {/* Breadcrumb back to home */}
      <div className="mt-6 pt-6 border-t border-cream-dark/20 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-burgundy font-inter transition-colors duration-200"
        >
          ← Volver al inicio
        </Link>
      </div>
    </>
  )
}