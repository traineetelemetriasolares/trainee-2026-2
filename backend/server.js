import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import Database from 'better-sqlite3';

interface LeituraRow {
  horario: string;
  status: number;
  re: number;
  temperatura: number;
  aceleracao: number;
}

interface RegistroTelemetria {
  horario: string;
  status: boolean;
  re: boolean;
  temperatura: number;
  aceleracao: number;
}

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const db = new Database('telemetria.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS leituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    horario TEXT NOT NULL,
    status INTEGER NOT NULL,
    re INTEGER NOT NULL,
    temperatura REAL NOT NULL,
    aceleracao REAL NOT NULL
  )
`);

function horarioAtual(): string {
  return new Date().toLocaleTimeString('pt-BR', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function salvarEEmitir(dados: Omit<RegistroTelemetria, 'horario'>): RegistroTelemetria {
  const registro: RegistroTelemetria = {
    horario: horarioAtual(),
    status: dados.status,
    re: dados.re,
    temperatura: Number(dados.temperatura.toFixed(1)),
    aceleracao: Number(dados.aceleracao.toFixed(0)),
  };

  db.prepare(
    `INSERT INTO leituras (horario, status, re, temperatura, aceleracao)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    registro.horario,
    registro.status ? 1 : 0,
    registro.re ? 1 : 0,
    registro.temperatura,
    registro.aceleracao
  );

  io.emit('nova-leitura', registro);
  return registro;
}

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'Backend da telemetria em TypeScript online' });
});

app.get('/telemetria', (_req: Request, res: Response) => {
  const linhas = db
    .prepare('SELECT horario, status, re, temperatura, aceleracao FROM leituras ORDER BY id DESC LIMIT 10')
    .all() as LeituraRow[];

  const ultimos10: RegistroTelemetria[] = linhas.reverse().map((row) => ({
    horario: row.horario,
    status: Boolean(row.status),
    re: Boolean(row.re),
    temperatura: row.temperatura,
    aceleracao: row.aceleracao,
  }));

  res.json(ultimos10);
});

app.post('/telemetria', (req: Request, res: Response) => {
  const { temperatura, aceleracao, status, re } = req.body;

  if (
    typeof temperatura !== 'number' ||
    typeof aceleracao !== 'number' ||
    typeof status !== 'boolean' ||
    typeof re !== 'boolean'
  ) {
    res.status(400).json({ erro: 'JSON inválido' });
    return;
  }

  const registro = salvarEEmitir({ temperatura, aceleracao, status, re });
  console.log('Dados recebidos do ESP32:', registro);
  res.status(201).json({ ok: true, recebido: registro });
});

app.get('/simular', (_req: Request, res: Response) => {
  const registro = salvarEEmitir({
    status: true,
    re: Math.random() > 0.7,
    temperatura: 26 + Math.random() * 10,
    aceleracao: Math.floor(Math.random() * 101),
  });

  console.log('Simulação enviada:', registro);
  res.json({ simulado: registro });
});

io.on('connection', (socket) => {
  console.log('Site conectado ao Socket.IO:', socket.id);
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
