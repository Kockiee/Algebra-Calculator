'use client'
import { useEffect, useRef, useState } from 'react';
import { FaCircleInfo, FaDeleteLeft} from "react-icons/fa6";
import { resolveProblem } from './actions';
const math = require('mathjs');

export default function Home() {
  const [algebraProblem, setAlgebraProblem] = useState("");
  const [algebraProblemResult, setAlgebraProblemResult] = useState(null);
  const [algebraMode, setAlgebraMode] = useState(false);
  const [resultInput, setResultInput] = useState('');
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    setError(null);
  }, [resultInput])

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reseta a altura
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para a altura do conteúdo
    }
  };

  const handleChangeResult = (e) => {
    const { value } = e.target;

    // Regex para aceitar números, operadores matemáticos, ponto decimal e parênteses
    const regex = /^[0-9+\-*/().,]*$/;

    // Verifica se o valor atual atende ao regex
    if (value === '' || regex.test(value)) {
      setResultInput(value);
    }
  };

  const handleClear = () => {
    setResultInput('');
  };

  const handleClearEntry = () => {
    const lastEntryRemoved = resultInput.slice(0, -1);
    setResultInput(lastEntryRemoved);
  };

  const handleCalculate = () => {
    const operators = ['+', '-', '*', '/'];
    if(!resultInput.includes("=") && operators.some(char => resultInput.includes(char))){
      const result = math.evaluate(resultInput);
      setResultInput(prev => `${prev}=${result.toString()}`);
    } else {
      setError(<p className='bg-red-400 border-red-800 text-red-900 border rounded-md mt-4 p-2'>Parabéns, você conseguiu causar um erro! 🤡</p>)
    }
  };
  
  const handleResolveProblem = async() => {
    setAlgebraProblemResult(false);
    const result = await resolveProblem(algebraProblem);
    if (result === "error") {
      setAlgebraProblemResult(null);
      setError(<p className='bg-red-400 border-red-800 text-red-900 border rounded-md mt-4 p-2'>Parabéns, você conseguiu causar um erro! 🤡</p>)
    } else {
      setAlgebraProblemResult(result);
    }
  };

  const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-slate-600 space-y-4">
      <h1 className='text-3xl font-bold text-white'>Calculadora do Miguel 😎</h1>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" onClick={(e) => setAlgebraMode(e.target.checked)} value="" className="sr-only peer"/>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Modo Álgebra (com GPT-4o Integrado)</span>
      </label>
      {algebraMode ? (
        <div className='max-w-2xl w-full space-y-4'>
          <p className='bg-gray-100 border border-gray-200 p-4 rounded-md'>
            <FaCircleInfo  className='w-6 h-6 text-gray-600'/>
            Você está usando o modo álgebra! 🎉 
            Agora você pode escrever sua equação ou enunciado de física ou matemática abaixo
            e ter a resolução completa com explicações 🤯.
          </p>
          <textarea
          ref={textareaRef}
          type="text"
          value={algebraProblem}
          onChange={(e) => {
            setAlgebraProblem(e.target.value);
            setError(null);
            autoResizeTextarea();
          }}
          className="w-full p-4 active:border-none active:ring-0 rounded-md bg-green-100 text-gray-700 text-xl" 
          />
          {error}
          <button type="button" onClick={handleResolveProblem} class="focus:outline-none text-gray-600 bg-green-300 hover:bg-green-200 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md w-full py-3.5 me-2 mb-2">Resolver</button>
          {algebraProblemResult === false ? (
            <div class="flex items-center justify-center w-full borderrounded-lg">
              <div class="px-5 py-3 text-md font-medium leading-none text-center rounded-full animate-pulse bg-gray-700 dark:text-green-200">Carregando...</div>
            </div>
          ) : algebraProblemResult && (
            <div className='bg-orange-200 p-4 rounded-md' dangerouslySetInnerHTML={{ __html: algebraProblemResult }}>
            </div>
          )}
        </div>
      ) : (
      <div className="bg-black p-8 rounded-md max-w-2xl w-full">
        <input
        type="text"
        value={resultInput}
        onChange={handleChangeResult}
        className="h-16 w-full p-4 active:border-none active:ring-0 rounded-md bg-green-100 text-gray-700 text-xl" 
        />
        
        <div className='mt-4'>
          <div className="grid grid-cols-4 gap-4 font-bold">
            <button
            className="bg-blue-500 text-white p-4 rounded-md col-start-2 text-center flex justify-center"
            onClick={() => setResultInput(prev => prev.slice(0, -1))}
            >
              <FaDeleteLeft className='w-6 h-6'/>
            </button>
            <button
            className="bg-blue-500 text-white p-4 rounded-md col-start-3 flex justify-center"
            onClick={handleClear}
            >
              C
            </button>
            <button
            className="bg-blue-500 text-white p-4 rounded-md col-start-4 flex justify-center"
            onClick={handleClearEntry}
            >
              CE
            </button>
            {buttons.map((button, index) => (
              <button
                key={index} 
                className="bg-blue-500 text-white p-4 rounded-md"
                onClick={() => setResultInput(prev => prev + button)}
              >
                {button}
              </button>
            ))}
            <button
              className="bg-blue-500 text-white p-4 rounded-md"
              onClick={handleCalculate}
            >
              =
            </button>
          </div>
        </div>
      </div>
      )}
    </main>
  );
}
