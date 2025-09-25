import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/core/api/client'

export interface Familiar {
  id: number
  parentesco: string
  parentesco_display: string
  parentesco_descripcion?: string
  autorizado_acceso: boolean
  puede_autorizar_visitas: boolean
  observaciones?: string
  activo: boolean
  created_at: string
  persona_info: {
    nombre: string
    apellido: string
    documento_identidad: string
    telefono: string
    email: string
    fecha_nacimiento: string
  }
}

export interface Inquilino {
  id: number
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
  monto_alquiler: string
  observaciones?: string
  created_at: string
  inquilino_info: {
    nombre: string
    apellido: string
    documento_identidad: string
    telefono: string
    email: string
  }
  vivienda_info: {
    numero_casa: string
    bloque: string
    tipo_vivienda: string
  }
}

export interface MenuPropietario {
  propietario: {
    email: string
    nombre_completo: string
  }
  vivienda: {
    numero_casa: string
    bloque: string
    tipo_vivienda: string
  }
  resumen: {
    familiares_registrados: number
    inquilinos_activos: number
  }
  opciones_disponibles: Array<{
    tipo: string
    titulo: string
    descripcion: string
    endpoint: string
    metodo: string
  }>
}

interface UsePropietariosPanelReturn {
  // Estado
  loading: boolean
  error: string | null
  
  // Datos
  menuPropietario: MenuPropietario | null
  familiares: Familiar[]
  inquilinos: Inquilino[]
  
  // Funciones
  cargarMenuPropietario: () => Promise<void>
  cargarFamiliares: () => Promise<void>
  cargarInquilinos: () => Promise<void>
  registrarFamiliar: (familiar: any) => Promise<boolean>
  registrarInquilino: (inquilino: any) => Promise<{ success: boolean; data?: any; error?: string }>
  desactivarFamiliar: (id: number) => Promise<boolean>
  desactivarInquilino: (id: number) => Promise<boolean>
  refetch: () => Promise<void>
}

