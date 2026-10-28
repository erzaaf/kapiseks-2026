(function () {
  'use strict';

  const LS_KEY = 'seb_bot_gemini_key';
  const LS_MODEL = 'seb_bot_gemini_model';
  const LS_PROV = 'seb_bot_provider';
  const LS_OAIKEY = 'seb_bot_oai_key';
  const LS_OAIBASE = 'seb_bot_oai_base';
  const LS_OAIMODEL = 'seb_bot_oai_model';
  const LS_NEXT = 'seb_bot_autonext';
  const LS_AUTORUN = 'seb_bot_autorun';
  const LS_POS = 'seb_bot_pos';

  const INJECTED_KEY = (typeof window !== 'undefined' && window.__MIKOST_BOT_KEY) || '';
  const INJECTED_OAIKEY = (typeof window !== 'undefined' && window.__MIKOST_BOT_OAIKEY) || '';

  const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.6-flash'];

  const OAI_PRESETS = {
    'Groq (gratis)': { base: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-20b' },
    'OpenAI (berbayar)': { base: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  };

  const ALL_AI = [
    { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite (gratis)' },
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (gratis)' },
    { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (gratis)' },
    { id: 'groq/openai/gpt-oss-20b', label: 'Groq GPT-OSS 20B (gratis, cepat)' },
    { id: 'groq/openai/gpt-oss-120b', label: 'Groq GPT-OSS 120B (gratis, pintar)' },
    { id: 'openai/gpt-4o-mini', label: 'ChatGPT GPT-4o mini (berbayar)' },
  ];

  const DEAD_AI = {
    'groq/llama-3.3-70b-versatile': 'groq/openai/gpt-oss-20b',
    'groq/llama-3.1-8b-instant': 'groq/openai/gpt-oss-20b',
  };
  const LS_AI = 'seb_bot_ai';

  function parseAi(id) {
    if (id.indexOf('groq/') === 0)
      return { provider: 'oai', base: OAI_PRESETS['Groq (gratis)'].base, model: id.slice(5) };
    if (id.indexOf('openai/') === 0)
      return { provider: 'oai', base: OAI_PRESETS['OpenAI (berbayar)'].base, model: id.slice(7) };
    return { provider: 'gemini', base: '', model: id };
  }
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const state = {
    ai: localStorage.getItem(LS_AI) || localStorage.getItem(LS_MODEL) || MODELS[0],
    provider: localStorage.getItem(LS_PROV) || 'gemini', // 'gemini' | 'oai'
    key: localStorage.getItem(LS_KEY) || INJECTED_KEY || '',
    oaiKey: localStorage.getItem(LS_OAIKEY) || INJECTED_OAIKEY || '',
    oaiBase: localStorage.getItem(LS_OAIBASE) || OAI_PRESETS['Groq (gratis)'].base,
    oaiModel: localStorage.getItem(LS_OAIMODEL) || OAI_PRESETS['Groq (gratis)'].model,
    model: localStorage.getItem(LS_MODEL) || MODELS[0],
    keyFromProxy: !localStorage.getItem(LS_KEY) && !!INJECTED_KEY,
    autoNext: localStorage.getItem(LS_NEXT) !== '0',
    autoRun: localStorage.getItem(LS_AUTORUN) !== '0',
    busy: false,
    log: [],
  };

  (function applyAi() {
    if (DEAD_AI[state.ai]) {
      state.ai = DEAD_AI[state.ai];
      try { localStorage.setItem(LS_AI, state.ai); } catch (e) { /* abaikan */ }
    }
    // model Groq lama yang tersimpan di setting terpisah ikut dimigrasi
    if (state.oaiModel === 'llama-3.3-70b-versatile' || state.oaiModel === 'llama-3.1-8b-instant') {
      state.oaiModel = OAI_PRESETS['Groq (gratis)'].model;
      try { localStorage.setItem(LS_OAIMODEL, state.oaiModel); } catch (e) { /* abaikan */ }
    }
    const p = parseAi(state.ai);
    state.provider = p.provider;
    if (p.provider === 'oai') { state.oaiBase = p.base; state.oaiModel = p.model; }
    else { state.model = p.model; }
  })();
  function activeKey() { return state.provider === 'oai' ? state.oaiKey : state.key; }
  function aiLabel() {
    const f = ALL_AI.filter((a) => a.id === state.ai)[0];
    return f ? f.label : state.ai;
  }

  /* ---------- utils ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => min + Math.random() * (max - min);
  function clean(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }
  function norm(s) {
    return clean(s).toLowerCase().replace(/^[a-d][\.\)]\s*/, '');
  }
  function addLog(msg) {
    state.log.push(new Date().toLocaleTimeString() + ' ' + msg);
    const el = document.getElementById('seb-bot-log');
    if (el) {
      el.textContent = state.log.slice(-8).join('\n');
      el.scrollTop = el.scrollHeight;
    }
    console.log('[Mikost-BOT]', msg);
  }

  /* ---------- 1. parser  ---------- */
  function parseQuestions() {

    const roots = document.querySelectorAll('div.que.multichoice, div.que.truefalse, div.que');
    const out = [];
    roots.forEach((root, qi) => {
      const qtextEl = root.querySelector('.qtext');
      const answerBox = root.querySelector('.answer');
      if (!qtextEl || !answerBox) return;

      const optionDivs = answerBox.querySelectorAll(':scope > div');
      const options = [];
      optionDivs.forEach((div, i) => {
        const input = div.querySelector('input[type="radio"], input[type="checkbox"]');
        if (!input) return;
        const label = div.querySelector('label') || div;
  
        const numEl = label.querySelector('.answernumber');
        let text = clean(label.innerText || label.textContent || '');
        if (numEl) text = clean(text.replace(clean(numEl.innerText || ''), ''));
        if (!text) return;
        options.push({ input, text, letter: LETTERS[i] || String(i) });
      });

      if (!options.length) {
        const dropdowns = answerBox.querySelectorAll('select');
        if (dropdowns.length > 1) {
          dropdowns.forEach((select, si) => {
            const dropdownOptions = [...select.options].reduce((items, option) => {
              const text = clean(option.textContent || option.label || '');
              if (text && !option.disabled && option.value !== '') {
                items.push({
                  input: select,
                  text,
                  value: option.value,
                  letter: LETTERS[items.length] || String(items.length),
                  kind: 'dropdown',
                });
              }
              return items;
            }, []);
            if (dropdownOptions.length >= 2) {
              out.push({
                root,
                index: qi * 100 + si,
                qtext: clean(qtextEl.innerText || qtextEl.textContent || '') +
                  ` (Dropdown ${si + 1})`,
                images: [...qtextEl.querySelectorAll('img')].map((im) => im.alt || im.src).join(' | '),
                options: dropdownOptions,
                isMulti: false,
                isDropdown: true,
              });
            }
          });
          return;
        }
        const select = dropdowns[0];
        if (select) {
          [...select.options].forEach((option) => {
            const text = clean(option.textContent || option.label || '');
            if (!text || option.disabled || option.value === '') return;
            options.push({
              input: select,
              text,
              value: option.value,
              letter: LETTERS[options.length] || String(options.length),
              kind: 'dropdown',
            });
          });
        }
      }

      if (!options.length) {
        const fields = answerBox.querySelectorAll(
          'input[type="text"], input[type="number"], textarea'
        );
        fields.forEach((input, si) => {
          if (input.disabled || input.readOnly) return;
          out.push({
            root,
            index: qi * 100 + si,
            qtext: clean(qtextEl.innerText || qtextEl.textContent || '') +
              (fields.length > 1 ? ` (Isian ${si + 1})` : ''),
            images: [...qtextEl.querySelectorAll('img')].map((im) => im.alt || im.src).join(' | '),
            options: [{ input, text: 'Jawaban isian singkat', letter: 'A', kind: 'shortanswer' }],
            isMulti: false,
            isDropdown: false,
            isShortAnswer: true,
          });
        });
      }

      if (options.length < 2) return;
      out.push({
        root,
        index: qi,
        qtext: clean(qtextEl.innerText || qtextEl.textContent || ''),

        images: [...qtextEl.querySelectorAll('img')].map((im) => im.alt || im.src).join(' | '),
        options,
        isMulti: !!root.querySelector('input[type="checkbox"]'),
        isDropdown: options[0].kind === 'dropdown',
        isShortAnswer: false,
      });
    });
    return out;
  }

  /* ---------- 2. solver Gemini (gratis) ---------- */
  function buildPrompt(q) {
    if (q.isShortAnswer) {
      return (
        'Kamu mengerjakan soal isian singkat. Tentukan jawaban paling tepat berdasarkan soal. ' +
        'Jawab HANYA dengan teks jawaban yang akan dimasukkan ke kolom isian, satu baris, ' +
        'tanpa label, tanda kutip, alasan, atau format Markdown.\n\n' +
        `SOAL: ${q.qtext}${q.images ? '\nINFO GAMBAR: ' + q.images : ''}`
      );
    }
    const daftar = q.options.map((o) => `${o.letter}. ${o.text}`).join('\n');
    if (q.isMulti) {
      return (
        'Kamu mengerjakan kuis pilihan ganda yang MEMBOLEHKAN lebih dari satu jawaban benar. ' +
        'Pilih SEMUA huruf yang benar (tulis semuanya, pisahkan koma) ' +
        'dan jawab HANYA dalam format: HURUF, HURUF | alasan 1 kalimat.\n' +
        'Contoh: A, C | Karena keduanya termasuk ciri mamalia.\n\n' +
        `SOAL: ${q.qtext}${q.images ? '\nINFO GAMBAR: ' + q.images : ''}\n` +
        `PILIHAN:\n${daftar}`
      );
    }
    return (
      'Kamu mengerjakan kuis pilihan ganda. Pilih SATU jawaban paling benar ' +
      'dan jawab HANYA dalam format: HURUF | alasan 1 kalimat.\n' +
      'Contoh: B | Karena fotosintesis terjadi di kloroplas.\n\n' +
      `SOAL: ${q.qtext}${q.images ? '\nINFO GAMBAR: ' + q.images : ''}\n` +
      `PILIHAN:\n${daftar}`
    );
  }

  async function callGemini(model, q) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
      encodeURIComponent(state.key);
    const body = { contents: [{ parts: [{ text: buildPrompt(q) }] }], generationConfig: { temperature: 0.2 } };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25000), // gagal cepat (25 dtk) agar fallback langsung jalan
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      const err = new Error('Gemini [' + model + '] HTTP ' + res.status + ' ' + t.slice(0, 200));
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const text =
      (data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts.map((p) => p.text || '').join(' ')) || '';
    return clean(text);
  }

  async function callOAIonce(model, q) {
    const url = state.oaiBase.replace(/\/$/, '') + '/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + state.oaiKey },
      signal: AbortSignal.timeout(25000), // gagal cepat (25 dtk) agar fallback langsung jalan
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'Kamu pengerjakan kuis pilihan ganda. Jawab singkat sesuai format yang diminta.' },
          { role: 'user', content: buildPrompt(q) },
        ],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      const err = new Error(provLabel() + ' [' + model + '] HTTP ' + res.status + ' ' + t.slice(0, 200));
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const text = (data.choices && data.choices[0] && data.choices[0].message &&
      data.choices[0].message.content) || '';
    return clean(text);
  }

  async function callOAI(q) {
    if (!state.oaiKey) throw new Error('API key ' + provLabel() + ' kosong.');
    try {
      return await callOAIonce(state.oaiModel, q);
    } catch (e) {
      // model mati/dicabut (404) -> coba sekali dengan model default preset map
      const fallback = /groq/i.test(state.oaiBase)
        ? OAI_PRESETS['Groq (gratis)'].model
        : OAI_PRESETS['OpenAI (berbayar)'].model;
      if (e.status === 404 && state.oaiModel !== fallback) {
        addLog('Model ' + state.oaiModel + ' mati, coba ' + fallback + '...');
        state.oaiModel = fallback;
        try { localStorage.setItem(LS_OAIMODEL, fallback); } catch (err) { /* abaikan */ }
        return await callOAIonce(fallback, q);
      }
      throw e;
    }
  }

  function provLabel() {
    return state.provider === 'oai'
      ? (/groq/i.test(state.oaiBase) ? 'Groq' : 'OpenAI')
      : 'Gemini';
  }

  async function askAI(q) {
    if (state.provider === 'oai') return callOAI(q);
    return askGemini(q);
  }

  async function askGemini(q) {
    if (!state.key) throw new Error('API key Gemini kosong. Tempel key gratis di panel.');
    // coba model pilihan dulu, kalau 404 (model mati/akses ditolak) fallback otomatis
    const queue = [state.model, ...MODELS.filter((m) => m !== state.model)];
    let lastErr = null;
    for (const m of queue) {
      try {
        const out = await callGemini(m, q);
        if (m !== state.model) { state.model = m; state.ai = m; localStorage.setItem(LS_MODEL, m); localStorage.setItem(LS_AI, m); syncModelUI(); }
        return out;
      } catch (e) {
        lastErr = e;
        addLog('Model ' + m + ' gagal (' + (e.status || '?') + '), coba berikutnya...');
        // key salah / akses ditolak -> percuma coba model lain; selain itu (404 mati,
        // 429 limit, 5xx overload) lanjut fallback
        if (e.status === 400 || e.status === 401 || e.status === 403) throw e;
      }
    }
    throw lastErr;
  }

  function pickLetters(rawText, q) {

    const up = ' ' + rawText.toUpperCase() + ' ';
    let hits = [];
    q.options.forEach((o) => {
      if (up.includes(' ' + o.letter + ' ') || up.includes(' ' + o.letter + '|') ||
          up.startsWith(o.letter + ' ') || up.startsWith(o.letter + '|')) hits.push(o.letter);
    });

    const m = rawText.toUpperCase().match(/(?:JAWABAN|ANSWER)\s*[:\-]?\s*([A-Z](?:\s*,\s*[A-Z])*)/) ||
              rawText.toUpperCase().match(/\b([A-Z](?:\s*,\s*[A-Z])+)\b/);
    if (m) hits = m[1].split(',').map((s) => s.trim());

    if (hits.length === 0) {
      const nRaw = norm(rawText);
      const scored = q.options.map((o) => {
        const nOpt = norm(o.text);
        const words = nOpt.split(' ').filter((w) => w.length > 3);
        return { letter: o.letter, score: words.filter((w) => nRaw.includes(w)).length };
      });
      if (q.isMulti) {

        hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.letter);
      } else {
        const best = scored.sort((a, b) => b.score - a.score)[0];
        if (best && best.score > 0) hits = [best.letter];
      }
    }

    const valid = hits.filter((h) => q.options.some((o) => o.letter === h));
    return q.isMulti ? [...new Set(valid)] : valid.slice(0, 1);
  }

  function pickAnswerText(rawText) {
    let answer = String(rawText || '').trim();
    answer = answer.replace(/^```(?:text)?\s*/i, '').replace(/\s*```$/i, '').trim();
    answer = answer.replace(/^(?:JAWABAN|ANSWER)\s*[:\-]\s*/i, '').trim();
    return answer.split(/\r?\n/)[0].trim();
  }

  function clickOption(q, letter) {
    const opt = q.options.find((o) => o.letter === letter);
    if (!opt) return false;
    opt.input.scrollIntoView({ block: 'center' });
    opt.input.focus();

    if (opt.kind === 'dropdown') {
      opt.input.value = opt.value;
      opt.input.dispatchEvent(new Event('input', { bubbles: true }));
      opt.input.dispatchEvent(new Event('change', { bubbles: true }));
      opt.input.style.outline = '2px solid #16a34a';
      return true;
    }

    opt.input.click();
    opt.input.checked = true;
    opt.input.dispatchEvent(new Event('change', { bubbles: true }));
    const row = opt.input.closest('div');
    if (row) row.style.outline = '2px solid #16a34a';
    return true;
  }

  function fillShortAnswer(q, rawText) {
    const answer = pickAnswerText(rawText);
    if (!answer) return false;
    q.options[0].input.scrollIntoView({ block: 'center' });
    q.options[0].input.focus();
    q.options[0].input.value = answer;
    q.options[0].input.dispatchEvent(new Event('input', { bubbles: true }));
    q.options[0].input.dispatchEvent(new Event('change', { bubbles: true }));
    q.options[0].input.style.outline = '2px solid #16a34a';
    addLog('Diisi: ' + answer.slice(0, 80));
    return true;
  }

  /* ---------- 3. aksi ---------- */
  async function solveOne(q) {
    addLog(`Soal ${q.index + 1}: "${q.qtext.slice(0, 60)}..."`);
    const raw = await askAI(q);
    addLog('AI: ' + raw.slice(0, 120));
    if (q.isShortAnswer) {
      if (!fillShortAnswer(q, raw)) {
        addLog('Gagal memetakan jawaban isian. Raw: ' + raw.slice(0, 80));
        q.root.style.outline = '2px solid #dc2626';
        return false;
      }
      await sleep(rand(800, 1800));
      return true;
    }
    const letters = pickLetters(raw, q);
    if (!letters.length) {
      addLog('Gagal petakan jawaban, dilewati. Raw: ' + raw.slice(0, 80));
      q.root.style.outline = '2px solid #dc2626';
      return false;
    }
    await sleep(rand(800, 1800)); 
    letters.forEach((L) => clickOption(q, L));
    addLog(`Diklik: ${letters.join(',')}`);
    return true;
  }

  function clickNextPage() {
  
    const next = document.querySelector('input[name="next"], input.mod_quiz-next-button, #mod_quiz-next-nav');
    if (next) { addLog('Lanjut ke halaman berikut...'); next.click(); return true; }
    addLog('Tombol Next tidak ketemu (mungkin halaman terakhir).');
    return false;
  }

  async function solveAll() {
    if (state.busy) return;
    const qs = parseQuestions();
    if (!qs.length) { addLog('Waduh Mikost tutup'); return; }
    if (!activeKey()) { addLog('Isi API key ' + provLabel() + ' dulu. Parser OK: ' + qs.length + ' soal.'); return; }
    state.busy = true;
    let ok = 0;
    for (const q of qs) {
      try { if (await solveOne(q)) ok++; }
      catch (e) { addLog('Error: ' + e.message); }
      await sleep(rand(1000, 2500));
    }
    state.busy = false;
    addLog(`Selesai ${ok}/${qs.length}.`);
    if (state.autoNext && ok > 0) {
      await sleep(200); 
      clickNextPage();
    }
  }

  function highlightAll() {
    const qs = parseQuestions();
    qs.forEach((q) => { q.root.style.outline = '2px dashed #2563eb'; });
    addLog(`Terdeteksi ${qs.length} soal di halaman ini.`);
  }

  /* ---------- 4. panel  ---------- */
  function ensurePanelCSS() {
    if (document.getElementById('seb-bot-css')) return;
    const st = document.createElement('style');
    st.id = 'seb-bot-css';

    st.textContent =
      '#seb-bot-panel,#seb-bot-panel *{box-sizing:border-box !important;}' +
      '#seb-bot-panel{line-height:1.45 !important;}' +
      '#seb-bot-panel input,#seb-bot-panel select{max-width:100% !important;width:100% !important;' +
      'height:auto !important;margin:0 !important;font-size:13px !important;background:#fff !important;color:#111 !important;}' +
      '#seb-bot-panel button{font-size:13px !important;text-transform:none !important;}' +
      '#seb-bot-panel details{border:0 !important;background:none !important;padding:0 !important;}' +
      '#seb-bot-panel summary{font-size:12px !important;cursor:pointer !important;}';
    document.documentElement.appendChild(st);
  }

  function createPanel() {
    if (document.getElementById('seb-bot-panel')) return;
    ensurePanelCSS();
    const p = document.createElement('div');
    p.id = 'seb-bot-panel';
    p.style.cssText = 'position:fixed;z-index:2147483647;width:300px;' +
      'background:#fff;border:2px solid #7f1d1d;border-radius:10px;' +
      'font:13px/1.45 system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.3);color:#111;';
    // posisi terakhir (bisa digeser, tersimpan)
    try {
      const pos = JSON.parse(localStorage.getItem(LS_POS) || 'null');
      if (pos) { p.style.left = pos.left + 'px'; p.style.top = pos.top + 'px'; }
      else { p.style.right = '12px'; p.style.bottom = '12px'; }
    } catch (e) { p.style.right = '12px'; p.style.bottom = '12px'; }
    p.innerHTML =
      '<div id="seb-bot-head" style="cursor:move;background:#7f1d1d;color:#fff;padding:6px 10px;' +
      'border-radius:7px 7px 0 0;display:flex;justify-content:space-between;align-items:center">' +
      '<b>Cekidot</b>' +
      '<button id="seb-bot-min" style="background:none;border:0;color:#fff;font-size:15px;cursor:pointer">–</button></div>' +
      '<div id="seb-bot-body" style="padding:10px 12px">' +
      '<div style="margin:0 0 6px"><input id="Mikost" type="password" placeholder="API key" ' +
      'style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px"></div>' +
      '<div style="margin:0 0 6px"><select id="seb-bot-model" ' +
      'style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px">' +
      ALL_AI.map((a) => '<option value="' + a.id + '">' + a.label + '</option>').join('') +
      '</select></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button id="seb-bot-check" style="flex:1;padding:6px;background:#e5e7eb;border:0;border-radius:6px;cursor:pointer">Cek soal</button>' +
      '<button id="seb-bot-test" style="flex:1;padding:6px;background:#e5e7eb;border:0;border-radius:6px;cursor:pointer">Tes key</button>' +
      '<button id="seb-bot-run" style="flex:1;padding:6px;background:#7f1d1d;color:#fff;border:0;border-radius:6px;cursor:pointer">Jawab</button>' +
      '</div>' +
      '<label style="display:flex;gap:6px;align-items:center;font-size:12px;margin:6px 0 0">' +
      '<input id="seb-bot-next" type="checkbox" style="width:auto !important"' + (state.autoNext ? ' checked' : '') + '> Auto-lanjut 0,2 dtk</label>' +
      '<label style="display:flex;gap:6px;align-items:center;font-size:12px;margin:6px 0 0">' +
      '<input id="seb-bot-autorun" type="checkbox" style="width:auto !important"' + (state.autoRun ? ' checked' : '') + '> Auto-jawab saat halaman dibuka</label>' +
      '<pre id="seb-bot-log" style="margin:8px 0 0;max-height:110px;overflow:auto;background:#f8fafc;' +
      'border:1px solid #e2e8f0;border-radius:6px;padding:6px;white-space:pre-wrap;font-size:11px"></pre>' +
      '<div style="margin-top:6px;font-size:11px;color:#555">Mode semi-auto. Selalu cek ulang sebelum Submit.</div>' +
      '</div>';
    document.documentElement.appendChild(p);
    const keyInput = p.querySelector('#Mikost');
    keyInput.value = activeKey();
    keyInput.placeholder = state.provider === 'oai' ? 'API key Groq/OpenAI' : 'API key Gemini';
    keyInput.addEventListener('change', () => {
      const v = keyInput.value.trim();
      if (state.provider === 'oai') {
        state.oaiKey = v;
        localStorage.setItem(LS_OAIKEY, v);
      } else {
        state.key = v;
        state.keyFromProxy = false;
        localStorage.setItem(LS_KEY, v);
      }
      addLog(v ? 'API key tersimpan.' : 'API key dikosongkan.');
    });
    syncModelUI();
    syncProvUI();
    // elemen di bawah opsional (hanya ada bila lipatan lanjutan ditampilkan)
    ['#seb-bot-prov', '#seb-bot-oaipreset', '#seb-bot-oaibase',
     '#seb-bot-oaimodel', '#seb-bot-oaikey', '#seb-bot-seb'].forEach((sel) => {
      if (!p.querySelector(sel)) return;
      if (sel === '#seb-bot-prov') p.querySelector(sel).onchange = (e) => {
        state.provider = e.target.value;
        localStorage.setItem(LS_PROV, state.provider);
        syncProvUI();
        keyInput.value = activeKey();
        keyInput.placeholder = state.provider === 'oai' ? 'API key Groq/OpenAI' : 'API key Gemini';
        addLog('Provider: ' + provLabel());
      };
      if (sel === '#seb-bot-oaipreset') p.querySelector(sel).onchange = (e) => {
        const pr = OAI_PRESETS[e.target.value];
        if (pr) {
          state.oaiBase = pr.base; state.oaiModel = pr.model;
          localStorage.setItem(LS_OAIBASE, pr.base);
          localStorage.setItem(LS_OAIMODEL, pr.model);
          syncOaiInputs();
          addLog('Preset: ' + e.target.value);
        }
      };
      if (sel === '#seb-bot-oaibase') p.querySelector(sel).onchange = (e) => {
        state.oaiBase = e.target.value.trim();
        localStorage.setItem(LS_OAIBASE, state.oaiBase);
      };
      if (sel === '#seb-bot-oaimodel') p.querySelector(sel).onchange = (e) => {
        state.oaiModel = e.target.value.trim();
        localStorage.setItem(LS_OAIMODEL, state.oaiModel);
      };
      if (sel === '#seb-bot-oaikey') p.querySelector(sel).onchange = (e) => {
        state.oaiKey = e.target.value.trim();
        localStorage.setItem(LS_OAIKEY, state.oaiKey);
        addLog(state.oaiKey ? 'API key tersimpan.' : 'API key dikosongkan.');
      };
      if (sel === '#seb-bot-seb') p.querySelector(sel).onchange = readSebFile;
    });
    p.querySelector('#seb-bot-model').onchange = (e) => {
      state.ai = e.target.value;
      localStorage.setItem(LS_AI, state.ai);
      const pr = parseAi(state.ai);
      state.provider = pr.provider;
      localStorage.setItem(LS_PROV, pr.provider);
      if (pr.provider === 'oai') {
        state.oaiBase = pr.base; state.oaiModel = pr.model;
        localStorage.setItem(LS_OAIBASE, pr.base);
        localStorage.setItem(LS_OAIMODEL, pr.model);
      } else {
        state.model = pr.model;
        localStorage.setItem(LS_MODEL, pr.model);
      }
      keyInput.value = activeKey();
      keyInput.placeholder = pr.provider === 'oai' ? 'API key Groq/OpenAI' : 'API key Gemini';
      syncProvUI();
      addLog('AI: ' + aiLabel());
    };
    p.querySelector('#seb-bot-next').onchange = (e) => {
      state.autoNext = e.target.checked;
      localStorage.setItem(LS_NEXT, state.autoNext ? '1' : '0');
      addLog('Auto-lanjut: ' + (state.autoNext ? 'ON' : 'OFF'));
    };
    p.querySelector('#seb-bot-autorun').onchange = (e) => {
      state.autoRun = e.target.checked;
      localStorage.setItem(LS_AUTORUN, state.autoRun ? '1' : '0');
      addLog('Auto-jawab: ' + (state.autoRun ? 'ON' : 'OFF'));
    };
    p.querySelector('#seb-bot-check').onclick = highlightAll;
    p.querySelector('#seb-bot-test').onclick = testKey;
    p.querySelector('#seb-bot-run').onclick = solveAll;
    p.querySelector('#seb-bot-min').onclick = () => {
      const b = p.querySelector('#seb-bot-body');
      const hidden = b.style.display === 'none';
      b.style.display = hidden ? '' : 'none';
      p.querySelector('#seb-bot-min').textContent = hidden ? '–' : '+';
    };
    makeDraggable(p, p.querySelector('#seb-bot-head'));
  }

  function makeDraggable(panel, handle) {
    let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
    handle.addEventListener('mousedown', (e) => {
      drag = true;
      const r = panel.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
      panel.style.left = ox + 'px'; panel.style.top = oy + 'px';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!drag) return;
      panel.style.left = Math.max(0, ox + e.clientX - sx) + 'px';
      panel.style.top = Math.max(0, oy + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = false;
      try {
        localStorage.setItem(LS_POS, JSON.stringify({
          left: parseInt(panel.style.left, 10), top: parseInt(panel.style.top, 10),
        }));
      } catch (e) { /* abaikan */ }
    });
  }

  function readSebFile(e) {
    const f = e.target.files && e.target.files[0];
    const info = document.getElementById('seb-bot-sebinfo');
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const txt = String(rd.result || '');
        const doc = new DOMParser().parseFromString(txt, 'text/xml');
        const dict = doc.querySelector('plist > dict');
        let startURL = '', examKey = '';
        if (dict) {
          const keys = [...dict.children];
          for (let i = 0; i < keys.length; i += 2) {
            const k = keys[i] && clean(keys[i].textContent);
            const v = keys[i + 1] && clean(keys[i + 1].textContent);
            if (k === 'startURL') startURL = v;
            if (/examkey/i.test(k)) examKey = v;
          }
        }
        // fallback regex bila struktur plist tak standar / terenkripsi sebagian
        if (!startURL) {
          const m = txt.match(/https?:\/\/kuliah\.itera\.ac\.id[^\s<"]*/);
          if (m) startURL = m[0];
        }
        if (startURL) {
          info.innerHTML = 'startURL: <a href="' + startURL + '" target="_blank">' +
            startURL.slice(0, 60) + '</a><br>' +
            'Bot berlaku untuk SEMUA file .seb di host ini (injeksi per-host). ' +
            '<button id="seb-bot-goto" style="margin-top:4px;padding:4px 8px;cursor:pointer">Buka quiz ini</button>';
          addLog('SEB dibaca: ' + f.name);
          const go = document.getElementById('seb-bot-goto');
          if (go) go.onclick = () => { window.location.href = startURL; };
        } else {
          info.textContent = 'startURL tidak ketemu. File mungkin terenkripsi — bot tetap jalan untuk quiz yang sedang dibuka.';
          addLog('SEB terenkripsi/tak terbaca, lewati.');
        }
      } catch (err) { info.textContent = 'Gagal baca file: ' + err.message; }
    };
    rd.readAsText(f);
  }

  function syncProvUI() {
    const prov = document.getElementById('seb-bot-prov');
    const gem = document.getElementById('seb-bot-gemrow');
    const oai = document.getElementById('seb-bot-oairow');
    if (prov) prov.value = state.provider;
    if (gem) gem.style.display = state.provider === 'oai' ? 'none' : '';
    if (oai) oai.style.display = state.provider === 'oai' ? '' : 'none';
    syncOaiInputs();
  }

  function syncOaiInputs() {
    const b = document.getElementById('seb-bot-oaibase');
    const m = document.getElementById('seb-bot-oaimodel');
    const k = document.getElementById('seb-bot-oaikey');
    if (b && !b.value) b.value = state.oaiBase;
    if (m && !m.value) m.value = state.oaiModel;
    if (k && !k.value) k.value = state.oaiKey;
  }

  function syncModelUI() {
    const sel = document.getElementById('seb-bot-model');
    if (sel && ![...sel.options].some((o) => o.value === state.ai)) {
      const opt = document.createElement('option');
      opt.value = opt.textContent = state.ai;
      sel.appendChild(opt);
    }
    if (sel) sel.value = state.ai;
  }

  async function testKey() {
    if (!activeKey()) { addLog('Isi API key dulu.'); return; }
    addLog('Tes key ke ' + aiLabel() + '...');
    try {
      const out = await askAI({
        qtext: 'Tes koneksi, jawab: A | ok.',
        images: '', isMulti: false,
        options: [{ letter: 'A', text: 'ok' }, { letter: 'B', text: 'gagal' }],
      });
      addLog('Key OK (' + aiLabel() + '). Respon: ' + out.slice(0, 100));
    } catch (e) {
      addLog('Tes gagal: ' + e.message);
    }
  }


  createPanel();
  new MutationObserver(() => {
    if (!document.getElementById('Mikost')) createPanel();
  }).observe(document.documentElement, { childList: true, subtree: false });
  if (state.keyFromProxy) {
    keyInputSync();
    addLog('Mikost siap. Key dimuat otomatis dari proxy.');
  } else {
    addLog('Mikost siap.');
  }
  if (state.autoRun) {
    setTimeout(() => {
      if (!state.busy) solveAll();
    }, 1000);
  }

  function keyInputSync() {
    const el = document.getElementById('Mikost');
    if (el) el.value = activeKey();
  }
})();
