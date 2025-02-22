const express = require('express');
const cors = require('cors');  // Importar CORS
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const app = express();

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'duruqbipv',  // Tu nombre de Cloudinary
  api_key: '857167242619486',  // Tu API Key
  api_secret: 'POaaiNhqAICv8t91AXXD-ABx-D4',  // Tu API Secret
});

// Configuración de Multer para manejar los archivos subidos
const storage = multer.memoryStorage(); // Guardar los archivos en memoria
const upload = multer({ storage: storage });

// Lista para almacenar los links de las imágenes subidas
let uploadedImages = [];

// Ruta principal que muestra el formulario para cargar imágenes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Sirve el archivo HTML
});

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    // Verifica si no se recibió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha recibido una imagen' });
    }

    // Sube la imagen a Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'uploads' },  // 'auto' detecta automáticamente el tipo de archivo
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Error al subir la imagen a Cloudinary' });
        }

        // Obtén la URL de la imagen subida
        const imageUrl = result.secure_url;

        // Almacenar el link de la imagen
        uploadedImages.push(imageUrl);

        return res.status(200).json({ message: 'Imagen subida correctamente', image_url: imageUrl });
      }
    ).end(req.file.buffer);  // Usamos el archivo en memoria
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Ruta para ver las imágenes subidas
app.get('/images', (req, res) => {
  try {
    if (uploadedImages.length > 0) {
      return res.json({ image_urls: uploadedImages });
    } else {
      return res.json({ message: 'No hay imágenes subidas.' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
