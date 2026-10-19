# Criterios académicos y de verificación

## Referencias

1. **Solo obras reales y comprobadas.** Antes de añadir una referencia a `references/references.js` se verifican sus metadatos:
   - DOI: debe resolverse en Crossref (`https://api.crossref.org/works/<doi>`), y título, autores, año, revista, volumen y páginas deben coincidir.
   - Libros sin DOI: se comprueba el ISBN (por ejemplo, en Open Library) y la edición.
   - Documentación, estándares y notas: se comprueba que el enlace oficial responde y que la versión es la vigente.
2. Se registra en `verification` el método y la fecha. Las referencias sin verificar no pueden citarse en una lección publicada; las pruebas automáticas lo impiden.
3. **`supports`** describe qué afirmaciones respalda la obra. Una referencia no se cita para algo que no contiene.
4. En cada lección, `references[].use` explica para qué se cita la obra en esa lección concreta. Cuando sea útil, la cita lleva localizador: `[@nielsen2010, recuadro 12.1]`.
5. Nunca se inventan DOI, páginas ni resultados. Si una fuente no se puede verificar, se dice explícitamente.
6. Las versiones de los estándares cambian: Unicode, Qiskit y las recomendaciones del NIST se revisan antes de publicar cada etapa.

## Código

- Todo fragmento de código con salida se **ejecuta** y su salida se copia literalmente. En el archivo de la lección se anotan el intérprete y la fecha.
- El código de Qiskit (Etapa 5) se comprobará con la versión vigente y se indicará qué versión se usó. No se usan APIs obsoletas.
- La plataforma no simula ejecuciones de Python. Los simuladores JavaScript documentan sus capacidades y limitaciones.

## Contenido

Antes de publicar una lección se revisa (sección 12 del encargo original):

1. ¿Por qué necesita aprender esto un ingeniero de software?
2. ¿Qué conocimientos previos requiere?
3. ¿Qué problema motiva el concepto?
4. ¿Se explica primero de forma intuitiva?
5. ¿Tiene ejemplos?
6. ¿Tiene visualizaciones útiles, y no solo decorativas?
7. ¿Las matemáticas aparecen cuando corresponde?
8. ¿Se explican todos los símbolos?
9. ¿Los ejemplos son correctos y están comprobados?
10. ¿Se aclaran las limitaciones y las simplificaciones?
11. ¿Se conecta con otras lecciones (contexto, avances, relacionadas)?
12. ¿Tiene referencias reales y verificadas?
13. ¿Tiene suficiente profundidad?
14. ¿Evita repeticiones innecesarias?
15. ¿Puede usarse como material de estudio autónomo?

### Simplificaciones prohibidas (Regla 5)

No se afirma que un qubit «es 0 y 1 a la vez», que una computadora cuántica «prueba todas las soluciones», que todo algoritmo cuántico es más rápido, que la computación cuántica sustituirá a la clásica, que la probabilidad cuántica se debe solo al ruido, que el entrelazamiento transmite información instantáneamente, que toda correlación implica entrelazamiento, que todos los estados entrelazados tienen amplitudes $1/\sqrt{2}$, que PQC y QKD son equivalentes, ni que la teleportación transporta materia. Las analogías se permiten si indican sus límites.

### Estatus epistémico (Regla 9)

Los recuadros distinguen: conocimiento establecido, modelo simplificado, resultado experimental, propuesta académica, tecnología emergente y problema abierto.

## Registro de verificación de la Etapa 1 (2026-10-14)

