const BASE_URL = 'https://api.deepseek.com/v1';

function getKey() {
    return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
}

export function isConfigured() {
    return !!getKey();
}

export async function chatDeepSeek({ messages, systemPrompt, onChunk, temperature = 0.7, maxTokens = 2000 }) {
    const key = getKey();
    if (!key) throw new Error('DEEPSEEK_NOT_CONFIGURED');

    const stream = typeof onChunk === 'function';

    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...messages,
            ],
            stream,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `DeepSeek API error ${response.status}`);
    }

    if (stream) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content || '';
                    if (delta) { full += delta; onChunk(delta, full); }
                } catch (_) {}
            }
        }
        return full;
    } else {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }
}

export async function quickInsight(prompt, context = '') {
    return chatDeepSeek({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: `You are Simon, the AI intelligence engine for Truvornex — a premium neighborhood services platform. Be concise, data-driven, and actionable. Use markdown. ${context}`,
        temperature: 0.6,
        maxTokens: 800,
    });
}
