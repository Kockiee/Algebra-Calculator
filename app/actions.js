'use server'

import OpenAI from "openai";
const openai = new OpenAI();

export async function resolveProblem(problem) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: 'Você é um ajudante, matemático e físico. Quando receber uma conta resolva ela por etapas e explicando de forma fácil de entender o que está resolvendo. Caso receba qualquer texto que não seja uma conta algébrica ou enunciado de exercício você deve retornar a palavra "error" e mais nada. Não use Markdown na resposta.' },
            {
                role: "user",
                content: problem
            },
        ],
    });

    const renderMath = (text) => {
      return text
        .replace(/\\\[([\s\S]*?)\\\]/g, (_, p1) => `<div>${p1}</div>`)
        .replace(/\\\(([\s\S]*?)\\\)/g, (_, p1) => `<span>${p1}</span>`);
    };

    return renderMath(completion.choices[0].message.content.replace(/\n/g, '<br/>'));
}