const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

//Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const alertRoutes = require('./routes/alertRoutes');
app.use('/api/alerts', alertRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const safeZoneRoutes = require('./routes/safeZoneRoutes');
app.use('/api/safezones', safeZoneRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BSafe server is running!' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});