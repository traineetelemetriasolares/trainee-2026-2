'use client'

import { useState } from "react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function Home() {
  const [qtd, setQtd] = useState(0)
  const [nome,setNome] = useState<string>()

  const dadosAceleracao = [
  { tempo: '0s', valor: 0.0 },
  { tempo: '1s', valor: 1.4 },
  { tempo: '2s', valor: 2.1 },
  { tempo: '3s', valor: 1.9 },
  { tempo: '4s', valor: 2.5 },
  ];

  const dadosTemperatura = [
  { tempo: '0s', valor: 28.5 },
  { tempo: '1s', valor: 29.2 },
  { tempo: '2s', valor: 30.8 },
  { tempo: '3s', valor: 31.5 },
  { tempo: '4s', valor: 32.1 },
  ];

  const sistemaLigado = true; // mude para false para testar desligado
  const chaveReAtiva = false; // mude para true para testar a ré

  return(
    <div className="bg-slate-200 w-full h-screen flex flex-col min-h-screen px-10">
      <header className="font-bold bg-slate-300 rounded-3xl w-100 h-20 flex items-center gap-4 justify-center">
        <img
          src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShRMTe5OAFcDnbBATp_P507TJB-lSin1aSz08gNGK8IboKECFgj20_ZtM&s=10"}
          width={60}
          className="rounded-full"
        />
        <h1 className="text-xl text-blue-900"> TRAINEE SOLARES</h1>
        <h2 className="text-xl text-blue-800"> 2026</h2>
  
      </header>

      <section className="bg-slate-300 rounded-xl flex items-center w-110 h-20 text-4xl text-slate-800 font-bold mt-12">  
        <h3 className="ml-32">
          Telemetria
        </h3>
      </section>

      <section className="grid grid-cols-2 gap-6 ml-12">  

        <div>  
          <h3 className="text-xl text-slate-800 font-bold mt-12 ml-6 bg-slate-300 rounded-xl px-10 py-1.5 w-fit">
            Status
          </h3>

          <div className="mt-12 ml-6 inline-flex items-center gap-2 rounded-4xl border border-slate-300 bg-white px-12 py-8">
              <span
                className={`h-12 w-12 rounded-full ${
                  sistemaLigado ? 'bg-green-600' : 'bg-red-600'
                }`}
              />
              <span className="ml-2 text-xl font-medium text-slate-800">
                {sistemaLigado ? 'Ligado' : 'Desligado'}
              </span>
          </div>
        </div>

        <div>  
          <h3 className="text-xl text-slate-800 font-bold mt-12 ml-6 bg-slate-300 rounded-xl px-10 py-1.5 w-fit">
            Temperatura
          </h3>
          
          <div className="h-64 w-150 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosTemperatura}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tempo" />
                <YAxis unit=" °C" width={75} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div>  
          <h3 className="text-xl text-slate-800 font-bold mt-8 ml-6 bg-slate-300 rounded-xl px-10 py-1.5 w-fit">
            Aceleração
          </h3>

          <div className="h-64 w-150 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosAceleracao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tempo" />
                <YAxis unit=" m/s²" width={75} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div>  
          <h3 className="text-xl text-slate-800 font-bold mt-8 ml-6 bg-slate-300 rounded-xl px-10 py-1.5 w-fit">
            Sentido
          </h3>

          <div className="mt-12 ml-6 inline-flex items-center gap-2 rounded-4xl border border-slate-300 bg-white px-12 py-8">
            <span
              className={`h-12 w-12 rounded-full ${
                chaveReAtiva ? 'bg-amber-500' : 'bg-blue-600'
              }`}
            />
            <span className="ml-2 text-xl font-medium text-slate-800">
              {chaveReAtiva ? 'Ré' : 'Frente'}
            </span>
          </div>

        </div>



      </section>

      <input 
      type="text"
      placeholder="Digite seu nome aqui"
      value={nome}
      onChange={(valor) => setNome(valor.target.value)}
      />
    </div>
  )
}