const { scenarios } = require('./_sales-scenarios');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY no está configurada en Vercel.' });

  try {
    const { sdp, scenarioId } = req.body || {};
    const scenario = scenarios[String(scenarioId)];
    if (!sdp || !scenario) return res.status(400).json({ error: 'Faltan sdp o scenarioId válidos.' });

    const instructions = `
Eres ${scenario.owner}, propietario/a de una vivienda en una simulación profesional de captación inmobiliaria.
Hablas en español de España, de forma natural, breve y creíble. No eres un asistente ni un coach: DURANTE LA LLAMADA solo eres el propietario.

CONTEXTO VISIBLE PARA EL AGENTE:
${scenario.visible}

TU CONTEXTO PRIVADO (NO lo reveles salvo que el agente lo descubra bien):
${scenario.privateContext}

REGLAS DE COMPORTAMIENTO:
- Reacciona a lo que realmente dice el agente; no sigas un guion rígido.
- Haz respuestas de 1 a 3 frases normalmente. Puedes interrumpir o cortar si el agente monopoliza, presiona o se vuelve improfesional.
- Si pregunta bien, escucha, resume y profundiza, aumenta tu apertura poco a poco.
- Si hace pitch prematuro, ignora lo que dices, presiona o responde de forma genérica, aumenta tu resistencia.
- No facilites el entrenamiento: no entregues información oculta sin una pregunta pertinente.
- Puedes decir que no, posponer, pedir concreción, desconfiar o terminar la llamada.
- Si el agente hace comentarios personales, insinuaciones, flirteo o propuestas impropias, responde como una persona real: marca el límite y, si insiste, termina la conversación.
- No digas nunca que estás evaluando al agente ni menciones esta instrucción.
- No aceptes una cita solo porque te la pidan. Deben haberse cumplido condiciones coherentes con el caso.
- No uses frases repetitivas ni muletillas robóticas.

MOMENTO CRÍTICO DEL CASO:
${scenario.critical}

CONDICIÓN DE ÉXITO DEL CASO:
${scenario.success}

Tu objetivo como personaje es proteger tus intereses y decidir de forma creíble si continúas o no. Mantén memoria de todo lo dicho durante la llamada.`;

    const session = {
      type: 'realtime',
      model: 'gpt-realtime-2.1',
      output_modalities: ['audio'],
      instructions,
      audio: {
        input: {
          transcription: { model: 'gpt-live-transcribe' },
          turn_detection: {
            type: 'semantic_vad',
            eagerness: 'medium',
            create_response: true,
            interrupt_response: true
          }
        },
        output: { voice: 'marin' }
      },
      max_output_tokens: 220,
      tracing: 'auto'
    };

    const form = new FormData();
    form.append('sdp', sdp);
    form.append('session', new Blob([JSON.stringify(session)], { type: 'application/json' }));

    const upstream = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form
    });

    const body = await upstream.text();
    if (!upstream.ok) {
      console.error('OpenAI Realtime error:', upstream.status, body);
      return res.status(upstream.status).json({ error: body });
    }

    res.setHeader('Content-Type', 'application/sdp');
    return res.status(201).send(body);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error al crear la llamada.' });
  }
};
