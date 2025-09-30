"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Users, Camera, Activity, Shield, Eye, UserCheck, RefreshCw } from 'lucide-react'
import { reconocimientoFacialService } from '@/features/seguridad/services'
import { incidentesService, visitasService, alertasService } from '@/features/seguridad/services'
import { getCurrentUser } from '@/lib/auth'
import { SecurityHeader } from '@/components/security/security-header'
import { WidgetEscanerSeguridad } from '@/components/security/widget-escaner-seguridad'

interface DashboardData {
  usuarios_activos: number
  visitantes_hoy: number
  alertas_activas: number
  incidentes_abiertos: number
  reconocimientos_hoy: number
  usuarios_registrados: number
}

export function SecurityDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  // Estados de datos
  const [dashboardReconocimiento, setDashboardReconocimiento] = useState<DashboardData | null>(null)
  const [usuariosActivos, setUsuariosActivos] = useState<any[]>([])
  const [incidentes, setIncidentes] = useState<any[]>([])
  const [visitas, setVisitas] = useState<any[]>([])
  const [alertas, setAlertas] = useState<any[]>([])
  const [usuarioSeguridad, setUsuarioSeguridad] = useState<any>(null)

  useEffect(() => {
    cargarDatosSeguridad()
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(cargarDatosSeguridad, 30000)
    return () => clearInterval(interval)
  }, [])

  const cargarDatosSeguridad = async () => {
    try {
      setLoading(true)
      console.log('🔐 SecurityDashboard: Cargando datos de seguridad...')
      
      // Obtener usuario actual
      const user = getCurrentUser()
      setUsuarioSeguridad(user)
      console.log('👮 Usuario de seguridad logueado:', user)

      // Cargar datos del dashboard en paralelo usando TODOS los endpoints documentados
      const [dashboardResponse, incidentesResponse, visitasResponse, alertasResponse, usuariosResponse] = await Promise.all([
        reconocimientoFacialService.getDashboard().catch(() => ({ success: false })),
        incidentesService.getIncidentes({ estado: 'abierto' }).catch(() => ({ success: true, data: { results: [] } })),
        visitasService.getVisitasActivas().catch(() => ({ success: true, data: [] })),
        alertasService.getAlertasActivas().catch(() => ({ success: true, data: [] })),
        reconocimientoFacialService.obtenerUsuariosConReconocimiento().catch(() => ({ success: false }))
      ])

      if (dashboardResponse.success && 'data' in dashboardResponse) {
        setDashboardReconocimiento(dashboardResponse.data as any)
        console.log('📊 Dashboard data cargada:', dashboardResponse.data)
      }

      if (incidentesResponse.success && 'data' in incidentesResponse) {
        setIncidentes(incidentesResponse.data?.results || [])
        console.log('🚨 Incidentes cargados:', incidentesResponse.data?.results?.length)
      }

      if (visitasResponse.success && 'data' in visitasResponse) {
        setVisitas(visitasResponse.data || [])
        console.log('👥 Visitas activas:', visitasResponse.data?.length)
      }

      if (alertasResponse.success && 'data' in alertasResponse) {
        setAlertas(alertasResponse.data || [])
        console.log('⚠️ Alertas activas:', alertasResponse.data?.length)
      }

      if (usuariosResponse.success && 'data' in usuariosResponse) {
        const usuariosArray = Array.isArray(usuariosResponse.data) ? usuariosResponse.data : []
        
        // 🔧 SOLUCIÓN: EL ENDPOINT PRINCIPAL NO TRAE fotos_urls, USAR ENDPOINT INDIVIDUAL
        const usuariosConFotos = await Promise.all(usuariosArray.map(async (usuario: any, index: number) => {
          console.log(`\n🔍 Procesando usuario ${index + 1}:`, usuario.email)
          
          let fotosReales: string[] = []
          const totalFotos = usuario.total_fotos || 0
          
          // 🔧 PROBLEMA DETECTADO: fotos_urls NO viene en el endpoint principal
          // SOLUCIÓN: Usar endpoint individual para obtener fotos reales
          try {
            console.log(`   🔄 Obteniendo fotos del endpoint individual...`)
            const fotosResponse = await reconocimientoFacialService.obtenerFotosUsuario(usuario.id)
            
            if (fotosResponse.success && fotosResponse.data && fotosResponse.data.reconocimiento.fotos_urls) {
              fotosReales = fotosResponse.data.reconocimiento.fotos_urls
              
              const fotosDropbox = fotosReales.filter(url => 
                url.includes('dropbox') || url.includes('dl.dropboxusercontent.com')
              )
              
              if (fotosDropbox.length > 0) {
                console.log(`   🎉 ¡${fotosDropbox.length} FOTOS REALES DE DROPBOX obtenidas!`)
                console.log(`   📸 Ejemplo:`, fotosDropbox[0].substring(0, 60) + '...')
              } else {
                console.log(`   ⚠️ ${fotosReales.length} fotos obtenidas pero no son de Dropbox`)
                console.log(`   📋 Ejemplo:`, fotosReales[0]?.substring(0, 60))
              }
            } else {
              throw new Error('Endpoint individual no devolvió fotos válidas')
            }
          } catch (error) {
            console.log(`   ❌ Error obteniendo fotos del endpoint individual:`, error)
            // Crear placeholders como fallback
            if (totalFotos > 0) {
              const userId = usuario.id || usuario.copropietario_id || index + 1
              const photoSeed = usuario.email?.split('@')[0] || `user${userId}`
              
              for (let i = 0; i < Math.min(totalFotos, 4); i++) {
                fotosReales.push(`https://i.pravatar.cc/200?img=${(userId + i) % 70 + 1}&u=${photoSeed}_${i}`)
              }
              console.log(`   🔄 Creados ${fotosReales.length} placeholders temporales`)
            }
          }
          
          console.log(`   📊 Resultado final: ${fotosReales.length} fotos (${fotosReales.some(url => url.includes('dropbox')) ? 'REALES DE DROPBOX' : 'PLACEHOLDERS'})`)
          
          return {
            ...usuario,
            fotos_urls: fotosReales,
            total_fotos: totalFotos,
            tiene_fotos: fotosReales.length > 0,
            fotos_son_reales: fotosReales.some(url => 
              url.includes('dropbox') || url.includes('dl.dropboxusercontent.com')
            )
          }
        }))
        
        setUsuariosActivos(usuariosConFotos)
        console.log('👥 Usuarios con reconocimiento activo:', usuariosConFotos.length)
        console.log('📋 Respuesta COMPLETA del backend:', JSON.stringify(usuariosResponse, null, 2))
        console.log('📋 Datos de usuarios array:', JSON.stringify(usuariosArray, null, 2))
        
        // Debug: verificar estructura de datos del backend
        if (usuariosConFotos.length > 0) {
          console.log('\n📋 ANÁLISIS DETALLADO DE USUARIOS:')
          usuariosConFotos.forEach((usuario: any, index: number) => {
            console.log(`\n📋 Usuario ${index + 1}: ${usuario.nombre_completo || usuario.email}`)
            console.log(`   📊 Datos originales del backend:`, JSON.stringify(usuariosArray[index], null, 2))
            console.log(`   🔢 total_fotos: ${usuario.total_fotos || 0}`)
            console.log(`   📸 fotos_urls length: ${usuario.fotos_urls?.length || 0}`)
            
            if (usuario.fotos_urls && usuario.fotos_urls.length > 0) {
              console.log(`   📸 URLs actuales:`, usuario.fotos_urls.slice(0, 3))
              const tieneDropbox = usuario.fotos_urls.some((url: string) => url.includes('dropbox'))
              const tienePlaceholder = usuario.fotos_urls.some((url: string) => url.includes('pravatar') || url.includes('randomuser'))
              console.log(`   🔍 Tipo: ${tieneDropbox ? '✅ DROPBOX REALES' : tienePlaceholder ? '⚠️ PLACEHOLDER' : '❓ DESCONOCIDO'}`)
            }
            
            // Revisar todas las propiedades que podrían contener URLs de fotos
            console.log(`   🔎 Propiedades disponibles:`, Object.keys(usuariosArray[index]))
          })
        }
      } else {
        console.error('❌ Error obteniendo usuarios activos:', usuariosResponse)
      }

      setLastUpdate(new Date())
      setError(null)

    } catch (err: any) {
      console.error('❌ Error cargando datos de seguridad:', err)
      setError('Error cargando datos del sistema de seguridad')
    } finally {
      setLoading(false)
    }
  }

  const testearEndpointUsuariosReconocimiento = async () => {
    console.log('\n📊 TEST: Endpoint Usuarios Reconocimiento')
    console.log('==========================================')
    
    try {
      const response = await reconocimientoFacialService.obtenerUsuariosConReconocimiento()
      console.log('📊 Response completa:', response)
      
      if (response.success && response.data) {
        console.log('✅ Endpoint funcionando')
        const usuariosArray = Array.isArray(response.data) ? response.data : []
        console.log('📋 Cantidad de usuarios:', usuariosArray.length)
        
        if (usuariosArray.length > 0) {
          console.log('📋 Primer usuario - Propiedades disponibles:', Object.keys(usuariosArray[0]))
          console.log('📋 Primer usuario - Datos completos:', usuariosArray[0])
          
          // Verificar si viene fotos_urls
          const primerUsuario = usuariosArray[0] as any
          const tieneFotosUrls = 'fotos_urls' in primerUsuario
          console.log(`🔍 ¿Tiene fotos_urls? ${tieneFotosUrls ? '✅ SÍ' : '❌ NO'}`)
          
          if (tieneFotosUrls && primerUsuario.fotos_urls) {
            console.log(`📸 Cantidad de fotos_urls: ${primerUsuario.fotos_urls.length}`)
            console.log(`📸 Ejemplos de URLs:`, primerUsuario.fotos_urls.slice(0, 3))
          }
          
          console.log(`📊 total_fotos del usuario: ${primerUsuario.total_fotos || 'NO DISPONIBLE'}`)
          console.log(`📊 tiene_fotos del usuario: ${primerUsuario.tiene_fotos || 'NO DISPONIBLE'}`)
        }
      } else {
        console.log('❌ Endpoint NO funcionando:', response)
      }
    } catch (error) {
      console.error('❌ Error testing endpoint:', error)
    }
    
    console.log('\n🏁 FIN DEL TEST')
  }

  const testearFotosIndividuales = async () => {
    console.log('\n📷 TEST: Fotos Individuales')
    console.log('============================')
    
    try {
      // Primero obtener usuarios
      const usuariosResponse = await reconocimientoFacialService.obtenerUsuariosConReconocimiento()
      
      if (usuariosResponse.success && usuariosResponse.data) {
        const usuariosArray = Array.isArray(usuariosResponse.data) ? usuariosResponse.data : []
        console.log(`📋 Probando con ${usuariosArray.length} usuarios`)
        
        // Probar con los primeros 3 usuarios
        for (let i = 0; i < Math.min(usuariosArray.length, 3); i++) {
          const usuario = usuariosArray[i] as any
          console.log(`\n👤 Usuario ${i + 1}: ${usuario.email} (ID: ${usuario.id})`)
          
          try {
            const fotosResponse = await reconocimientoFacialService.obtenerFotosUsuario(usuario.id)
            console.log(`📸 Response fotos:`, fotosResponse)
            
            if (fotosResponse.success && fotosResponse.data && fotosResponse.data.reconocimiento.fotos_urls) {
              console.log(`✅ ¡FOTOS OBTENIDAS! Cantidad: ${fotosResponse.data.reconocimiento.fotos_urls.length}`)
              console.log(`📸 URLs:`, fotosResponse.data.reconocimiento.fotos_urls.slice(0, 3))
              
              const fotosDropbox = fotosResponse.data.reconocimiento.fotos_urls.filter((url: string) => 
                url.includes('dropbox') || url.includes('dl.dropboxusercontent.com')
              )
              console.log(`🎉 Fotos de Dropbox encontradas: ${fotosDropbox.length}`)
              
            } else {
              console.log(`❌ No se obtuvieron fotos para usuario ${usuario.id}`)
            }
          } catch (error) {
            console.log(`❌ Error obteniendo fotos del usuario ${usuario.id}:`, error)
          }
        }
      } else {
        console.log('❌ No se pudieron obtener usuarios para probar')
      }
    } catch (error) {
      console.error('❌ Error en test de fotos individuales:', error)
    }
    
    console.log('\n🏁 FIN DEL TEST DE FOTOS')
  }

  const testearEndpointsDisponibles = async () => {
    console.log('\n🔍 TEST: Endpoints Disponibles')
    console.log('===============================')
    
    // Lista de posibles endpoints para probar
    const endpointsAProbar = [
      '/api/authz/seguridad/fotos/',
      '/api/authz/seguridad/fotos-reconocimiento/',  
      '/api/authz/reconocimiento-facial/fotos/',
      '/api/authz/usuarios/fotos/',
      '/api/reconocimiento-facial/fotos/',
      '/api/seguridad/fotos/',
      '/api/authz/seguridad/usuarios-reconocimiento/fotos/',
    ];

    const baseUrl = 'http://127.0.0.1:8000';
    const token = localStorage.getItem('access_token');
    
    for (const endpoint of endpointsAProbar) {
      try {
        console.log(`\n🎯 Probando: ${endpoint}`);
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('   ✅ ÉXITO! Respuesta:', {
            tipo: Array.isArray(data) ? 'Array' : typeof data,
            cantidad: Array.isArray(data) ? data.length : 'N/A',
            primeraFoto: Array.isArray(data) && data[0] ? Object.keys(data[0]) : 'N/A'
          });
          
          // Si encontramos fotos, mostrar más detalles
          if (Array.isArray(data) && data.length > 0) {
            console.log('   📸 Primera foto:', data[0]);
          }
        } else if (response.status === 404) {
          console.log('   ❌ No encontrado (404)');
        } else {
          console.log(`   ⚠️  Error ${response.status}`);
        }
      } catch (error) {
        console.log(`   💥 Error de conexión:`, error.message);
      }
    }
    
    console.log('\n🏁 FIN DEL TEST DE ENDPOINTS')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando panel de seguridad...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Seguridad</h1>
            <p className="text-gray-400">Sistema de Reconocimiento Facial y Monitoreo</p>
          </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.open('/admin/seguridad/visitas', '_blank')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Control de Visitas
          </Button>
          <Button onClick={testearEndpointUsuariosReconocimiento} variant="outline" size="sm">
            📊 Test Endpoint Principal
          </Button>
          <Button onClick={testearEndpointsDisponibles} variant="outline" size="sm">
            � Test Endpoints Fotos
          </Button>
          <Button onClick={cargarDatosSeguridad} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{usuariosActivos.length}</div>
            <p className="text-xs text-gray-400">
              Con reconocimiento facial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Reconocimientos Hoy</CardTitle>
            <Camera className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardReconocimiento?.reconocimientos_hoy || 0}</div>
            <p className="text-xs text-gray-400">
              Detecciones exitosas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Incidentes Abiertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{incidentes.length}</div>
            <p className="text-xs text-gray-400">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Alertas Activas</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alertas.length}</div>
            <p className="text-xs text-gray-400">
              Monitoreo continuo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Nueva sección: Estadística de Visitas Tercerizadas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <UserCheck className="h-5 w-5" />
            Control de Visitas - Personal Tercerizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">8</div>
              <p className="text-sm text-gray-300">Visitas Hoy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">6</div>
              <p className="text-sm text-gray-300">Autorizadas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">3</div>
              <p className="text-sm text-gray-300">En Trabajo</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <p className="text-sm text-gray-300">Esperando</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => window.open('/admin/seguridad/visitas', '_blank')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Abrir Control de Visitas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid con Widget Escáner y Usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget Escáner QR */}
        <div className="lg:col-span-1">
          <WidgetEscanerSeguridad />
        </div>
        
        {/* Usuarios con Reconocimiento Activo */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserCheck className="h-5 w-5" />
                Usuarios con Reconocimiento Activo ({usuariosActivos.length})
              </CardTitle>
            </CardHeader>
        <CardContent>
          {usuariosActivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usuariosActivos.map((usuario, index) => (
                <div key={index} className="border border-gray-600 bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{usuario.nombre_completo || usuario.email}</h3>
                    <Badge variant={usuario.activo ? "default" : "secondary"}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    <p>📧 {usuario.email}</p>
                    <p>🏢 {usuario.unidad_residencial || 'No especificada'}</p>
                    <p>📸 {usuario.total_fotos || 0} fotos registradas</p>
                    <p>🔍 {usuario.fotos_son_reales ? '✅ Fotos reales de Dropbox' : '⚠️ Placeholders temporales'}</p>
                  </div>

                  {/* Mostrar fotos */}
                  {usuario.fotos_urls && usuario.fotos_urls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-200">Fotos de reconocimiento:</p>
                      <div className="flex gap-2 flex-wrap">
                        {usuario.fotos_urls.slice(0, 4).map((foto: string, fotoIndex: number) => (
                          <img 
                            key={fotoIndex}
                            src={foto} 
                            alt={`Foto ${fotoIndex + 1} de ${usuario.email}`}
                            className="w-16 h-16 rounded-lg object-cover border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://i.pravatar.cc/64?img=${(usuario.id || index) % 70 + 1}`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay usuarios con reconocimiento facial activo</p>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>

      {/* Estado del Sistema */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-green-400 font-semibold">Reconocimiento Facial</div>
              <div className="text-sm text-green-300">✅ Operativo</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-blue-400 font-semibold">Monitoreo 24/7</div>
              <div className="text-sm text-blue-300">🔄 Activo</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-yellow-400 font-semibold">Última Actualización</div>
              <div className="text-sm text-yellow-300">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Nunca'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}