- DOI comprobados en Crossref: Shannon 1948 y 1938; von Neumann (reedición de 1993); RFC 3629; Nielsen y Chuang; Mermin; Feynman 1982; Deutsch 1985; Shor 1994 y 1997; Grover 1996; Bennett y Brassard (reedición de 2014); Ekert 1991; FIPS 203, 204 y 205; IEEE 754-2019. El DOI de RFC 20 se resuelve en doi.org y su ficha en rfc-editor.org.
- ISBN comprobados en Open Library: Bryant y O'Hallaron (3.ª ed.), Patterson y Hennessy (RISC-V, 2.ª ed.), Petzold (2.ª ed.), Harris y Harris (2.ª ed.), Rieffel y Polak.
- Unicode: la versión vigente es la 18.0.0 (16 de septiembre de 2026, 172 808 caracteres), según la página oficial.
- Enlaces oficiales comprobados: documentación de Qiskit, IBM Quantum Learning, Qiskit Aer, notas de Preskill (www.preskill.caltech.edu/ph229/), páginas de los FIPS en csrc.nist.gov.
- Código de la lección 1.1 ejecutado con CPython 3.14. Valores numéricos (ASCII, bytes UTF-8, $\log_2 26$, $\log_2 6$, $1\,114\,112$) comprobados con el mismo intérprete y con las pruebas automáticas.

## Registro de verificación de la lección 1.2 (2026-10-14)

- DOI comprobados en Crossref: Goldberg (1991), ACM Computing Surveys 23(1):5–48; Higham (2002), SIAM, 2.ª ed.
- Documentación comprobada (enlace y texto citado): tutorial de Python §15 (valor exacto de 0.1), «Built-in Types» («Integers have unlimited precision»), `math.isclose` (fórmula y tolerancias por defecto), cppreference «Arithmetic operators» (desbordamiento con signo = comportamiento indefinido), API de `AerSimulator` (métodos «statevector», «stabilizer» y «matrix_product_state»; precisión «double» por defecto).
- Se descartó una afirmación sobre `Math.abs(Integer.MIN_VALUE)` en Java porque no se encontró el texto en la documentación consultada.
- Código ejecutado con CPython 3.14: los cinco programas del nivel 3 y la solución del ejercicio 8 (comprobada para las 65 536 parejas).
- Patrones IEEE 754 (3DCCCCCD, C0200000, 3E200000, 3FB999999999999A), valores exactos almacenados, 2^−149, máximo de binary32 y fechas del problema de 2038 comprobados con `struct`, `decimal` y `datetime`, y repetidos en las pruebas automáticas (`tests/numbers.test.js`).

## Registro de verificación de las lecciones 1.3–1.11 (2026-10-14)

- **DOI comprobados en Crossref:** Toffoli (1980), Landauer (1961), Bennett (1973), Backus (1978), Turing (Crossref registra 1937; leído en 1936), Cook (1971), Bernstein y Vazirani (1997), Bennett, Bernstein, Brassard y Vazirani (1997), Nyquist (1928), Shannon (1949), Huffman (1952), Ziv y Lempel (1977), RFC 2781, Arora y Barak (2009), Moore (reedición de 1998), Dennard et al. (1974), Hennessy y Patterson (2019), Karnaugh (1953), Quine (1952) y McCluskey (1956).
- **ISBN comprobados en Open Library:** Sipser (3.ª ed., 2013), Cormen et al. (4.ª ed., 2022), Aho et al. (2.ª ed., 2006), Tanenbaum y Bos (4.ª ed., 2015) y Hennessy y Patterson (5.ª ed., 2012).
- **Documentos oficiales consultados:** UAX #15, UAX #29, UTS #39 (versión 18.0.0, 2026-08-27; se usa en lugar de UTR #36, estabilizado desde 2014), MDN «String: length», PNG 3.ª edición (Recomendación del W3C, 24-06-2025), Project Gutenberg n.º 15114 (Boole), especificaciones ratificadas de RISC-V, documentación de `dis` y «Built-in Types» de Python (límite de 4300 cifras en la conversión de enteros a texto).
- **Tabla Windows-1252 (0x80–0x9F):** generada con el códec cp1252 de CPython, no escrita a mano.
- **Código:** todos los programas de las lecciones se ejecutaron con CPython 3.14.0 y sus salidas se copiaron literalmente. Gracias a ello se detectaron y corrigieron dos errores antes de publicar: la conversión `str()` de 100 000! falla sin `sys.set_int_max_str_digits(0)`, y una derivación de XOR con NAND estaba mal escrita.
- **Cifras recalculadas:** pares sustitutos y bytes UTF-8 (😀, 𝄞), tamaños de imágenes y audio, tasas de aciertos de caché (75 % / 0 %, 87,5 %, matriz 16×16), cruce de $n^{10}$ y $2^n$ ($n = 59$), $2^{54}$ operaciones por año y límite de Landauer ($2{,}871 \times 10^{-21}$ J).
- **Pruebas automáticas:** la MiniCPU en JavaScript produce las mismas codificaciones, salidas y número de instrucciones que la versión en Python. Quine–McCluskey se verifica para las 256 funciones de 3 variables, y la regla de desbordamiento, el sumador completo y la universalidad de NAND, en todas sus combinaciones.
- **Diagrama de clases de complejidad:** la geometría se comprobó numéricamente (P dentro de NP y de BQP; NP-completos fuera de BQP) y el pie distingue lo demostrado de lo conjeturado.

