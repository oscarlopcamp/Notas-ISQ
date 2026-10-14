// Tutoriales guiados de programación (Módulo 5 y siguientes).
// Cada tutorial tendrá: objetivo, explicación conceptual, circuito visual,
// código completo, explicación línea por línea, resultado esperado,
// interpretación, errores frecuentes y referencias.
// Ninguno está publicado todavía: se desarrollarán en la Etapa 5 verificando
// el código contra la versión vigente de Qiskit.

export const tutorials = [
  { id: 'primer-circuito', title: 'Primer circuito', lesson: 'primer-circuito' },
  { id: 'aplicar-x', title: 'Aplicar la compuerta X', lesson: 'compuertas-qiskit' },
  { id: 'crear-superposicion', title: 'Crear superposición', lesson: 'compuertas-qiskit' },
  { id: 'medicion', title: 'Medición', lesson: 'medicion-simulacion-qiskit' },
  { id: 'shots', title: 'Shots y distribuciones', lesson: 'medicion-simulacion-qiskit' },
  { id: 'estado-bell', title: 'Estado de Bell', lesson: 'multiqubit-qiskit' },
  { id: 'interferencia', title: 'Interferencia', lesson: 'compuertas-qiskit' },
  { id: 'varios-qubits', title: 'Circuito de varios qubits', lesson: 'multiqubit-qiskit' },
  { id: 'ideal-vs-ruidosa', title: 'Simulación ideal frente a ruidosa', lesson: 'ruido-qiskit' },
  { id: 'circuito-parametrizado', title: 'Circuito parametrizado', lesson: 'circuitos-variacionales' },
  { id: 'primer-hibrido', title: 'Primer programa híbrido', lesson: 'programas-hibridos' },
].map((t) => ({ ...t, status: 'pendiente' }));
