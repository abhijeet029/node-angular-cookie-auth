const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret'; //you can use env as well

app.use(express.json());
app.use(cookieParser());

// Allow Angular app to send cookies
app.use(cors({
  origin: 'http://localhost:4100',
  credentials: true
}));

// Simulated login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Fake auth (replace with real DB check)
  if (username === 'admin' && password === 'password') { //you ca write your own logic to verify using bcrypted password
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // true in production (HTTPS only)
      sameSite: 'Lax',
      maxAge: 3600000 // 1 hour
    });

    return res.json({ message: 'Logged in' });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// Protected route
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  console.log(token)
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Welcome ${user.username}` });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
