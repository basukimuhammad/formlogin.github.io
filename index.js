const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codeotpverifikasi@gmail.com',
    pass: 'zyti splg fqkd lgto'
  }
});

// Koneksi ke MongoDB
mongoose.connect('mongodb+srv://Basuki:basuki187@basuki.mn6rfqd.mongodb.net/?retryWrites=true&w=majority&appName=Basuki', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Koneksi ke MongoDB berhasil'))
  .catch(err => console.error('Koneksi ke MongoDB gagal', err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  otp: Number,
  verified: Boolean
});

const User = mongoose.model('User', userSchema);

app.get('/', (_, res) => {
  return res.send(`
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f2f2f2;
          }
          
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          
          .container h2 {
            color: #333;
            margin-bottom: 20px;
          }
          
          .container label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: bold;
            text-align: left;
          }
          
          .container input[type="text"],
          .container input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-bottom: 20px;
          }
          
          .container input[type="submit"] {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button:hover {
            background-color: #555;
          }
          
          @media (min-width: 768px) {
            body {
              height: auto;
            }
            
            .container {
              max-width: 400px;
            }
          }
        </style>
      </head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <body>
        <div class="container">
          <h2>Login</h2>
          <form action="/" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <input type="submit" value="Login">
          </form>
          <br>
          <button onclick="location.href='/register'">Daftar</button>
        </div>
      </body>
    </html>
  `);
});

app.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username, password }, (err, user) => {
    if (err) return res.status(500).send('Error reading user data');
    if (!user) return res.send('Username atau password salah. Silakan coba lagi.');
    if (!user.verified) return res.send('Akun Anda belum diverifikasi. Silakan verifikasi terlebih dahulu.');
    return res.redirect('/');
  });
});

app.get('/register', (_, res) => {
  return res.send(`
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f2f2f2;
          }
          
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          
          .container h2 {
            color: #333;
            margin-bottom: 20px;
          }
          
          .container label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: bold;
            text-align: left;
          }
          
          .container input[type="text"],
          .container input[type="email"],
          .container input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-bottom: 20px;
          }
          
          .container input[type="submit"] {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button:hover {
            background-color: #555;
          }
        </style>
        <script>
        // Fungsi untuk memutar audio secara otomatis
        function playAudio() {
          var audio = new Audio('./audio.mp3');
          audio.play();
        }

        // Memanggil fungsi playAudio saat halaman selesai dimuat
        window.onload = playAudio;
        </script>
      </head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <body>
        <div class="container">
          <h2 style="color: #333;">Daftar</h2>
          <form action="/register" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <input type="submit" value="Daftar" style="background-color: #333; color: #fff; padding: 10px 20px; border: none; cursor: pointer;">
          </form>
          <br>
          <button onclick="location.href='/'" style="background-color: #333; color: #fff; padding: 10px 20px; border: none; cursor: pointer;">Kembali ke Login</button>
        </div>
      </body>
    </html>
  `);
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ username }, (err, existingUser) => {
    if (err) return res.status(500).send('Error reading user data');
    if (existingUser) return res.send('Username sudah digunakan. Silakan gunakan username lain.');

    User.findOne({ email }, (err, existingEmail) => {
      if (err) return res.status(500).send('Error reading user data');
      if (existingEmail) return res.send('Email sudah digunakan. Silakan gunakan email lain.');

      const otp = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = { from: 'codeotpverifikasi@gmail.com', to: email, subject: 'Kode OTP untuk Verifikasi', text: `Kode OTP Anda adalah: ${otp}` };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send('Error sending OTP');

        const newUser = new User({ username, email, password, otp, verified: false });

        newUser.save((err) => {
          if (err) return res.status(500).send('Error saving user data');
          return res.redirect('/verify');
        });
      });
    });
  });
});

app.get('/verify', (_, res) => {
  return res.send(`
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f2f2f2;
          }
          
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          
          .container h2 {
            color: #333;
            margin-bottom: 20px;
          }
          
          .container label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: bold;
            text-align: left;
          }
          
          .container input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-bottom: 20px;
          }
          
          .container input[type="submit"] {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
          
          .container button:hover {
            background-color: #555;
          }
        </style>
      </head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <body>
        <div class="container">
          <h2 style="color: #333;">Verifikasi Kode OTP</h2>
          <form action="/verify" method="post">
            <label for="otp">Kode OTP:</label>
            <input type="text" id="otp" name="otp" required><br><br>
            <input type="submit" value="Verifikasi" style="background-color: #333; color: #fff; padding: 10px 20px; border: none; cursor: pointer;">
          </form>
        </div>
      </body>
    </html>
  `);
});

app.post('/verify', (req, res) => {
  const { otp } = req.body;

  User.findOne({ otp: parseInt(otp) }, (err, user) => {
    if (err) return res.status(500).send('Error reading user data');
    if (!user) return res.send('Kode OTP tidak valid. Silakan coba lagi.');

    user.verified = true;
    user.otp = null; // Menghapus OTP setelah verifikasi

    user.save((err) => {
      if (err) return res.status(500).send('Error updating user data');
      return res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f2f2f2;
              }
              
              .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 100%;
              }
              
              .container h2 {
                color: #333;
                margin-bottom: 20px;
              }
              
              .container p {
                color: #333;
                margin-bottom: 20px;
              }
              
              .container button {
                background-color: #333;
                color: #fff;
                padding: 10px 20px;
                border: none;
                cursor: pointer;
              }
              
              .container button:hover {
                background-color: #555;
              }
            </style>
          </head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <body>
            <div class="container">
              <h2 style="color: #333;">Verifikasi Berhasil</h2>
              <p>Akun Anda telah berhasil diverifikasi.</p>
              <button onclick="location.href='/'" style="background-color: #333; color: #fff; padding: 10px 20px; border: none; cursor: pointer;">Kembali ke Login</button>
            </div>
          </body>
        </html>
      `);
    });
  });
});

app.listen(3000, () => console.log('Server ready on port 3000.'));
