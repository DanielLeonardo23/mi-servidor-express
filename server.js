const express = require('express');
const cors = require('cors');  // Importamos CORS
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const app = express();

// Configuración de CORS para permitir solicitudes de cualquier origen
app.use(cors());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'duruqbipv',  // Tu nombre de Cloudinary
  api_key: '857167242619486',  // Tu API Key
  api_secret: 'POaaiNhqAICv8t91AXXD-ABx-D4',  // Tu API Secret
});

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage();  // Almacenamos en memoria
const upload = multer({ storage: storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Subir la imagen a Cloudinary
  cloudinary.uploader.upload_stream(
    { resource_type: 'auto' },  // Detecta el tipo de archivo automáticamente
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error uploading image.' });
      }

      // Respondemos con la URL de la imagen subida
      res.json({
        message: 'Image uploaded successfully',
        filename: result.public_id,
        url: result.secure_url,  // URL de la imagen subida
      });
    }
  ).end(req.file.buffer);  // Usamos el archivo desde la memoria
});

// Servir archivos estáticos (el formulario HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
