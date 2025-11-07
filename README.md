# Ejecutar localmente

## Requisitos previos
- Node.js

## Instalar dependencias
```bash
npm install
```

## Configuración
Para que la aplicación funcione, es necesario configurar tu clave de API de Gemini. Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido, reemplazando `TU_API_KEY_AQUI` con tu clave real.

La aplicación está configurada para leer la clave desde `process.env.API_KEY`.

```.env
API_KEY=TU_API_KEY_AQUI
```

## Ejecutar la aplicación
```bash
npm run dev
```
