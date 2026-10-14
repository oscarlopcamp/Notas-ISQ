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
