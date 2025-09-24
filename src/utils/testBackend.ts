import { apiClient } from '../core/api/client';
import { authService, userService, transaccionesService, reportesService } from '../lib/services';

// Test de conexión con el backend Django
export async function testBackendConnection() {
  console.log('🔗 Iniciando pruebas de conexión con Django Backend...\n');

  // Test 1: Verificar conectividad básica
  console.log('1. 🌐 Verificando conectividad básica...');
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
    if (response.ok) {
      console.log('✅ Backend Django accesible');
    } else {
      console.log('❌ Backend Django no responde correctamente');
      console.log('Status:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error de conectividad:', error);
    console.log('💡 Asegúrate de que Django esté ejecutándose en http://localhost:8000');
  }

  // Test 2: Autenticación
  console.log('\n2. 🔐 Probando autenticación...');
  try {
    const loginResponse = await authService.login({
      email: 'admin@condomanager.com',
      password: 'password123'
    });
    
    if (loginResponse.success) {
      console.log('✅ Login exitoso');
      console.log('Token:', loginResponse.data?.token?.substring(0, 20) + '...');
      console.log('Usuario:', loginResponse.data?.user?.email);
    } else {
      console.log('❌ Error en login:', loginResponse.message);
    }
  } catch (error) {
    console.log('❌ Error en autenticación:', error);
  }

  // Test 3: Obtener usuarios
  console.log('\n3. 👥 Probando obtención de usuarios...');
  try {
    const usersResponse = await userService.getUsers({ page: 1, page_size: 5 });
    
    if (usersResponse.success && usersResponse.data) {
      console.log('✅ Usuarios obtenidos correctamente');
      console.log('Total usuarios:', usersResponse.data.count);
      console.log('Usuarios en página:', usersResponse.data.results.length);
    } else {
      console.log('❌ Error obteniendo usuarios:', usersResponse.message);
    }
  } catch (error) {
    console.log('❌ Error en obtención de usuarios:', error);
  }

  // Test 4: Estadísticas financieras
  console.log('\n4. 💰 Probando estadísticas financieras...');
  try {
    const statsResponse = await reportesService.getEstadisticasFinancieras();
    
    if (statsResponse.success && statsResponse.data) {
      console.log('✅ Estadísticas obtenidas correctamente');
      console.log('Ingresos del mes:', statsResponse.data.ingresos_mes);
      console.log('Gastos del mes:', statsResponse.data.gastos_mes);
      console.log('Balance:', statsResponse.data.balance);
    } else {
      console.log('❌ Error obteniendo estadísticas:', statsResponse.message);
    }
  } catch (error) {
    console.log('❌ Error en estadísticas financieras:', error);
  }

  // Test 5: Health check personalizado
  console.log('\n5. 🏥 Health check completo...');
  try {
    const healthResponse = await apiClient.get('/health/');
    
    if (healthResponse.success) {
      console.log('✅ Sistema saludable');
      console.log('Estado:', healthResponse.data);
    } else {
      console.log('⚠️ Sistema con problemas:', healthResponse.message);
    }
  } catch (error) {
    console.log('❌ Error en health check:', error);
  }

  console.log('\n🎯 Pruebas completadas!');
  console.log('\n📋 Checklist para Django Backend:');
  console.log('   □ Django corriendo en puerto 8000');
  console.log('   □ CORS configurado para localhost:3000');
  console.log('   □ Endpoints de API implementados');
  console.log('   □ Autenticación JWT configurada');
  console.log('   □ Modelos y migraciones aplicadas');
  console.log('   □ Usuario admin creado');
}

// Función para testear desde el navegador
export function runBackendTests() {
  testBackendConnection().catch(console.error);
}

// Función para verificar configuración
export function checkConfiguration() {
  console.log('⚙️ Configuración actual:');
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
  console.log('WebSocket URL:', process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws');
  console.log('Entorno:', process.env.NODE_ENV);
  
  // Verificar variables de entorno requeridas
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('⚠️ Variables de entorno faltantes:', missingVars);
    console.log('💡 Crea un archivo .env.local con estas variables');
  } else {
    console.log('✅ Configuración completa');
  }
}

// Función para datos de prueba
export const testData = {
  // Usuario de prueba
  testUser: {
    email: 'admin@condomanager.com',
    password: 'password123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'administrator'
  },
  
  // Transacción de prueba
  testTransaction: {
    concepto: 'Cuota de Mantenimiento - Test',
    tipo: 'ingreso',
    monto: 150.00,
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Mantenimiento',
    metodo_pago: 'transferencia'
  },
  
  // Unidad de prueba
  testUnit: {
    numero: 'TEST-101',
    tipo: 'apartamento',
    area: 85.5,
    habitaciones: 2,
    banos: 2,
    valor_alquiler: 1200.00,
    fecha_compra: '2024-01-15'
  }
};

// Export para uso en componentes
export default {
  testBackendConnection,
  runBackendTests,
  checkConfiguration,
  testData
};
