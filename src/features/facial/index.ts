// Exportaciones del módulo de reconocimiento facial

export { faceRecognitionService } from './services';
export { useFaceRecognition } from './hooks';
export { registroFacialService } from './registro-service';

export type { 
  EnrollmentResponse, 
  VerificationResponse, 
  FaceStatusResponse 
} from './services';

export type { RegistroFacialData } from './registro-service';