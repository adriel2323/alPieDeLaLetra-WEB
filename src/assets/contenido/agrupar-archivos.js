const fs = require('fs');
const path = require('path');

function agruparArchivosPorClave(opciones = {}) {
    const {
        directorio = process.cwd(),
        prefijoRuta = 'src/assets/models/',
        extensionesPermitidas = ['.webp', '.jpg', '.jpeg', '.png', '.gif']
    } = opciones;
    
    try {
        const archivos = fs.readdirSync(directorio);
        const objetoAgrupado = {};
        
        archivos.forEach(archivo => {
            const rutaCompleta = path.join(directorio, archivo);
            
            // Verificar que es un archivo y tiene extensión permitida
            if (fs.statSync(rutaCompleta).isFile()) {
                const extension = path.extname(archivo).toLowerCase();
                
                if (extensionesPermitidas.includes(extension)) {
                    // Extraer el nombre clave usando el patrón: texto_números
                    const match = archivo.match(/^([a-zA-Z-]+)_\d+/);
                    
                    if (match) {
                        const nombreClave = match[1];
                        const rutaFormateada = `${prefijoRuta}${archivo}`;
                        
                        if (!objetoAgrupado[nombreClave]) {
                            objetoAgrupado[nombreClave] = [];
                        }
                        
                        objetoAgrupado[nombreClave].push(rutaFormateada);
                    }
                }
            }
        });
        
        return objetoAgrupado;
        
    } catch (error) {
        console.error('Error al leer el directorio:', error.message);
        return {};
    }
}

// Ejemplos de uso:

// 1. Uso básico
console.log('=== USO BÁSICO ===');
const resultadoBasico = agruparArchivosPorClave();
console.log(JSON.stringify(resultadoBasico, null, 2));

// 2. Con opciones personalizadas
console.log('\n=== CON OPCIONES PERSONALIZADAS ===');
const resultadoPersonalizado = agruparArchivosPorClave({
    prefijoRuta: 'assets/images/',
    extensionesPermitidas: ['.webp', '.png', '.jpg']
});
console.log(JSON.stringify(resultadoPersonalizado, null, 2));

// 3. Guardar en archivo JSON
fs.writeFileSync('modelos-agrupados.json', JSON.stringify(resultadoBasico, null, 2));
console.log('\nArchivo "modelos-agrupados.json" creado exitosamente');

// 4. Mostrar estadísticas
console.log('\n=== ESTADÍSTICAS ===');
Object.keys(resultadoBasico).forEach(clave => {
    console.log(`${clave}: ${resultadoBasico[clave].length} archivos`);
});