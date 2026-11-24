'use client'

import { useState } from "react"

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

export default function Home() {
  const [qtd, setQtd] = useState(0)
  const [nome,setNome] = useState<string>()

const data = [
  {
    name: 'A',
    uv: 400,
    pv: 240,
    amt: 2400,
  },
  {
    name: 'B',
    uv: 300,
    pv: 456,
    amt: 2400,
  },
  {
    name: 'C',
    uv: 300,
    pv: 139,
    amt: 2400,
  },
  {
    name: 'D',
    uv: 200,
    pv: 980,
    amt: 2400,
  },
  {
    name: 'E',
    uv: 278,
    pv: 390,
    amt: 2400,
  },
  {
    name: 'F',
    uv: 189,
    pv: 480,
    amt: 2400,
  },
];

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

      <section className="text-xl text-slate-800 font-bold mt-24">  
        <h3 className="ml-32">
          Dados
        </h3>
      </section>

      <section className="grid grid-cols-2 gap-6">  

        <div className="text-xl text-slate-800 font-bold mt-16 ml-6">  
          <h3>
            Status
          </h3>
        </div>

        <div className="text-xl text-slate-800 font-bold mt-16 ml-6">  
          <h3>
            Temperatura
          </h3>
        </div>

        <div className="text-xl text-slate-800 font-bold mt-16 ml-6">  
          <h3>
            Aceleração
          </h3>
        </div>

        <div className="text-xl text-slate-800 font-bold mt-16 ml-6">  
          <h3>
            Sentido
          </h3>
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