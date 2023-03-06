# Curso Backend - Coderhouse

## Sobre este proyecto

Elaboración de una API para ecommerce, trabajando la persistencia de la información en bases de datos relaciones, no relaciones y archivos.

## Métodos de persistencia

Para almacenar la información, puede seleccionar el método de persistencia que desee editando la variable _selectedDatabase_ dentro del archivo **config.js**

A continuación, se detallan los métodos de persistencia junto a su código de selección:

| Tipo de persistencia | Código de selección |
| -------------------- | ------------------- |
| File System          | 1                   |
| MySQL (Local)        | 2                   |
| SQLite (Local)       | 3                   |
| MongoDB (Remoto)     | 4                   |
| Firebase             | 5                   |

_En caso de seleccionar un código que no esté expresado en la tabla, se tomará por defecto la persistencia por FyleSystem._

**Nota:** Se agregan archivos de creación de Base de datos para los métodos de persistencia vía SQL ya que se usaron llaves foráneas. Para persistencia por firebase se debe agregar el archivo .json en la ruta /src/DAOs/FireBaseService

## Dependencias

* dotenv
* express
* firebase-admin
* knex
* moment
* mongoose
* mysql
* sqlite3
* express-validator
* nodemon