export function usePropietariosPanel(): UsePropietariosPanelReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [menuPropietario, setMenuPropietario] = useState<MenuPropietario | null>(null)
  const [familiares, setFamiliares] = useState<Familiar[]>([])
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([])

  // Cargar menú principal del propietario
  const cargarMenuPropietario = useCallback(async () => {
    try {
      console.log('🏠 usePropietariosPanel: Cargando menú propietario...')
      setError(null)
      
      const response = await apiClient.get('/authz/propietarios/panel/menu/')
      
      if (response.success && response.data) {
        console.log('✅ usePropietariosPanel: Menú cargado exitosamente:', response.data)
        setMenuPropietario(response.data as MenuPropietario)
      } else {
        console.error('❌ usePropietariosPanel: Error en respuesta menú:', response.message)
        setError(response.message || 'Error al cargar menú del propietario')
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error cargando menú:', err)
      setError(err.message || 'Error de conexión al cargar menú')
    }
  }, [])

  // Cargar familiares del propietario
  const cargarFamiliares = useCallback(async () => {
    try {
      console.log('👨‍👩‍👧‍👦 usePropietariosPanel: Cargando familiares...')
      setError(null)
      
      const response = await apiClient.get('/authz/propietarios/panel/familiares/')
      
      if (response.success && response.data) {
        console.log('✅ usePropietariosPanel: Familiares cargados:', response.data)
        
        const data = response.data as any
        const familiaresData = data.familiares || data || []
        setFamiliares(familiaresData)
      } else {
        console.error('❌ usePropietariosPanel: Error en respuesta familiares:', response.message)
        setError(response.message || 'Error al cargar familiares')
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error cargando familiares:', err)
      setError(err.message || 'Error de conexión al cargar familiares')
    }
  }, [])

  // Cargar inquilinos del propietario
  const cargarInquilinos = useCallback(async () => {
    try {
      console.log('🏘️ usePropietariosPanel: Cargando inquilinos...')
      setError(null)
      
      const response = await apiClient.get('/authz/propietarios/panel/inquilinos/')
      
      if (response.success && response.data) {
        console.log('✅ usePropietariosPanel: Inquilinos cargados:', response.data)
        
        const data = response.data as any
        const inquilinosData = data.inquilinos || data || []
        setInquilinos(inquilinosData)
      } else {
        console.error('❌ usePropietariosPanel: Error en respuesta inquilinos:', response.message)
        setError(response.message || 'Error al cargar inquilinos')
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error cargando inquilinos:', err)
      setError(err.message || 'Error de conexión al cargar inquilinos')
    }
  }, [])

  // Registrar nuevo familiar
  const registrarFamiliar = useCallback(async (familiarData: any): Promise<boolean> => {
    try {
      console.log('➕ usePropietariosPanel: Registrando familiar...', familiarData)
      setError(null)
      
      const response = await apiClient.post('/authz/propietarios/panel/familiares/', familiarData)
      
      if (response.success) {
        console.log('✅ usePropietariosPanel: Familiar registrado exitosamente')
        await cargarFamiliares() // Recargar lista
        return true
      } else {
        console.error('❌ usePropietariosPanel: Error registrando familiar:', response.message)
        setError(response.message || 'Error al registrar familiar')
        return false
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error registrando familiar:', err)
      setError(err.message || 'Error de conexión al registrar familiar')
      return false
    }
  }, [cargarFamiliares])

  // Registrar nuevo inquilino
  const registrarInquilino = useCallback(async (inquilinoData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log('➕ usePropietariosPanel: Registrando inquilino...', inquilinoData)
      setError(null)
      
      const response = await apiClient.post('/authz/propietarios/panel/inquilinos/', inquilinoData)
      
      if (response.success) {
        console.log('✅ usePropietariosPanel: Inquilino registrado exitosamente:', response.data)
        await cargarInquilinos() // Recargar lista
        return { 
          success: true, 
          data: response.data 
        }
      } else {
        console.error('❌ usePropietariosPanel: Error registrando inquilino:', response.message)
        const errorMsg = response.message || 'Error al registrar inquilino'
        setError(errorMsg)
        return { 
          success: false, 
          error: errorMsg 
        }
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error registrando inquilino:', err)
      const errorMsg = err.message || 'Error de conexión al registrar inquilino'
      setError(errorMsg)
      return { 
        success: false, 
        error: errorMsg 
      }
    }
  }, [cargarInquilinos])

  // Desactivar familiar
  const desactivarFamiliar = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log(`🗑️ usePropietariosPanel: Desactivando familiar ${id}...`)
      setError(null)
      
      const response = await apiClient.delete(`/authz/propietarios/panel/familiares/${id}/`)
      
      if (response.success) {
        console.log('✅ usePropietariosPanel: Familiar desactivado exitosamente')
        await cargarFamiliares() // Recargar lista
        return true
      } else {
        console.error('❌ usePropietariosPanel: Error desactivando familiar:', response.message)
        setError(response.message || 'Error al desactivar familiar')
        return false
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error desactivando familiar:', err)
      setError(err.message || 'Error de conexión al desactivar familiar')
      return false
    }
  }, [cargarFamiliares])

  // Desactivar inquilino
  const desactivarInquilino = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log(`🗑️ usePropietariosPanel: Desactivando inquilino ${id}...`)
      setError(null)
      
      const response = await apiClient.delete(`/authz/propietarios/panel/inquilinos/${id}/`)
      
      if (response.success) {
        console.log('✅ usePropietariosPanel: Inquilino desactivado exitosamente')
        await cargarInquilinos() // Recargar lista
        return true
      } else {
        console.error('❌ usePropietariosPanel: Error desactivando inquilino:', response.message)
        setError(response.message || 'Error al desactivar inquilino')
        return false
      }
    } catch (err: any) {
      console.error('❌ usePropietariosPanel: Error desactivando inquilino:', err)
      setError(err.message || 'Error de conexión al desactivar inquilino')
      return false
    }
  }, [cargarInquilinos])

  // Refrescar todos los datos
  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        cargarMenuPropietario(),
        cargarFamiliares(),
        cargarInquilinos()
      ])
    } finally {
      setLoading(false)
    }
  }, [cargarMenuPropietario, cargarFamiliares, cargarInquilinos])

  // Cargar datos iniciales
  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    loading,
    error,
    menuPropietario,
    familiares,
    inquilinos,
    cargarMenuPropietario,
    cargarFamiliares,
    cargarInquilinos,
    registrarFamiliar,
    registrarInquilino,
    desactivarFamiliar,
    desactivarInquilino,
    refetch
  }
}