const { scenarios } = require('./_sales-scenarios');

function getOutputText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') chunks.push(content.text);
    }
  }
  return chunks.join('\n');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY no está configurada en Vercel.' });

  try {
    const { scenarioId, transcript = [], profile = [] } = req.body || {};
    const scenario = scenarios[String(scenarioId)];
    if (!scenario) return res.status(400).json({ error: 'Escenario inválido.' });

    const transcriptText = transcript
      .filter(x => x && x.text)
      .map(x => `${x.role === 'agent' ? 'COMERCIAL' : 'PROPIETARIO'}: ${x.text}`)
      .join('\n');

    const prompt = `
Actúas como evaluador experto de entrenamiento comercial. Evalúa una simulación inmobiliaria con criterio exigente y basado en conductas observables. No infieras emociones, personalidad clínica ni intenciones ocultas del comercial.

CASO: ${scenario.title}
OBJETIVO: ${scenario.goal}
CONDICIÓN DE ÉXITO: ${scenario.success}
COMPETENCIAS PRIORITARIAS: ${scenario.competencies.join(', ')}

SALES CORE APLICABLE:
1. Apertura: claridad, relevancia, permiso y transición a conversación.
2. Escucha: no ignorar información, reformular, preguntar sobre lo escuchado.
3. Discovery: preguntas pertinentes, profundidad, situación, problema, consecuencias, prioridad y experiencia previa.
4. Motivación: qué quiere, por qué, por qué ahora, plazo y coste de no actuar.
5. Adaptación: ajustar enfoque a las respuestas reales del interlocutor.
6. Valor: relacionar propuesta con necesidades descubiertas; no presentar antes de comprender.
7. Objeciones: escuchar → explorar → clarificar → responder → comprobar → avanzar.
8. Cierre: proponer el siguiente paso correcto, concreto y sin presión artificial.
9. Comunicación: claridad, concisión y profesionalidad.

HISTÓRICO RECIENTE DEL USUARIO (si existe):
${JSON.stringify(profile).slice(0, 5000)}

TRANSCRIPCIÓN:
${transcriptText || '[No hay transcripción suficiente]'}

Sé exigente. Una conversación agradable no equivale a una buena venta. El resultado del caso debe depender de si realmente creó las condiciones para avanzar. Cita un momento concreto de la conversación cuando sea posible. Elige UNA prioridad principal de mejora y un siguiente reto muy concreto.
`;

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        result: { type: 'string', enum: ['success', 'partial', 'fail'] },
        score: { type: 'integer', minimum: 0, maximum: 100 },
        verdict: { type: 'string' },
        explanation: { type: 'string' },
        metrics: {
          type: 'object', additionalProperties: false,
          properties: {
            apertura: { type: 'integer', minimum: 0, maximum: 100 },
            escucha: { type: 'integer', minimum: 0, maximum: 100 },
            discovery: { type: 'integer', minimum: 0, maximum: 100 },
            objeciones: { type: 'integer', minimum: 0, maximum: 100 },
            cierre: { type: 'integer', minimum: 0, maximum: 100 }
          },
          required: ['apertura','escucha','discovery','objeciones','cierre']
        },
        strengths: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 },
        priority_skill: { type: 'string' },
        priority_reason: { type: 'string' },
        critical_quote: { type: 'string' },
        critical_analysis: { type: 'string' },
        better_response: { type: 'string' },
        next_challenge: { type: 'string' }
      },
      required: ['result','score','verdict','explanation','metrics','strengths','priority_skill','priority_reason','critical_quote','critical_analysis','better_response','next_challenge']
    };

    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-6-sol',
        input: prompt,
        reasoning: { effort: 'medium' },
        text: { format: { type: 'json_schema', name: 'sales_evaluation', strict: true, schema } }
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('Evaluation error:', upstream.status, JSON.stringify(data));
      return res.status(upstream.status).json({ error: data });
    }

    const text = getOutputText(data);
    const evaluation = JSON.parse(text);

    // Persistencia opcional: si más adelante se añaden estas variables, guardamos sesiones agregables.
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/training_sessions`, {
          method: 'POST',
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            scenario_id: scenario.id,
            scenario_title: scenario.title,
            score: evaluation.score,
            result: evaluation.result,
            priority_skill: evaluation.priority_skill,
            evaluation,
            transcript
          })
        });
      } catch (e) {
        console.warn('Supabase optional persistence failed:', e.message);
      }
    }

    return res.status(200).json(evaluation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'No se pudo evaluar la sesión.' });
  }
};
