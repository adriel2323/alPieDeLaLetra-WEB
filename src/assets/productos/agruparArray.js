const fs = require('fs');
const path = require('path');

function agruparArchivosPorClave() {
    const directorioActual = process.cwd();
    const archivos = fs.readdirSync(directorioActual);
    
    const objetoAgrupado = {};
    
    archivos.forEach(archivo => {
        // Verificar que es un archivo (no directorio)
        const rutaCompleta = path.join(directorioActual, archivo);
        if (fs.statSync(rutaCompleta).isFile()) {
            // Extraer el nombre clave (parte antes del _ y números)
            const match = archivo.match(/^([a-zA-Z-]+)_\d+/);
            
            if (match) {
                const nombreClave = match[1];
                const rutaFormateada = `src/assets/productos/${archivo}`;
                
                // Crear el array si no existe, o agregar al existente
                if (!objetoAgrupado[nombreClave]) {
                    objetoAgrupado[nombreClave] = [];
                }
                
                objetoAgrupado[nombreClave].push(rutaFormateada);
            }
        }
    });
    
    return objetoAgrupado;
}

// Ejecutar la función y mostrar el resultado
const resultado = agruparArchivosPorClave();
console.log('Objeto agrupado:');
console.log(JSON.stringify(resultado, null, 2));

// Si quieres guardar el resultado en un archivo JSON
fs.writeFileSync('archivos-agrupados.json', JSON.stringify(resultado, null, 2));
console.log('\nResultado guardado en archivos-agrupados.json');