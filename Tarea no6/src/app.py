# Importar módulos necesarios de Flask y la extensión Flask-MySQLdb
from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL

# Crear la aplicación Flask
app = Flask(__name__)

# -------------------- CONFIGURACIÓN DE LA BASE DE DATOS --------------------

# Configuración para conectar con la base de datos MySQL usando flask_mysqldb
app.config['MYSQL_HOST'] = 'localhost'      # Dirección del servidor de la base de datos
app.config['MYSQL_USER'] = 'root'           # Usuario de la base de datos
app.config['MYSQL_PASSWORD'] = ''           # Contraseña del usuario (vacío si no tiene)
app.config['MYSQL_DB'] = 'sistema'          # Nombre de la base de datos a usar

# Crear e inicializar la instancia MySQL con la configuración anterior
mysql = MySQL(app)

# -------------------- RUTAS PRINCIPALES DE LA APLICACIÓN --------------------

@app.route('/')
def index():
    """
    Ruta principal que muestra todos los empleados registrados en la base de datos.
    """
    # Crear cursor para ejecutar consultas SQL
    cur = mysql.connection.cursor()

    # Ejecutar consulta para obtener todos los registros de la tabla 'empleados'
    cur.execute("SELECT * FROM empleados")

    # Obtener todos los resultados de la consulta
    empleados = cur.fetchall()

    # Cerrar el cursor para liberar recursos
    cur.close()

    # Renderizar plantilla HTML 'index.html' y pasar la lista de empleados
    return render_template('index.html', empleados=empleados)

# -------------------- CREAR NUEVO EMPLEADO --------------------

@app.route('/crear', methods=['GET', 'POST'])
def crear():
    """
    Ruta para mostrar el formulario de creación de un empleado (GET)
    y para procesar el formulario y guardar el empleado nuevo en la base de datos (POST).
    """
    if request.method == 'POST':
        # Obtener datos enviados desde el formulario
        nombre = request.form['nombre']
        correo = request.form['correo']
        foto = request.form['foto']

        # Crear cursor y ejecutar consulta INSERT para agregar empleado nuevo
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO empleados (nombre, correo, foto) VALUES (%s, %s, %s)",
            (nombre, correo, foto)
        )

        # Confirmar los cambios en la base de datos
        mysql.connection.commit()

        # Cerrar cursor
        cur.close()

        # Redirigir a la página principal después de crear el empleado
        return redirect(url_for('index'))

    # Si es una petición GET, mostrar el formulario vacío para crear empleado
    return render_template('crear.html')

# -------------------- EDITAR EMPLEADO EXISTENTE --------------------

@app.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar(id):
    """
    Ruta para mostrar el formulario para editar un empleado existente (GET)
    y para actualizar los datos del empleado en la base de datos (POST).
    """
    # Crear cursor para consultas
    cur = mysql.connection.cursor()

    if request.method == 'POST':
        # Obtener los datos enviados desde el formulario
        nombre = request.form['nombre']
        correo = request.form['correo']
        foto = request.form['foto']

        # Ejecutar consulta UPDATE para modificar los datos del empleado con id dado
        cur.execute(
            "UPDATE empleados SET nombre=%s, correo=%s, foto=%s WHERE id=%s",
            (nombre, correo, foto, id)
        )

        # Confirmar cambios
        mysql.connection.commit()

        # Cerrar cursor
        cur.close()

        # Redirigir a la página principal
        return redirect(url_for('index'))

    else:
        # Si es GET, obtener los datos actuales del empleado para prellenar el formulario
        cur.execute("SELECT * FROM empleados WHERE id = %s", (id,))
        empleado = cur.fetchone()
        cur.close()

        # Renderizar formulario 'editar.html' con los datos del empleado
        return render_template('editar.html', empleado=empleado)

# -------------------- ELIMINAR EMPLEADO --------------------

@app.route('/eliminar/<int:id>')
def eliminar(id):
    """
    Ruta para eliminar un empleado de la base de datos según su ID.
    """
    # Crear cursor para ejecutar consulta DELETE
    cur = mysql.connection.cursor()

    # Ejecutar la eliminación del empleado con id especificado
    cur.execute("DELETE FROM empleados WHERE id = %s", (id,))

    # Confirmar cambios en la base de datos
    mysql.connection.commit()

    # Cerrar cursor
    cur.close()

    # Redirigir a la página principal después de eliminar
    return redirect(url_for('index'))

# -------------------- INICIAR LA APLICACIÓN --------------------

if __name__ == '__main__':
    # Ejecutar la aplicación en modo debug para facilitar el desarrollo
    app.run(debug=True)
