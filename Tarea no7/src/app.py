# Importar Flask y funciones auxiliares para rutas y formularios
from flask import Flask, render_template, request

# Importar la base de datos y el modelo Book definidos en otro archivo
from models import db, Book

# Crear una instancia de la aplicación Flask
app = Flask(__name__)

# -------------------- CONFIGURACIÓN DE LA BASE DE DATOS --------------------

# Configurar la conexión a una base de datos MySQL usando el driver PyMySQL
# Formato: 'mysql+pymysql://usuario:contraseña@servidor/nombre_basededatos'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/books_db'

# Desactivar el seguimiento de modificaciones para ahorrar recursos
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos con la configuración de Flask
db.init_app(app)

# -------------------- CREACIÓN AUTOMÁTICA DE LA BASE DE DATOS --------------------

# Crear todas las tablas definidas en los modelos si aún no existen
# Se ejecuta dentro del contexto de la aplicación Flask
with app.app_context():
    db.create_all()

# -------------------- RUTAS DE LA APLICACIÓN --------------------

# Ruta principal que renderiza un formulario para agregar libros
@app.route('/')
def index():
    return render_template('form.html')  # Renderiza el archivo form.html

# Ruta que se activa al enviar el formulario por método POST
@app.route('/add', methods=['POST'])
def add():
    # Obtener los datos enviados desde el formulario HTML
    title = request.form['title']
    author = request.form['author']
    genre = request.form['genre']
    
    # Crear una nueva instancia del modelo Book con los datos del formulario
    new_book = Book(title, author, genre)
    
    # Agregar el nuevo libro a la sesión de base de datos
    db.session.add(new_book)
    
    # Confirmar (guardar) los cambios en la base de datos
    db.session.commit()

    # Devolver un mensaje de éxito
    return "Libro agregado con éxito"

# -------------------- EJECUCIÓN DEL SERVIDOR --------------------

# Si este archivo es ejecutado directamente, iniciar el servidor de desarrollo
if __name__ == '__main__':
    app.run(debug=True)  # Habilita el modo de depuración para desarrollo
