# Inventory Management System - UI

## 📚 Descripción del Proyecto

### Nombre del Proyecto: Sistema de Gestión de Inventario

**Propósito**: Este sistema de gestión de inventario está diseñado para simplificar la administración de productos y el seguimiento del inventario dentro de una empresa o tienda. Inicialmente, se enfocará únicamente en la gestión de stock para productos específicos, como cables, con la posibilidad de ampliarse a otros productos en versiones futuras. El sistema permitirá a los administradores gestionar productos, monitorear niveles de stock y generar reportes, mientras que los usuarios podrán consultar la disponibilidad de productos, ver el estado de órdenes y acceder a detalles de marcas y categorías.

## 🚀 Objetivos del Proyecto

1. **Funciones del Administrador**:

   - Agregar, editar y eliminar usuarios, productos y ubicaciones de productos en el almacén.
   - Gestionar comentarios sobre productos, niveles de stock y estados de órdenes.
   - Generar reportes de inventario, incluyendo historial de órdenes, niveles de stock y detalles de productos.

2. **Funciones del Usuario** (Operadores de Almacén):
   - Agregar y editar comentarios sobre productos.
   - Ver y gestionar el estado de órdenes ("pendiente", "en proceso", "finalizado").
   - Acceder a reportes de inventario, incluyendo historial de órdenes y estado actual del stock.

## 👥 Roles de Usuarios y Permisos

1. **Administrador**:

   - Acceso completo al sistema.
   - Puede gestionar productos, categorías, tipos, marcas, usuarios, ubicaciones y reportes de inventario.
   - Puede ver todas las acciones realizadas por los usuarios.

2. **Operador de Almacén**:
   - Acceso a ver productos disponibles.
   - Puede actualizar el estado de órdenes, buscar productos por categoría o marca, y agregar/editar comentarios.
   - No puede gestionar productos, categorías ni usuarios.

## 🔍 Funcionalidades Principales

### Funcionalidades del Administrador

1. **Gestión de Productos**:

   - Crear, modificar y eliminar productos.
   - Asignar categorías, marcas y tipos a cada producto.
   - Agregar o modificar la ubicación de los productos en el almacén.

2. **Gestión de Categorías y Marcas**:

   - Crear, modificar y eliminar categorías y marcas.

3. **Gestión de Usuarios**:

   - Crear y gestionar usuarios, asignando roles y permisos específicos.

4. **Gestión de Órdenes**:

   - Crear y gestionar órdenes de corte, actualizando el estado ("pendiente", "en proceso", "finalizado").
   - Asignar órdenes a uno o varios usuarios.

5. **Generación de Reportes**:
   - Generar reportes de stock, disponibilidad de productos, productos populares y el historial de órdenes.

### Funcionalidades del Operador

1. **Consulta de Productos**:

   - Visualizar el catálogo de productos disponibles, buscar por categorías, tipos o marcas.
   - Ver los detalles de cada producto.

2. **Gestión de Órdenes**:
   - Cambiar el estado de las órdenes de corte.
   - Agregar o modificar comentarios en cada producto.
   - Agregar y modificar la ubicación del producto en el almacén.

## ⚙️ Tecnologías y Dependencias del Proyecto

### Backend (Django)

- **Django** para la lógica de negocio y APIs.
- **Django Rest Framework (DRF)** para la creación de APIs que permitan el acceso a los datos.
- **PostgreSQL** como base de datos.
- **Celery + Redis** (opcional) para tareas asíncronas, como notificaciones y generación de reportes.

### Frontend

- **Vite.js** (React/Vue) como interfaz moderna que se comunica con el backend vía API.

### Dependencias

- **Pillow** para manejo de imágenes (si los productos incluyen imágenes).
- **Simple JWT** para autenticación basada en tokens.
- **django-cors-headers** para manejar CORS si el frontend está separado.

### Funcionalidad Adicional

- Acceso directo a la vista de producto mediante escaneo de código QR.

## 🔑 Alcance del Proyecto

### Versión 1.0 (MVP):

- Sistema de autenticación con roles de administrador y operadores.
- CRUD completo para productos, categorías, tipos y marcas.
- Gestión de inventario con actualización de stock y visualización de ubicaciones en almacén.
- Gestión de órdenes de corte con cambio de estado ("pendiente", "en proceso", "finalizado") y registro de historial.
- Generación de reportes básicos de stock y estado de órdenes.
- Interfaz frontend simple para mostrar catálogo de productos, detalles y estado de órdenes de corte.

[Repositorio en GitHub](https://github.com/emadiaz15/InventoryManagementSystem-UI.git)
