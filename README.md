# Sistema de Gestión Académica (Fullstack)

Esta es una solución robusta para la gestión de alumnos, materias y calificaciones. El proyecto ha sido diseñado bajo una arquitectura de microservicios contenerizados, asegurando que el despliegue sea idéntico en cualquier entorno (local o máquina virtual) mediante el uso de **Docker**.

## 🚀 Tecnologías Principales
* **Backend:** Java 17 con Spring Boot 3 (API REST).
* **Frontend:** React + TypeScript.
* **Base de Datos:** MySQL 8.0.
* **Infraestructura:** Docker & Docker Compose.

---

## 🛠️ Instrucciones de Ejecución

Siga estos pasos para desplegar el entorno completo. El proceso automatiza la creación de la red, los volúmenes y la población de datos iniciales.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/odam2323/gestion-academica-fullstack.git](https://github.com/odam2323/gestion-academica-fullstack.git)
    ```
2.  **Ingresar al directorio raíz:**
    ```bash
    cd gestion-academica-fullstack
    ```
3.  **Desplegar con Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
4.  **Verificar contenedores (Opcional):**
    ```bash
    docker ps
    ```

---

## 🔗 Acceso al Sistema

Una vez que los contenedores reporten un estado saludable, puede acceder a los servicios en las siguientes direcciones:

* **Frontend (Dashboard):** [http://localhost:3000](http://localhost:3000)
* **API REST (Endpoint Alumnos):** [http://localhost:8080/api/alumnos](http://localhost:8080/api/alumnos)

---

## ⚙️ Configuración y Variables de Envorno

Para evitar **"rutas quemadas" (hardcoded paths)** y permitir la flexibilidad en ambientes de Máquina Virtual (VM), la API se conecta a la base de datos utilizando variables de entorno inyectadas a través del archivo `docker-compose.yml`:

| Variable | Descripción |
| :--- | :--- |
| `DB_URI` | URL de conexión JDBC (Usa el nombre del servicio `db`). |
| `DB_USER` | Usuario administrativo de la base de datos. |
| `DB_PASSWORD` | Contraseña de acceso. |
| `DB_DRIVER` | Driver de conexión (`com.mysql.cj.jdbc.Driver`). |

---

## 📊 Datos de Prueba (Seed Data)

El proyecto incluye un mecanismo de inicialización automática. Al levantar el servicio de base de datos por primera vez, se ejecuta el script de respaldo ubicado en:
`./init-db/init.sql`

Este proceso carga registros de prueba (Alumnos, Materias y Calificaciones) de forma inmediata para facilitar la validación de la API y la interfaz de usuario.

---

## 📝 Notas de Ingeniería
* **Healthcheck:** El backend incluye una política de espera para asegurar que la base de datos esté lista para recibir conexiones antes de iniciar el contexto de Spring.
* **CORS:** Se ha habilitado una configuración global de CORS en los controladores (`@CrossOrigin`) para permitir la comunicación fluida entre el cliente y el servidor.
