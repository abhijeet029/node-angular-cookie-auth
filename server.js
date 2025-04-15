const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret'; //you can use env as well
const DEVICE_SECRET = 'DEVICE_SIGNING_SECRET';

app.use(express.json());
app.use(cookieParser());

// Allow Angular app to send cookies
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

function signDeviceId(deviceId) {
  const hash = crypto.createHmac('sha256', DEVICE_SECRET).update(deviceId).digest('hex');
  console.log(deviceId, hash)
  return `${deviceId}.${hash}`;
}

function verifySignedDeviceId(signedDeviceId) {
  const [deviceId, signature] = signedDeviceId.split('.');
  console.log(deviceId, signature, 'asdsad')
  const expected = crypto.createHmac('sha256', DEVICE_SECRET).update(deviceId).digest('hex');
  return signature === expected ? deviceId : null;
}

app.post('/api/login', (req, res) => {
  const { email, password, deviceId } = req.body;

  // Fake auth (replace with real DB check)
  if (email === 'admin' && password === 'password') { //you can write your own logic to verify using bcrypted password
    const signedDeviceId = signDeviceId(deviceId);
    const token = jwt.sign({ userId: '21313-32434-2', deviceId: signedDeviceId }, JWT_SECRET, { expiresIn: '1h' });
    console.log(token)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // true in production (HTTPS only)
      sameSite: 'Lax',
      maxAge: 3600000 // 1 hour
    });
    res.cookie('signed_device_id', signedDeviceId, {
      httpOnly: true,
      secure: true, // true in production (HTTPS only)
      sameSite: 'Lax',
      maxAge: 3600000 // 1 hour
    });
    return res.json({ message: 'Logged in' });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

app.use((req, res, next) => {
  const token = req.cookies['token'];
  const deviceId = req.cookies['signed_device_id'];
  console.log(token, deviceId)
  if (!token || !deviceId) return res.status(401).json({ message: 'Missing token or device ID' });
  const verifiedDeviceId = verifySignedDeviceId(deviceId);
  if (!verifiedDeviceId) return res.status(403).json({ message: 'Invalid or tampered device ID' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log(payload, 'payload')
    if (verifySignedDeviceId(payload.deviceId) !== verifiedDeviceId) {
      return res.status(403).json({ message: 'Unauthorized device' });
    }
    console.log('here')
    req.user = payload;
    next();
  } catch (err) {
    console.log(err, 'err')
    return res.status(403).json({ message: 'Invalid token' });
  }
});

app.get('/api/data', (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}! This is protected data.` });
});

// Simulated login endpoint
// Protected route
app.get('/api/profile', (req, res) => {
  const token = req.cookies.token;
  console.log(token, 'asdasds')
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user, 'user')
    res.json({ message: `Welcome ${user.username}` });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