## Registro de verificación de las lecciones 2.1 y 2.2 (2026-10-14)

- **DOI comprobados en Crossref (21):** EPR (1935), Bell (1964), Grangier, Roger y Aspect (1986), Benioff (1980), Wootters y Zurek (1982), Dieks (1982), Wiesner (1983), Deutsch y Jozsa (1992), Bennett et al. (1993), Simon (1997), Shor (1995), Cirac y Zoller (1995), Aharonov y Ben-Or (1997), Chuang et al. (1998), Nakamura et al. (1999), DiVincenzo (2000), Vandersypen et al. (2001), Preskill (2018), Arute et al. (2019), Pan et al. (2022) y Google Quantum AI (2025).
- **Afirmaciones cuantitativas contrastadas con el resumen original:** Arute et al. (53 qubits, unos 200 s frente a unos 10 000 años; nature.com), Pan et al. (unas 15 horas con 512 GPU; arXiv:2111.03011), Google (factor Λ = 2,14 de distancia 5 a 7; arXiv:2408.13687) y Preskill (resumen en Crossref).
- **Cita de Feynman:** comprobada en el texto del artículo de 1982 antes de reproducirla.
- **Código:** los cuatro programas de las lecciones se ejecutaron con CPython 3.14. Las probabilidades del interferómetro (1, 0; 0, 1; 1/4, 1/4), el argumento del problema de Deutsch y el error $2^{1-k}$ del algoritmo aleatorio de Deutsch–Jozsa coinciden con las pruebas automáticas (`tests/module2.test.js`).
- **Matices añadidos para evitar simplificaciones:** la ventaja de Deutsch–Jozsa desaparece frente a algoritmos clásicos aleatorios; la «supremacía» de 2019 se presenta junto con su respuesta clásica de 2022; la cota de Holevo limita a $n$ bits la información extraíble de $n$ qubits.
- **Nueva comprobación automática:** `tests/responsive.html` detecta texto residual («null», «undefined») en la página. Permitió corregir dos simuladores que lo mostraban.

## Ejecución de código en el navegador (2026-10-14)

- Los bloques de Python se ejecutan con Pyodide 0.27.7 (CPython 3.12.7) en un *worker*; no se simula ninguna ejecución.
- `tests/python.html` ejecutó los 36 ejemplos publicados: 35 producen exactamente la salida publicada (obtenida con CPython 3.14) y 1 difiere de forma conocida y documentada (el bytecode de `dis`, lección 1.10, que ahora explica la diferencia).
- La salida esperada de cada bloque se etiqueta con la versión con que se obtuvo (CPython 3.14), y la salida propia del lector, con la versión de Python del navegador.

