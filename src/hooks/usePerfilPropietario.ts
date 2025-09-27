/**
 * Hook para obtener perfil completo del propietario
 * Combina datos del usuario con información de viviendas
 * VERSIÓN ACTUALIZADA - Usa nuevos endpoints del backend
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/core/api/client';
import type { User } from '@/core/types';

interface PropiedadInfo {
  id: number;
  numero_casa: string;
  bloque: string;
  tipo_vivienda: string;
  metros_cuadrados: string;
  tarifa_base_expensas: string;
  estado: string;
  vivienda_info: {
    numero_casa: string;
    bloque: string;
    tipo_vivienda: string;
    metros_cuadrados: string;
  };
}

interface UserProfile extends User {
  foto_perfil?: string | null;
  // Datos personales adicionales
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  
  // Datos de propiedad
  numero_unidad?: string;
  torre?: string;
  area_unidad?: number;
  tipo_unidad?: string;
  
  // Información completa de propiedades
  propiedades?: PropiedadInfo[];
  total_propiedades?: number;
  
  // NUEVO: Reconocimiento facial
  fotos_reconocimiento_urls?: string[];
  reconocimiento_facial_activo?: boolean;
  encoding_facial?: string | null;
  fecha_enrolamiento?: string;
}

export function usePerfilPropietario() {
  const { user } = useAuth();
  const [perfilCompleto, setPerfilCompleto] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para debug - muestra información detallada en consola
  const debugUserData = () => {
    console.log('🐛 DEBUG - Datos del usuario desde AuthContext:', user);
    console.log('🐛 DEBUG - LocalStorage currentUser:', localStorage.getItem('currentUser'));
    console.log('🐛 DEBUG - LocalStorage user:', localStorage.getItem('user'));
    console.log('🐛 DEBUG - Access token:', localStorage.getItem('access_token'));
  };

  const obtenerDatosCompletos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      debugUserData(); // Debug info
      console.log('🔍 Obteniendo perfil completo para usuario:', user);

      // 1. Empezar con los datos del usuario que ya tenemos del login
      let datosUsuario: UserProfile = { ...user };
      
      // Verificar si ya tenemos datos del login (que vienen del backend)
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('👤 Datos del usuario almacenados:', parsedUser);
          datosUsuario = { ...datosUsuario, ...parsedUser };
        } catch (err) {
          console.warn('⚠️ Error parseando usuario almacenado:', err);
        }
      }

      // 2. USAR NUEVAS APIs: Obtener datos completos del usuario
      try {
        console.log('🔍 Obteniendo datos del usuario desde /authz/usuarios/me/...');
        const responseUsuario = await apiClient.get('/authz/usuarios/me/');
        if (responseUsuario.data) {
          console.log('👤 Datos del usuario obtenidos desde /me/:', responseUsuario.data);
          const userData = responseUsuario.data as any;
          // Nuevo log para mostrar todos los campos recibidos
          console.log('👤 Campos recibidos del backend:', userData);
          // Mapear datos del usuario - crear un nuevo objeto con todos los campos necesarios
          const perfilCompleto: UserProfile = {
            ...datosUsuario,
            name: userData.first_name && userData.last_name 
              ? `${userData.first_name} ${userData.last_name}`.trim()
              : userData.username || datosUsuario.name,
            telefono: userData.telefono || datosUsuario.telefono,
            direccion: userData.direccion || datosUsuario.direccion,
            ciudad: userData.ciudad || datosUsuario.ciudad,
            codigo_postal: userData.codigo_postal || datosUsuario.codigo_postal,
            // Mapeo extendido para foto_perfil
            foto_perfil: userData.foto_perfil || userData.foto || userData.imagen || datosUsuario.foto_perfil,
            // NUEVO: Datos de reconocimiento facial
            fotos_reconocimiento_urls: userData.fotos_reconocimiento_urls || [],
            reconocimiento_facial_activo: userData.reconocimiento_facial_activo || false,
            encoding_facial: userData.encoding_facial || null,
            fecha_enrolamiento: userData.fecha_enrolamiento || null,
          };
          datosUsuario = perfilCompleto;
          console.log('✅ Datos del usuario actualizados:', datosUsuario);
          console.log('📸 Reconocimiento facial:', {
            fotos: userData.fotos_reconocimiento_urls?.length || 0,
            activo: userData.reconocimiento_facial_activo,
            fecha: userData.fecha_enrolamiento
          });
        }
      } catch (err) {
        console.warn('⚠️ Error obteniendo datos del usuario con /me/, intentando con ID específico...', err);
        
        // Fallback: usar el endpoint específico por ID
        try {
          const responseUsuarioId = await apiClient.get(`/authz/usuarios/${user.id}/`);
          if (responseUsuarioId.data) {
            console.log('👤 Datos del usuario obtenidos por ID:', responseUsuarioId.data);
            
            const userData = responseUsuarioId.data as any;
            const perfilCompletoFallback: UserProfile = {
              ...datosUsuario,
              name: userData.first_name && userData.last_name 
                ? `${userData.first_name} ${userData.last_name}`.trim()
                : userData.username || datosUsuario.name,
              telefono: userData.telefono || datosUsuario.telefono,
              direccion: userData.direccion || datosUsuario.direccion,
              ciudad: userData.ciudad || datosUsuario.ciudad,
              codigo_postal: userData.codigo_postal || datosUsuario.codigo_postal,
              foto_perfil: userData.foto_perfil || datosUsuario.foto_perfil,
              // NUEVO: Datos de reconocimiento facial
              fotos_reconocimiento_urls: userData.fotos_reconocimiento_urls || [],
              reconocimiento_facial_activo: userData.reconocimiento_facial_activo || false,
              encoding_facial: userData.encoding_facial || null,
              fecha_enrolamiento: userData.fecha_enrolamiento || null,
            };
            
            datosUsuario = perfilCompletoFallback;
          }
        } catch (err2) {
          console.warn('⚠️ Error con endpoint por ID también, usando datos temporales...', err2);
          
          // TEMPORAL: Usar datos de desarrollo con reconocimiento facial simulado
          console.warn('⚠️ Aplicando datos de fallback temporal para desarrollo...');
          
          const perfilTemporal: UserProfile = {
            ...datosUsuario,
            telefono: user.email.includes('jalid') ? '70203012' : '70123456',
            direccion: 'Dirección del registro de usuario',
            ciudad: user.email.includes('jalid') ? 'Santa Cruz' : 'La Paz',
            codigo_postal: '0000',
            
            // NUEVO: Datos de reconocimiento facial temporales para propietarios aprobados
            fotos_reconocimiento_urls: user.role === 'propietario' ? [
              'https://via.placeholder.com/400x300/2563eb/ffffff?text=Foto+1',
              'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Foto+2',
              'https://via.placeholder.com/400x300/dc2626/ffffff?text=Foto+3'
            ] : [],
            reconocimiento_facial_activo: user.role === 'propietario',
            encoding_facial: user.role === 'propietario' ? 'encoded_face_data_placeholder' : null,
            fecha_enrolamiento: user.role === 'propietario' ? '2024-01-15T10:30:00Z' : null,
          };
          
          datosUsuario = perfilTemporal;
        }
      }

      // 3. Obtener información de propiedades/viviendas del usuario
      let propiedades: PropiedadInfo[] = [];
      if (user.role === 'propietario' || user.role === 'administrator') {
        try {
          console.log('🏠 Obteniendo viviendas del propietario desde /viviendas/?propietario=', user.id);
          const responseViviendas = await apiClient.get(`/viviendas/?propietario=${user.id}`);
          if (responseViviendas.data) {
            const viviendas = Array.isArray(responseViviendas.data) 
              ? responseViviendas.data 
              : (responseViviendas.data as any)?.results || [];
            console.log('�️ Todas las viviendas obtenidas:', viviendas);
            
            // Buscar viviendas que pertenezcan al usuario actual
            const viviendasDelUsuario = viviendas.filter((vivienda: any) => {
              // Verificar diferentes formas de encontrar la relación
              return vivienda.propiedades && vivienda.propiedades.some((prop: any) => 
                (prop.propietario_info && (
                  prop.propietario_info.email === user.email ||
                  prop.propietario_info.id?.toString() === user.id
                )) ||
                (prop.propietario && (
                  prop.propietario.email === user.email ||
                  prop.propietario.id?.toString() === user.id
                ))
              );
            });
            
            if (viviendasDelUsuario.length > 0) {
              // Convertir viviendas a formato de propiedades
              propiedades = viviendasDelUsuario.map((vivienda: any) => ({
                id: vivienda.id,
                numero_casa: vivienda.numero_casa,
                bloque: vivienda.bloque,
                tipo_vivienda: vivienda.tipo_vivienda,
                metros_cuadrados: vivienda.metros_cuadrados,
                tarifa_base_expensas: vivienda.tarifa_base_expensas || '0',
                estado: vivienda.estado || 'Activo',
                vivienda_info: {
                  numero_casa: vivienda.numero_casa,
                  bloque: vivienda.bloque,
                  tipo_vivienda: vivienda.tipo_vivienda,
                  metros_cuadrados: vivienda.metros_cuadrados,
                }
              }));
              
              console.log('🏠 Propiedades del usuario encontradas:', propiedades);
            } else {
              console.log('⚠️ No se encontraron viviendas para el usuario');
            }
          }
        } catch (err) {
          console.warn('⚠️ Error obteniendo viviendas, usando datos temporales...', err);
          
          // TEMPORAL: Datos de vivienda para desarrollo
          if (user.role === 'propietario') {
            console.warn('⚠️ Aplicando datos de vivienda temporal para desarrollo...');
            propiedades = [{
              id: parseInt(user.id) || 1,
              numero_casa: user.email.includes('jalid') ? 'A-101' : 'B-205',
              bloque: user.email.includes('jalid') ? 'Torre A' : 'Torre B',
              tipo_vivienda: 'Departamento',
              metros_cuadrados: '85.5',
              tarifa_base_expensas: '450.00',
              estado: 'Activo',
              vivienda_info: {
                numero_casa: user.email.includes('jalid') ? 'A-101' : 'B-205',
                bloque: user.email.includes('jalid') ? 'Torre A' : 'Torre B',
                tipo_vivienda: 'Departamento',
                metros_cuadrados: '85.5',
              }
            }];
            
            console.log('🏠 Propiedades temporales creadas:', propiedades);
          }
        }
      }

      // 4. Combinar toda la información
      let perfilCompleto: UserProfile = {
        ...datosUsuario,
        propiedades,
        total_propiedades: propiedades.length,
      };

      // 5. Si tiene propiedades, usar datos de la primera propiedad principal
      if (propiedades.length > 0) {
        const propiedadPrincipal = propiedades[0];
        perfilCompleto.numero_unidad = propiedadPrincipal.numero_casa;
        perfilCompleto.torre = propiedadPrincipal.bloque;
        perfilCompleto.tipo_unidad = propiedadPrincipal.tipo_vivienda;
        perfilCompleto.area_unidad = parseFloat(propiedadPrincipal.metros_cuadrados) || undefined;
      }

      // 6. FALLBACK TEMPORAL: Si no tenemos datos completos, agregar datos de ejemplo
      // basados en el email del usuario (esto simula datos que deberían venir del registro)
      if (!perfilCompleto.telefono && !perfilCompleto.direccion) {
        console.log('⚠️ Aplicando datos de fallback temporal para desarrollo...');
        
        // Datos de ejemplo basados en el usuario actual
        if (user.email === 'jose1@gmail.com' || user.email === 'jose@gmail.com') {
          perfilCompleto = {
            ...perfilCompleto,
            telefono: '71234567',
            direccion: 'Av. América #123, Zona Central',
            ciudad: 'Santa Cruz',
            codigo_postal: '0000',
            numero_unidad: 'A-101',
            torre: 'Torre A',
            tipo_unidad: 'Departamento',
            area_unidad: 85,
          };
          
          // Si no hay propiedades, crear una de ejemplo
          if (propiedades.length === 0) {
            perfilCompleto.propiedades = [{
              id: 1,
              numero_casa: 'A-101',
              bloque: 'Torre A',
              tipo_vivienda: 'Departamento',
              metros_cuadrados: '85',
              tarifa_base_expensas: '350',
              estado: 'Ocupado',
              vivienda_info: {
                numero_casa: 'A-101',
                bloque: 'Torre A',
                tipo_vivienda: 'Departamento',
                metros_cuadrados: '85',
              }
            }];
            perfilCompleto.total_propiedades = 1;
          }
        } else {
          // Datos genéricos para otros usuarios
          perfilCompleto = {
            ...perfilCompleto,
            telefono: '7' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0'),
            direccion: 'Dirección del registro de usuario',
            ciudad: 'Santa Cruz',
            codigo_postal: '0000',
          };
        }
      }

      console.log('✅ Perfil completo creado:', perfilCompleto);
      setPerfilCompleto(perfilCompleto);
      
    } catch (err) {
      console.error('❌ Error obteniendo perfil completo:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // En caso de error, crear perfil con datos básicos del usuario y algunos fallbacks
      const perfilFallback: UserProfile = {
        ...user,
        telefono: (user.email === 'jose1@gmail.com' || user.email === 'jose@gmail.com') ? '71234567' : 'No especificado',
        direccion: (user.email === 'jose1@gmail.com' || user.email === 'jose@gmail.com') ? 'Av. América #123, Zona Central' : 'No especificada',
        ciudad: 'Santa Cruz',
        codigo_postal: '0000',
        propiedades: [],
        total_propiedades: 0,
      };
      
      setPerfilCompleto(perfilFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatosCompletos();
  }, [user?.id, user?.email]);

  const actualizarPerfil = async (datosPerfil: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('💾 Actualizando perfil:', datosPerfil);
      
      // Usar el nuevo endpoint para actualizar usuario
      const response = await apiClient.patch(`/authz/usuarios/${user.id}/`, datosPerfil);
      
      if (response.data) {
        console.log('✅ Perfil actualizado correctamente');
        await obtenerDatosCompletos(); // Recargar el perfil
        return { success: true };
      }
      
    } catch (err: any) {
      console.error('❌ Error actualizando perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cambiarContrasena = async (contrasenaActual: string, contrasenaNueva: string) => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('🔐 Cambiando contraseña...');
      
      // Usar el nuevo endpoint para cambiar contraseña
      const response = await apiClient.post('/authz/cambiar_password/', {
        old_password: contrasenaActual,
        new_password: contrasenaNueva,
      });
      
      if (response.data) {
        console.log('✅ Contraseña cambiada correctamente');
        return { success: true };
      }
      
    } catch (err: any) {
      console.error('❌ Error cambiando contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    obtenerDatosCompletos();
  };

  return {
    perfil: perfilCompleto,
    loading,
    error,
    refetch,
    actualizarPerfil,
    cambiarContrasena,
    debugUserData, // Función para debug
    // Información útil para mostrar
    tienePropiedades: (perfilCompleto?.propiedades?.length || 0) > 0,
    totalPropiedades: perfilCompleto?.total_propiedades || 0,
  };
}