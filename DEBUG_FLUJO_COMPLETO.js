/**
 * Script de prueba para verificar el flujo completo
 * desde solicitud hasta lista de usuarios de seguridad
 */

// Para probar en la consola del navegador
const testFlujCompleto = async () => {
  console.log('🧪 PRUEBA DEL FLUJO COMPLETO');
  console.log('===============================');
  
  try {
    // 1. Verificar endpoint de usuarios activos para seguridad
    console.log('1️⃣ Probando endpoint de usuarios activos...');
    const response = await fetch('http://127.0.0.1:8000/api/seguridad/lista-usuarios-activos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Usuarios activos encontrados:', data.usuarios?.length || 0);
      console.log('📋 Datos de respuesta:', data);
      
      if (data.usuarios && data.usuarios.length > 0) {
        console.log('👤 Ejemplo de usuario:', data.usuarios[0]);
        console.log('📸 Usuario con foto?', !!data.usuarios[0].foto_perfil);
      }
    } else {
      console.error('❌ Error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('📄 Respuesta del servidor:', errorData);
    }
    
    // 2. Verificar endpoint de propietarios (para comparar)
    console.log('\n2️⃣ Probando endpoint de propietarios...');
    const propietariosResponse = await fetch('http://127.0.0.1:8000/api/authz/propietarios/admin/solicitudes/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (propietariosResponse.ok) {
      const propietariosData = await propietariosResponse.json();
      console.log('✅ Solicitudes encontradas:', propietariosData.results?.length || 0);
      
      const aprobadas = propietariosData.results?.filter(s => s.estado === 'aprobado') || [];
      console.log('🟢 Solicitudes aprobadas:', aprobadas.length);
      
      if (aprobadas.length > 0) {
        console.log('👤 Ejemplo de solicitud aprobada:', aprobadas[0]);
        console.log('📸 Solicitud con fotos?', !!aprobadas[0].fotos_reconocimiento_urls);
      }
    }
    
    // 3. Verificar qué usuarios tienen reconocimiento facial activo
    console.log('\n3️⃣ Analizando conexión entre solicitudes aprobadas y usuarios activos...');
    console.log('💡 FLUJO ESPERADO:');
    console.log('   Solicitud APROBADA → Usuario creado → Reconocimiento facial activo → Aparece en lista de seguridad');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar prueba
testFlujCompleto();