## Lecciones 2.3 y 2.4 y revisión de la complejidad del código (2026-10-14)

- **DOI comprobados en Crossref:** Dirac (1929), Lloyd (1996), Reiher et al. (2017), Lee et al. (2021), Lee et al. (2023), Peruzzo et al. (2014), Babbush et al. (2021), Hoefler, Häner y Troyer (2023), Aaronson (2015) y Høyer, Neerbek y Shi (2001). Farhi et al. (2014) se consultó en arXiv. Las listas completas de autores también se comprobaron en Crossref.
- **Afirmaciones contrastadas con el resumen original (arXiv):** recursos para FeMoco (≈ 4 millones de qubits físicos, < 4 días, ciclos de 1 µs y errores ≤ 0,1 %), ausencia de pruebas de ventaja exponencial general en química, ventajas cuadráticas insuficientes y cuárticas prometedoras, «pocos datos y ventajas mayores que cuadráticas», y Ω(N log N) para ordenar.
- **Cita de Dirac:** se parafrasea, no se cita textualmente, porque el texto original no se pudo consultar.
- **Política de código:** un bloque breve por lección cuando basta; sin anotaciones de tipo ni operadores de bits cuando no son el objeto de la lección; variables con nombre en lugar de expresiones densas. Se simplificaron 6 bloques (lecciones 1.1, 1.2, 1.3, 1.11 y 2.2) y una solución de ejercicio. Las salidas se volvieron a obtener con CPython 3.14 y `tests/python.html` las comprobó en el navegador (39 coincidencias).

## Lecciones 2.5 y 2.6: el sistema de cómputo (2026-10-14)

- **DOI comprobados en Crossref:** Ladd et al. (2010), Kjaergaard et al. (2020), Bruzewicz et al. (2019), Henriet et al. (2020), Slussarenko y Pryde (2019), Kok et al. (2007), Burkard et al. (2023) y Cross et al. (2019). Las listas de autores también se comprobaron en Crossref.
- **Afirmaciones contrastadas con el resumen original (arXiv):** lo que se dice de cada tecnología en el explorador (por ejemplo, el rango de 100 a 1000 qubits de los átomos neutros, la dificultad de las puertas de dos fotones o la coherencia larga de los espines), la definición del volumen cuántico, y la latencia de decodificación (63 µs) y el ciclo (1,1 µs) del experimento de corrección de errores de 2024.
- **Servicios en la nube:** los enlaces de IBM Quantum Platform, Amazon Braket y Azure Quantum responden. Su oferta cambia con el tiempo, así que la lección no enumera equipos.
- **Sin cifras volátiles:** la lección 2.6 describe las tecnologías de forma cualitativa y no da el número de qubits, las tasas de error ni los récords de equipos concretos. Los procesadores del simulador son ficticios y se declaran como tales.
- **Modelos simplificados declarados:** la QPU del bucle híbrido (P(1) = sin²(θ/2) con ruido de repeticiones) y el éxito de un circuito, (1 − ε)^G con errores independientes. Su lógica está en `src/utils/hardware.js` y se prueba en `tests/module2.test.js`.
- **Código:** `bucle.py` y `exito.py` se ejecutaron con CPython 3.14 y `tests/python.html` los comprobó en Pyodide (41 coincidencias en total).


## Revisión: sin temas adelantados (2026-10-14)

Criterio nuevo: una lección no usa conceptos cuyas bases todavía no se han presentado en el orden del libro. Si un tema no se puede omitir, se presenta a gran escala (la idea, en palabras cotidianas) y se indica dónde se explicará.

