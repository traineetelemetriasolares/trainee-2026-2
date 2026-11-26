'use client'

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface PacoteTelemetria {
  horario: string;
  status: boolean;
  re: boolean;
  temperatura: number;
  aceleracao: number;
}

interface PontoGrafico {
  tempo: string;
  valor: number;
}

const BACKEND_URL = 'http://localhost:3001';

export default function Home() {
  const [conectado, setConectado] = useState(false);
  const [sistemaLigado, setSistemaLigado] = useState(false);
  const [chaveReAtiva, setChaveReAtiva] = useState(false);
  const [dadosTemperatura, setDadosTemperatura] = useState<PontoGrafico[]>([]);
  const [dadosAcelerador, setDadosAcelerador] = useState<PontoGrafico[]>([]);

  useEffect(() => {
    // 1. Carrega os últimos 10 registros salvos no banco SQLite ao abrir
    fetch(`${BACKEND_URL}/telemetria`)
      .then((res) => res.json())
      .then((historico: PacoteTelemetria[]) => {
        if (!Array.isArray(historico) || historico.length === 0) return;

        const ultimo = historico[historico.length - 1];
        setSistemaLigado(ultimo.status);
        setChaveReAtiva(ultimo.re);

        setDadosTemperatura(
          historico.map((item) => ({ tempo: item.horario, valor: item.temperatura }))
        );
        setDadosAcelerador(
          historico.map((item) => ({ tempo: item.horario, valor: item.aceleracao }))
        );
      })
      .catch(() => console.warn('Aguardando resposta do backend na porta 3001...'));

    // 2. Conecta ao Socket.IO para receber atualizações instantâneas
    const socket = io(BACKEND_URL);

    socket.on('connect', () => setConectado(true));
    socket.on('disconnect', () => setConectado(false));

    socket.on('nova-leitura', (dado: PacoteTelemetria) => {
      setSistemaLigado(dado.status);
      setChaveReAtiva(dado.re);

      // Mantém sempre os últimos 10 pontos no gráfico
      setDadosTemperatura((prev) => [
        ...prev.slice(-9),
        { tempo: dado.horario, valor: dado.temperatura },
      ]);

      setDadosAcelerador((prev) => [
        ...prev.slice(-9),
        { tempo: dado.horario, valor: dado.aceleracao },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const tempAtual = dadosTemperatura[dadosTemperatura.length - 1]?.valor ?? 0;
  const acelAtual = dadosAcelerador[dadosAcelerador.length - 1]?.valor ?? 0;

  return (
    <div className="min-h-screen w-full bg-slate-200 px-6 py-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* Cabeçalho */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-300 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShRMTe5OAFcDnbBATp_P507TJB-lSin1aSz08gNGK8IboKECFgj20_ZtM&s=10"
              alt="Logo Projeto Solares"
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <div className="flex items-baseline gap-2 font-bold">
                <h1 className="text-xl text-blue-900">TRAINEE SOLARES</h1>
                <span className="text-xl text-blue-800">2026</span>
              </div>
              <p className="text-sm font-medium text-slate-600">
                Telemetria em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            <span
              className={`h-3 w-3 rounded-full ${
                conectado ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            {conectado ? 'Socket.IO Conectado' : 'Backend Desconectado'}
          </div>
        </header>

        {/* Grid 2x2 */}
        <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Status */}
          <section className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
            <h2 className="w-fit rounded-xl bg-slate-300 px-6 py-1.5 text-lg font-bold text-slate-800">
              Status
            </h2>
            <div className="my-auto flex items-center justify-center py-8">
              <div className="inline-flex items-center gap-4 rounded-3xl border border-slate-300 bg-white px-10 py-6">
                <span
                  className={`h-10 w-10 rounded-full ${
                    sistemaLigado ? 'bg-green-600' : 'bg-red-600'
                  }`}
                />
                <span className="text-2xl font-semibold text-slate-800">
                  {sistemaLigado ? 'Ligado' : 'Desligado'}
                </span>
              </div>
            </div>
          </section>

          {/* Temperatura */}
          <section className="flex flex-col gap-6 rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="w-fit rounded-xl bg-slate-300 px-6 py-1.5 text-lg font-bold text-slate-800">
                Temperatura
              </h2>
              <span className="font-mono text-2xl font-bold text-blue-700">
                {tempAtual.toFixed(1)} °C
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosTemperatura}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="tempo" />
                  <YAxis unit=" °C" width={70} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Temperatura"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Acelerador */}
          <section className="flex flex-col gap-6 rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="w-fit rounded-xl bg-slate-300 px-6 py-1.5 text-lg font-bold text-slate-800">
                Acelerador
              </h2>
              <span className="font-mono text-2xl font-bold text-blue-700">
                {acelAtual} %
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosAcelerador}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="tempo" />
                  <YAxis unit=" %" domain={[0, 100]} width={70} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Acelerador"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Sentido */}
          <section className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
            <h2 className="w-fit rounded-xl bg-slate-300 px-6 py-1.5 text-lg font-bold text-slate-800">
              Sentido
            </h2>
            <div className="my-auto flex items-center justify-center py-8">
              <div className="inline-flex items-center gap-4 rounded-3xl border border-slate-300 bg-white px-10 py-6">
                <span
                  className={`h-10 w-10 rounded-full ${
                    chaveReAtiva ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                />
                <span className="text-2xl font-semibold text-slate-800">
                  {chaveReAtiva ? 'Ré' : 'Frente'}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
