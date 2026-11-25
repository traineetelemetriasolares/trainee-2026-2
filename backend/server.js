const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Guarda a última leitura com os 4 parâmetros reais do desafio
let ultimoDado = {
  temperatura: 0,
  aceleracao: 0,
  status: false,
  re: false,
  timestamp: new Date().toISOString()
};

// Rota para verificar no navegador se o servidor está online
app.get('/', (req, res) => {
  res.json({
    status: 'Backend da telemetria online',
    ultimoDado
  });
});

// Rota que recebe os dados via HTTP POST do ESP32
app.post('/telemetria', (req, res) => {
  ultimoDado = {
    ...ultimoDado,
    ...req.body,
    timestamp: new Date().toISOString()
  };

  console.log('Dados recebidos:', ultimoDado);
  io.emit('telemetria', ultimoDado);

  res.status(200).json({ ok: true, recebido: ultimoDado });
});

// Rota de teste: gera valores aleatórios para testar seus gráficos sem o ESP32
app.get('/simular', (req, res) => {
  ultimoDado = {
    temperatura: Number((26 + Math.random() * 10).toFixed(1)),
    aceleracao: Math.floor(Math.random() * 101),
    status: true,
    re: Math.random() > 0.5,
    timestamp: new Date().toISOString()
  };

  console.log('Simulação enviada:', ultimoDado);
  io.emit('telemetria', ultimoDado);

  res.json({ simulado: ultimoDado });
});

io.on('connection', (socket) => {
  console.log('Site conectado ao Socket.IO:', socket.id);
  socket.emit('telemetria', ultimoDado);

  socket.on('disconnect', () => {
    console.log('Site desconectado:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});