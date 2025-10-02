"use client"

import WebRTCFaceRecognition from '@/components/reconocimiento/WebRTCFaceRecognition';

export default function ReconocimientoFacialPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            � Sistema WebRTC de Reconocimiento Facial
          </h1>
          <p className="text-gray-600 mt-2">
            Streaming continuo con IA en tiempo real - Tecnología WebRTC avanzada
          </p>
        </div>
        
        <WebRTCFaceRecognition />
      </div>
    </div>
  );
}