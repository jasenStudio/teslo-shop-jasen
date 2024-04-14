# Descripcion



# Ejecutar en dev

1. Clonar el repositorio
2. crear una copia el archivo ``` .env.template ``` y renombrarlo a ``` .env ```
3. Instalar dependencias ``` npm install ```
4. levantar la base de datos ``` docker compose up -d ```
5. correr las migraciones de Primas ``` npx prisma migrate dev ```
6. Ejecutar seed ``` npm run seed ``` 
6. Correr el proyecto ```npm run dev ``


# Ejecutar en prod