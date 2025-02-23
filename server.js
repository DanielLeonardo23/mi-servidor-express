const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Configuración de CORS para permitir solicitudes de cualquier origen
app.use(cors());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'duruqbipv',  // Tu nombre de Cloudinary
  api_key: '857167242619486',  // Tu API Key
  api_secret: 'POaaiNhqAICv8t91AXXD-ABx-D4',  // Tu API Secret
});

// Asegurarse de que la carpeta 'uploads' exista
const UPLOAD_FOLDER = 'uploads';
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar las imágenes en la carpeta 'uploads'
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    // Usar un nombre único basado en un timestamp para evitar sobrescribir archivos
    cb(null, Date.now() + path.extname(file.originalname));  // Nombre único con timestamp
  }
});

const upload = multer({ storage: storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Ruta local donde se guardó la imagen
  const localImagePath = path.join(UPLOAD_FOLDER, req.file.filename);

  // Subir la imagen a Cloudinary
  cloudinary.uploader.upload(localImagePath, 
    { resource_type: 'auto' },  // Detecta el tipo de archivo automáticamente
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Error uploading image.' });
      }

      // Devolver la URL de la imagen subida
      res.json({
        message: 'Image uploaded successfully',
        url: result.secure_url,  // URL de la imagen subida
        filename: result.public_id  // public_id de la imagen subida
      });
    }
  );
});

// Ruta para acceder a la imagen cargada (opcional)
app.get('/upload/:filename', (req, res) => {
  const imagePath = path.join(UPLOAD_FOLDER, req.params.filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  res.sendFile(imagePath);
});

// Servir archivos estáticos (el formulario HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