- **Módulo 1:** la sección cuántica de la lección 1.2 ya no menciona Qiskit Aer, el vector de estado ni los métodos de simulación; conserva la tabla de memoria en palabras sencillas. Se simplificaron los avances de las lecciones 1.6 (sin «unitarias»), 1.8 y 1.10 (sin «transpilar» ni «compuertas nativas») y la presentación de BQP, Shor y Grover en la 1.11.
- **Módulo 2:** sin notación |0⟩, «cota de Holevo», «variables ocultas locales», «Hadamard», «qubit lógico/físico», «código de superficie», «redes de tensores», VQE, QAOA ni «transpilación» en el texto de las lecciones (siguen en el glosario y en la bibliografía). «Puertas» pasa a «operaciones» en la 2.6. El simulador del bucle híbrido usa una «perilla de ajuste» en lugar de un ángulo θ en radianes. Se explica «tolerante a fallos» la primera vez que aparece (2.1).
- **Código:** `bucle.py`, `exito.py` y `tolerancia.py` cambiaron solo nombres de variables y textos; sus salidas se volvieron a obtener con CPython 3.14 y `tests/python.html` las comprobó (41 coincidencias).

## Unidad 3.1: el qubit (2026-10-15)

- **DOI comprobados en Crossref:** Schumacher (1995), origen del término «qubit»; Dirac (1939), notación de bras y kets; Born (1926), interpretación probabilística; y Bloch (1946), que da nombre a la esfera.
- **Sin temas adelantados:** la lección 3.1 no usa todavía la notación |0⟩, que se presenta en la 3.2. Las amplitudes son reales en toda la unidad. Los números complejos (Módulo 4) y la fase (lección 3.6) aparecen solo a gran escala, y la fórmula general de la esfera de Bloch va en «Para profundizar».
- **Código:** `medir.py`, `kets.py`, `amplitudes.py` y `bloch.py` se ejecutaron con CPython 3.14, y `tests/python.html` los comprobó en Pyodide (45 coincidencias en total). La lógica de los simuladores está en `src/utils/qubit.js` y se prueba en `tests/module3.test.js`.

## Unidad 3.2: propiedades cuánticas (2026-10-16)

- **DOI comprobados en Crossref:** Aspect, Dalibard y Roger (1982) y Hensen et al. (2015), pruebas experimentales de las desigualdades de Bell. También se comprobó la nota de prensa del Nobel de Física de 2022 en nobelprize.org.
- **Sin temas adelantados:** la unidad usa una sola operación nueva, la «mezcla» (el divisor de haz de la lección 2.1). No se nombra la compuerta de Hadamard ni se usan matrices o números complejos fuera de «Para profundizar». La lección 3.7 presenta solo lo mínimo de dos qubits; los sistemas de n qubits quedan para la 3.9.
- **Honestidad epistémica:** el simulador de la lección 3.7 distingue el par entrelazado de *un* par clásico concreto. La lección aclara que la imposibilidad de imitarlo con *cualquier* estrategia clásica es el teorema de Bell, que se cita y se deja para el Módulo 6.
- **Código:** `superposicion.py`, `fase.py`, `entrelazamiento.py` e `interferencia.py` se ejecutaron con CPython 3.14, y `tests/python.html` los comprobó en Pyodide (49 coincidencias en total).

## Unidad 3.3: sistemas de varios qubits (2026-10-18)

- **Convenio de orden:** se consultó la guía oficial «Bit-ordering in the Qiskit SDK» (Qiskit 2.5). En ella, el qubit 0 es el bit de la derecha de la cadena, y la amplitud de índice x corresponde a |x⟩. La guía advierte de que algunas primitivas devuelven el orden contrario, y la lección lo recoge. El libro adopta este convenio desde la lección 3.9.
- **Comprobación cruzada:** el primer resultado de `varios_qubits.py` coincide con el ejemplo de la guía de Qiskit (qubit 0 en |+⟩ y qubit 1 en |0⟩ dan 00 y 01).
- **Sin temas adelantados:** el producto tensorial solo se nombra en «Para profundizar» (Módulo 4).
- **Código:** `varios_qubits.py` se ejecutó con CPython 3.14 y se comprobó en Pyodide (50 coincidencias en total).
