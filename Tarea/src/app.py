from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL

app = Flask(__name__)

# Configuración de MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '12345'
app.config['MYSQL_DB'] = 'sistema'

mysql = MySQL(app)

# Mostrar todos los empleados
@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM empleados")
    empleados = cur.fetchall()
    cur.close()
    return render_template('index.html', empleados=empleados)

# Formulario para crear nuevo empleado
@app.route('/crear', methods=['GET', 'POST'])
def crear():
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        foto = request.form['foto']
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO empleados (nombre, correo, foto) VALUES (%s, %s, %s)",
                    (nombre, correo, foto))
        mysql.connection.commit()
        cur.close()
        return redirect(url_for('index'))
    return render_template('crear.html')

# Editar empleado
@app.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar(id):
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        foto = request.form['foto']
        cur.execute("UPDATE empleados SET nombre=%s, correo=%s, foto=%s WHERE id=%s",
                    (nombre, correo, foto, id))
        mysql.connection.commit()
        cur.close()
        return redirect(url_for('index'))
    else:
        cur.execute("SELECT * FROM empleados WHERE id = %s", (id,))
        empleado = cur.fetchone()
        cur.close()
        return render_template('editar.html', empleado=empleado)

# Eliminar empleado
@app.route('/eliminar/<int:id>')
def eliminar(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM empleados WHERE id = %s", (id,))
    mysql.connection.commit()
    cur.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
