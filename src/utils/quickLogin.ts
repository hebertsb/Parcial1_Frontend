/**
 * Utilidad de login rápido para testing con el backend
 * Basado en las credenciales confirmadas del backend: admin@facial.com / admin123
 */

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const quickLogin = async (): Promise<LoginResponse> => {
  try {
    console.log('🔐 Intentando login con credenciales del backend...');
    
    const response = await fetch('http://127.0.0.1:8000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@facial.com',
        password: 'admin123'
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed: HTTP ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    
    // Guardar tokens en localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    console.log('✅ Login exitoso:', data.user);
    console.log('🔑 Tokens guardados en localStorage');
    
    return data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

export const checkLoginStatus = (): boolean => {
  const token = localStorage.getItem('access_token');
  const hasToken = !!token;
  console.log('🔍 Estado de login:', hasToken ? 'Autenticado' : 'No autenticado');
  return hasToken;
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  console.log('🚪 Logout completado');
};