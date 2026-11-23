/* Noor Hifz — single-page app (vanilla JS + Supabase) */
(() => {
  const CFG = window.APP_CONFIG || {};
  const LANGS = { en: 'English', ar: 'العربية', sq: 'Shqip', bs: 'Bosanski', bg: 'Български', hr: 'Hrvatski', cs: 'Čeština', da: 'Dansk', nl: 'Nederlands', fi: 'Suomi', fr: 'Français', de: 'Deutsch', el: 'Ελληνικά', hu: 'Magyar', it: 'Italiano', no: 'Norsk', pl: 'Polski', pt: 'Português', ro: 'Română', ru: 'Русский', sr: 'Српски', es: 'Español', sv: 'Svenska', uk: 'Українська', bn: 'বাংলা', zh: '中文', fil: 'Filipino', hi: 'हिन्दी', id: 'Bahasa Indonesia', ja: '日本語', ko: '한국어', ms: 'Bahasa Melayu', fa: 'فارسی', th: 'ไทย', tr: 'Türkçe', ur: 'اردو', vi: 'Tiếng Việt', az: 'Azərbaycanca', my: 'မြန်မာ', prs: 'دری', gu: 'ગુજરાતી', jv: 'Basa Jawa', kn: 'ಕನ್ನಡ', kk: 'Қазақша', km: 'ខ្មែរ', ku: 'Kurdî (Kurmancî)', ckb: 'کوردی (سۆرانی)', ky: 'Кыргызча', ml: 'മലയാളം', mr: 'मराठी', ne: 'नेपाली', ps: 'پښتو', pa: 'ਪੰਜਾਬੀ', sd: 'سنڌي', si: 'සිංහල', tg: 'Тоҷикӣ', ta: 'தமிழ்', tt: 'Татарча', te: 'తెలుగు', tk: 'Türkmençe', ug: 'ئۇيغۇرچە', uz: 'Oʻzbekcha', am: 'አማርኛ', ff: 'Pulaar / Fulfulde', ha: 'Hausa', om: 'Afaan Oromoo', so: 'Soomaali', sw: 'Kiswahili', ti: 'ትግርኛ', wo: 'Wolof', yo: 'Yorùbá', zu: 'isiZulu' };
  const SERVICES = ['noorani', 'tajweed', 'hifz', 'recitation', 'revision'];

  let sb = null, me = null, profile = null, DEMO = false;
  const DEMO_TEACHERS = [
    { id: 'demo1', full_name: 'Ahmad Hassan', country: 'Egypt', gender: 'male', bio: 'Azhar graduate with 10 years of experience teaching non-Arabic speakers, patient and step by step.', languages: ['en', 'ar'], services: ['noorani', 'tajweed', 'hifz'], price_per_hour: 8, years_experience: 10, has_ijazah: true, is_verified: true, avg_rating: 4.9, rating_count: 37 },
    { id: 'demo2', full_name: 'Fatima Zahra', country: 'Morocco', gender: 'female', bio: 'Teaches sisters and children. Fluent in French and English.', languages: ['fr', 'en', 'ar'], services: ['noorani', 'recitation', 'revision'], price_per_hour: 6, years_experience: 6, has_ijazah: true, is_verified: true, avg_rating: 4.7, rating_count: 21 },
    { id: 'demo3', full_name: 'Yusuf Rahman', country: 'Indonesia', gender: 'male', bio: 'Memorization plans for beginners, with weekly revision.', languages: ['id', 'en'], services: ['hifz', 'revision'], price_per_hour: 5, years_experience: 4, has_ijazah: false, is_verified: false, avg_rating: 4.3, rating_count: 9 },
    { id: 'demo4', full_name: 'Omar Khalid', country: 'Jordan', gender: 'male', bio: '', languages: ['ar', 'tr'], services: ['tajweed'], price_per_hour: null, years_experience: 2, has_ijazah: false, is_verified: false, avg_rating: 0, rating_count: 0 }
  ];
  const DEMO_REVIEWS = [
    { stars: 5, student_name: 'Daniel', student_country: 'UK', comment: 'Very patient teacher, I learned to read in two months.' },
    { stars: 5, student_name: 'Aisha', student_country: 'USA', comment: 'Clear explanations and flexible times.' }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initial = n => esc((n || '?').trim().charAt(0).toUpperCase());
  const digits = s => String(s || '').replace(/\D/g, '').replace(/^00/, '');
  const validWa = s => /^\d{8,15}$/.test(digits(s));

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  const stars = (v, n) => {
    v = Number(v) || 0;
    if (!n) return `<span class="stars-wrap"><span class="tag gold">${esc(t('new_teacher'))}</span></span>`;
    return `<span class="stars-wrap"><span class="stars" style="--p:${(v / 5 * 100).toFixed(0)}%" aria-label="${v}/5">★★★★★</span><b>${v.toFixed(1)}</b><small>(${n})</small></span>`;
  };

  const starInput = (name, val) =>
    `<div class="star-input" data-name="${name}" data-val="${val || 0}">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-v="${i}" class="${i <= (val || 0) ? 'on' : ''}" aria-label="${i}">★</button>`).join('')}</div>`;

  function bindStarInputs(root) {
    $$('.star-input', root).forEach(box => {
      box.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        const v = +b.dataset.v;
        box.dataset.val = v;
        $$('button', box).forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
      });
    });
  }

  /* ---------- Layout ---------- */
  function shell(inner) {
    const loggedIn = !!me;
    return `
    <header class="top"><div class="container">
      <a class="logo" href="#/"><img src="icon.svg?v=1" alt=""><span>${esc(t('name'))}</span></a>
      <nav>
        <a href="#/teachers">${esc(t('nav_teachers'))}</a>
        ${loggedIn
          ? `<a href="#/dashboard">${esc(t('nav_dashboard'))}</a><button id="logout">${esc(t('nav_logout'))}</button>`
          : `<a href="#/login">${esc(t('nav_login'))}</a><a class="pill" href="#/signup">${esc(t('nav_signup'))}</a>`}
        <select id="langSel" aria-label="Language" style="width:auto;padding:6px 8px;font-size:.88rem;border-radius:10px;border:0;background:rgba(255,255,255,.16);color:#fff">${Object.entries(LANGS).filter(([k]) => I18N[k]).map(([k, v]) => `<option value="${k}" ${k === LANG ? 'selected' : ''} style="color:#16231c">${esc(v)}</option>`).join('')}</select>
      </nav>
    </div></header>
    ${DEMO ? `<div style="background:#fbf3d4;color:#6b5600;text-align:center;padding:8px 12px;font-size:.85rem">${esc(t('demo_banner'))}</div>` : ''}
    <main><div class="container" id="view">${inner}</div></main>
    <footer>${esc(t('footer'))}</footer>`;
  }

  function mount(inner, opts = {}) {
    const app = $('#app');
    app.innerHTML = opts.hero ? shell('').replace('<main><div class="container" id="view"></div></main>', inner) : shell(inner);
    $('#langSel').onchange = e => { setLang(e.target.value); route(); };
    const lo = $('#logout');
    if (lo) lo.onclick = async () => { await sb.auth.signOut(); location.hash = '#/'; };
    window.scrollTo(0, 0);
  }

  /* ---------- Session ---------- */
  async function loadSession(session) {
    me = session?.user || null;
    profile = null;
    if (me) {
      const { data } = await sb.from('profiles').select('*').eq('id', me.id).maybeSingle();
      profile = data;
    }
  }

  /* ---------- Pages ---------- */
  function pHome() {
    mount(`
      <section class="hero"><div class="container">
        <div class="gold-line"></div>
        <h1>${esc(t('hero_title'))}</h1>
        <p>${esc(t('hero_sub'))}</p>
        <div class="btn-row">
          <a class="btn gold" href="#/teachers">${esc(t('cta_find'))}</a>
          <a class="btn ghost" href="#/signup?role=teacher">${esc(t('cta_teach'))}</a>
        </div>
      </div></section>
      <section class="container" style="padding-block:36px">
        <h2 class="section-title">${esc(t('how_title'))}</h2>
        <div class="steps">
          ${[1, 2, 3].map(i => `<div class="card step"><div class="num">${i}</div><h3>${esc(t('step' + i + '_t'))}</h3><p>${esc(t('step' + i + '_d'))}</p></div>`).join('')}
        </div>
        <div class="notice">${esc(t('note_external'))}</div>
      </section>`, { hero: true });
  }

  function teacherCard(x) {
    const svc = (x.services || []).map(s => `<span class="tag">${esc(t('svc_' + s))}</span>`).join('');
    const langs = (x.languages || []).map(l => esc(LANGS[l] || l)).join(' · ');
    return `
    <article class="card tcard">
      <div class="head">
        <div class="avatar">${initial(x.full_name)}</div>
        <div>
          <h3>${esc(x.full_name)} ${x.is_verified ? `<span class="badge">✓ ${esc(t('verified'))}</span>` : ''}</h3>
          <div class="sub">${esc(x.country || '')}${x.years_experience ? ` · ${x.years_experience} ${esc(t('years'))}` : ''}</div>
          ${stars(x.avg_rating, x.rating_count)}
        </div>
      </div>
      <div class="tags">${x.has_ijazah ? `<span class="tag gold">${esc(t('ijazah'))}</span>` : ''}${svc}</div>
      ${langs ? `<div class="sub">🗣 ${langs}</div>` : ''}
      <div class="foot">
        <span class="price">${x.price_per_hour != null ? `$${Number(x.price_per_hour)} ${esc(t('per_hour'))}` : esc(t('free_price'))}</span>
        <a class="btn small" href="#/teacher/${x.id}">${esc(t('view_profile'))}</a>
      </div>
    </article>`;
  }

  async function pTeachers() {
    mount(`<h2 class="section-title">${esc(t('teachers_title'))}</h2>
      <div class="filters">
        <input id="fq" placeholder="${esc(t('search_ph'))}">
        <select id="fl"><option value="">${esc(t('all_langs'))}</option>${Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>
        <select id="fs"><option value="">${esc(t('all_services'))}</option>${SERVICES.map(s => `<option value="${s}">${esc(t('svc_' + s))}</option>`).join('')}</select>
        <select id="fr"><option value="0">${esc(t('min_rating'))}: ${esc(t('any'))}</option>${[4.5, 4, 3].map(v => `<option value="${v}">★ ${v}+</option>`).join('')}</select>
        <select id="fg"><option value="">${esc(t('any_gender'))}</option><option value="male">${esc(t('male'))}</option><option value="female">${esc(t('female'))}</option></select>
      </div>
      <div id="grid" class="grid"><div class="loader">${esc(t('loading'))}</div></div>`);

    const { data, error } = DEMO ? { data: DEMO_TEACHERS, error: null } : await sb.from('teachers_public').select('*')
      .order('avg_rating', { ascending: false }).order('rating_count', { ascending: false });
    if (error) { $('#grid').innerHTML = `<div class="err">${esc(error.message)}</div>`; return; }

    const draw = () => {
      const q = $('#fq').value.trim().toLowerCase(), l = $('#fl').value, s = $('#fs').value, r = +$('#fr').value, g = $('#fg').value;
      const list = data.filter(x =>
        (!q || x.full_name.toLowerCase().includes(q)) &&
        (!l || (x.languages || []).includes(l)) &&
        (!s || (x.services || []).includes(s)) &&
        (!r || Number(x.avg_rating) >= r) &&
        (!g || x.gender === g));
      $('#grid').innerHTML = list.length ? list.map(teacherCard).join('') : `<div class="empty" style="grid-column:1/-1">${esc(t('no_results'))}</div>`;
    };
    ['fq', 'fl', 'fs', 'fr', 'fg'].forEach(id => $('#' + id).addEventListener('input', draw));
    draw();
  }

  async function contactTeacher(tc, btn) {
    if (DEMO) return toast(t('demo_action'));
    if (!me) { sessionStorage.setItem('next', location.hash); location.hash = '#/login'; return; }
    if (profile?.role !== 'student') return toast(t('students_only'));
    btn.disabled = true;
    const w = window.open('', '_blank'); // نفتح النافذة فورًا لتفادي حجب المتصفح
    try {
      const { error } = await sb.from('contact_requests')
        .upsert({ student_id: me.id, teacher_id: tc.id }, { onConflict: 'student_id,teacher_id', ignoreDuplicates: true });
      if (error) throw error;
      const { data: tp, error: e2 } = await sb.from('profiles').select('whatsapp').eq('id', tc.id).single();
      if (e2) throw e2;
      const url = `https://wa.me/${digits(tp.whatsapp)}?text=${encodeURIComponent(tf('wa_msg', { teacher: tc.full_name, name: profile.full_name, country: profile.country || '' }))}`;
      if (w) w.location.href = url; else location.href = url;
    } catch (e) {
      if (w) w.close();
      toast(e.message || t('error'));
    }
    btn.disabled = false;
  }

  async function pTeacher(id) {
    mount(`<div class="loader">${esc(t('loading'))}</div>`);
    const [{ data: tc }, { data: rv }] = DEMO
      ? [{ data: DEMO_TEACHERS.find(x => x.id === id) }, { data: DEMO_REVIEWS }]
      : await Promise.all([
      sb.from('teachers_public').select('*').eq('id', id).maybeSingle(),
      sb.from('reviews_public').select('*').eq('teacher_id', id).order('created_at', { ascending: false }).limit(50)
    ]);
    if (!tc) { $('#view').innerHTML = `<div class="empty">${esc(t('no_results'))}</div>`; return; }
    const reviews = (rv || []).map(r => `
      <div class="review">
        ${stars(r.stars, 1).replace(/<b>.*?<\/b><small>.*?<\/small>/, '')}
        <div><b>${esc(r.student_name)}</b> <span class="sub">${esc(r.student_country || '')}</span></div>
        ${r.comment ? `<p>${esc(r.comment)}</p>` : ''}
      </div>`).join('');
    $('#view').innerHTML = `
      <a href="#/teachers" class="sub">${esc(t('back'))}</a>
      <div class="card" style="margin-top:12px">
        <div class="profile-head">
          <div class="avatar big">${initial(tc.full_name)}</div>
          <div>
            <h1>${esc(tc.full_name)} ${tc.is_verified ? `<span class="badge">✓ ${esc(t('verified'))}</span>` : ''}</h1>
            <div class="sub">${esc(tc.country || '')}${tc.years_experience ? ` · ${tc.years_experience} ${esc(t('years'))}` : ''}</div>
            ${stars(tc.avg_rating, tc.rating_count)}
          </div>
        </div>
        <div class="kv">
          ${tc.bio ? `<div><h3>${esc(t('bio'))}</h3><p>${esc(tc.bio).replace(/\n/g, '<br>')}</p></div>` : ''}
          <div class="tags">${tc.has_ijazah ? `<span class="tag gold">${esc(t('ijazah'))}</span>` : ''}${(tc.services || []).map(s => `<span class="tag">${esc(t('svc_' + s))}</span>`).join('')}</div>
          ${(tc.languages || []).length ? `<div><h3>${esc(t('languages'))}</h3><p>${tc.languages.map(l => esc(LANGS[l] || l)).join(' · ')}</p></div>` : ''}
          <div class="price" style="font-size:1.2rem">${tc.price_per_hour != null ? `$${Number(tc.price_per_hour)} ${esc(t('per_hour'))}` : esc(t('free_price'))}</div>
          <button class="btn wa block" id="contact">💬 ${esc(t('contact_wa'))}</button>
          <div class="notice" style="margin:0">${esc(t('note_external'))}</div>
        </div>
      </div>
      <div class="card" style="margin-top:16px"><h3 style="margin-bottom:10px">${esc(t('reviews'))}</h3>${reviews || `<div class="empty">${esc(t('no_reviews'))}</div>`}</div>`;
    $('#contact').onclick = e => contactTeacher(tc, e.currentTarget);
  }

  function pLogin() {
    mount(`<div class="card form-card"><h2>${esc(t('login'))}</h2>
      <div id="msg"></div>
      <form id="f">
        <div class="field"><label>${esc(t('email'))}</label><input type="email" name="email" required autocomplete="email"></div>
        <div class="field"><label>${esc(t('password'))}</label><input type="password" name="password" required minlength="6" autocomplete="current-password"></div>
        <button class="btn block" type="submit">${esc(t('login'))}</button>
      </form>
      <div class="alt">${esc(t('no_account'))} <a href="#/signup">${esc(t('nav_signup'))}</a></div></div>`);
    $('#f').onsubmit = async e => {
      e.preventDefault();
      if (DEMO) return toast(t('demo_action'));
      const f = new FormData(e.target), btn = $('button', e.target);
      btn.disabled = true;
      const { error } = await sb.auth.signInWithPassword({ email: f.get('email').trim(), password: f.get('password') });
      btn.disabled = false;
      if (error) return ($('#msg').innerHTML = `<div class="err">${esc(error.message)}</div>`);
      const next = sessionStorage.getItem('next');
      sessionStorage.removeItem('next');
      setTimeout(() => (location.hash = next || '#/dashboard'), 50);
    };
  }

  function pSignup(query) {
    const preRole = new URLSearchParams(query || '').get('role') === 'teacher' ? 'teacher' : 'student';
    mount(`<div class="card form-card"><h2>${esc(t('signup'))}</h2>
      <div id="msg"></div>
      <form id="f">
        <div class="field"><label>${esc(t('i_am'))}</label>
          <div class="seg">
            <label><input type="radio" name="role" value="student" ${preRole === 'student' ? 'checked' : ''}><span>${esc(t('student'))}</span></label>
            <label><input type="radio" name="role" value="teacher" ${preRole === 'teacher' ? 'checked' : ''}><span>${esc(t('teacher'))}</span></label>
          </div></div>
        <div class="field"><label>${esc(t('full_name'))}</label><input name="full_name" required maxlength="100"></div>
        <div class="row2">
          <div class="field"><label>${esc(t('country'))}</label><input name="country" required maxlength="80"></div>
          <div class="field"><label>${esc(t('gender'))}</label><select name="gender"><option value="male">${esc(t('male'))}</option><option value="female">${esc(t('female'))}</option></select></div>
        </div>
        <div class="field"><label>${esc(t('whatsapp'))}</label><input name="whatsapp" inputmode="tel" required placeholder="201012345678"><div class="hint">${esc(t('whatsapp_hint'))}</div></div>
        <div class="field"><label>${esc(t('email'))}</label><input type="email" name="email" required autocomplete="email"></div>
        <div class="field"><label>${esc(t('password'))}</label><input type="password" name="password" required minlength="6" autocomplete="new-password"></div>
        <button class="btn block" type="submit">${esc(t('signup'))}</button>
      </form>
      <div class="alt">${esc(t('have_account'))} <a href="#/login">${esc(t('login'))}</a></div></div>`);
    $('#f').onsubmit = async e => {
      e.preventDefault();
      if (DEMO) return toast(t('demo_action'));
      const f = new FormData(e.target), btn = $('button', e.target);
      if (!validWa(f.get('whatsapp'))) return ($('#msg').innerHTML = `<div class="err">${esc(t('bad_whatsapp'))}</div>`);
      btn.disabled = true;
      const { data, error } = await sb.auth.signUp({
        email: f.get('email').trim(), password: f.get('password'),
        options: { data: { role: f.get('role'), full_name: f.get('full_name').trim(), country: f.get('country').trim(), gender: f.get('gender'), whatsapp: digits(f.get('whatsapp')) } }
      });
      btn.disabled = false;
      if (error) return ($('#msg').innerHTML = `<div class="err">${esc(error.message)}</div>`);
      if (!data.session) return ($('#msg').innerHTML = `<div class="notice">${esc(t('check_email'))}</div>`);
      setTimeout(() => (location.hash = '#/dashboard'), 50);
    };
  }

  /* ---------- Dashboard ---------- */
  function profileForm() {
    const p = profile, isT = p.role === 'teacher';
    return `<div class="card"><h3 style="margin-bottom:12px">${esc(t('my_profile'))}</h3>
      <form id="pf">
        <div class="row2">
          <div class="field"><label>${esc(t('full_name'))}</label><input name="full_name" value="${esc(p.full_name)}" required maxlength="100"></div>
          <div class="field"><label>${esc(t('country'))}</label><input name="country" value="${esc(p.country)}" maxlength="80"></div>
        </div>
        <div class="row2">
          <div class="field"><label>${esc(t('whatsapp'))}</label><input name="whatsapp" inputmode="tel" value="${esc(p.whatsapp)}" required></div>
          <div class="field"><label>${esc(t('gender'))}</label><select name="gender"><option value="male" ${p.gender === 'male' ? 'selected' : ''}>${esc(t('male'))}</option><option value="female" ${p.gender === 'female' ? 'selected' : ''}>${esc(t('female'))}</option></select></div>
        </div>
        ${isT ? `
        <div class="field"><label>${esc(t('bio'))}</label><textarea name="bio" maxlength="1000">${esc(p.bio)}</textarea></div>
        <div class="row2">
          <div class="field"><label>${esc(t('experience'))}</label><input type="number" min="0" max="80" name="years_experience" value="${p.years_experience ?? ''}"></div>
          <div class="field"><label>${esc(t('price'))}</label><input type="number" min="0" step="0.5" name="price_per_hour" value="${p.price_per_hour ?? ''}"></div>
        </div>
        <div class="field"><label>${esc(t('languages'))}</label><div class="checks">${Object.entries(LANGS).map(([k, v]) => `<label><input type="checkbox" name="languages" value="${k}" ${(p.languages || []).includes(k) ? 'checked' : ''}>${esc(v)}</label>`).join('')}</div></div>
        <div class="field"><label>${esc(t('services'))}</label><div class="checks">${SERVICES.map(s => `<label><input type="checkbox" name="services" value="${s}" ${(p.services || []).includes(s) ? 'checked' : ''}>${esc(t('svc_' + s))}</label>`).join('')}</div></div>
        <div class="field"><label class="switch"><input type="checkbox" name="has_ijazah" ${p.has_ijazah ? 'checked' : ''}>${esc(t('has_ijazah'))}</label></div>
        <div class="field"><label class="switch"><input type="checkbox" name="is_active" ${p.is_active ? 'checked' : ''}>${esc(t('is_active'))}</label></div>` : ''}
        <button class="btn" type="submit">${esc(t('save'))}</button>
      </form></div>`;
  }

  function bindProfileForm() {
    $('#pf').onsubmit = async e => {
      e.preventDefault();
      const f = new FormData(e.target), isT = profile.role === 'teacher';
      if (!validWa(f.get('whatsapp'))) return toast(t('bad_whatsapp'));
      const upd = { full_name: f.get('full_name').trim(), country: (f.get('country') || '').trim(), whatsapp: digits(f.get('whatsapp')), gender: f.get('gender') };
      if (isT) {
        Object.assign(upd, {
          bio: (f.get('bio') || '').trim() || null,
          years_experience: f.get('years_experience') === '' ? null : +f.get('years_experience'),
          price_per_hour: f.get('price_per_hour') === '' ? null : +f.get('price_per_hour'),
          languages: f.getAll('languages'), services: f.getAll('services'),
          has_ijazah: f.has('has_ijazah'), is_active: f.has('is_active')
        });
      }
      const { data, error } = await sb.from('profiles').update(upd).eq('id', me.id).select().single();
      if (error) return toast(error.message);
      profile = data;
      toast(t('saved'));
    };
  }

  async function dashStudent() {
    const { data: reqs } = await sb.from('contact_requests').select('teacher_id,created_at').eq('student_id', me.id).order('created_at', { ascending: false });
    const ids = (reqs || []).map(r => r.teacher_id);
    let teachers = [], mine = [];
    if (ids.length) {
      [{ data: teachers }, { data: mine }] = await Promise.all([
        sb.from('profiles').select('id,full_name,country').in('id', ids),
        sb.from('ratings').select('*').eq('student_id', me.id)
      ]);
    }
    const tmap = Object.fromEntries((teachers || []).map(x => [x.id, x]));
    const rmap = Object.fromEntries((mine || []).map(x => [x.teacher_id, x]));
    const items = (reqs || []).map(r => {
      const tc = tmap[r.teacher_id]; if (!tc) return '';
      const rt = rmap[r.teacher_id];
      return `<div class="list-item" data-tid="${tc.id}">
        <div style="display:flex;gap:10px;align-items:center"><div class="avatar" style="width:44px;height:44px;font-size:1.2rem">${initial(tc.full_name)}</div>
          <div><a href="#/teacher/${tc.id}"><b>${esc(tc.full_name)}</b></a><div class="sub">${esc(tc.country || '')}</div></div></div>
        <div class="rate-box"><div class="sub" style="margin-bottom:4px">${esc(t('rate_hint'))}</div>
          ${starInput('stars', rt?.stars || 0)}
          <textarea placeholder="${esc(t('your_comment'))}" maxlength="500" style="margin:8px 0;min-height:64px">${esc(rt?.comment || '')}</textarea>
          <button class="btn small save-rate">${esc(t('save'))}</button></div>
      </div>`;
    }).join('');
    return `<div class="card"><h3 style="margin-bottom:8px">${esc(t('my_teachers'))}</h3>${items || `<div class="empty">${esc(t('no_teachers_yet'))}</div>`}</div>`;
  }

  async function dashTeacher() {
    const [{ data: rts }, { data: reqs }] = await Promise.all([
      sb.from('ratings').select('stars').eq('teacher_id', me.id),
      sb.from('contact_requests').select('student_id,created_at').eq('teacher_id', me.id).order('created_at', { ascending: false })
    ]);
    const n = (rts || []).length, avg = n ? rts.reduce((a, b) => a + b.stars, 0) / n : 0;
    const ids = (reqs || []).map(r => r.student_id);
    let studs = [];
    if (ids.length) ({ data: studs } = await sb.from('profiles').select('id,full_name,country,whatsapp').in('id', ids));
    const smap = Object.fromEntries((studs || []).map(x => [x.id, x]));
    const items = (reqs || []).map(r => {
      const s = smap[r.student_id]; if (!s) return '';
      return `<div class="list-item"><div><b>${esc(s.full_name)}</b><div class="sub">${esc(s.country || '')} · ${new Date(r.created_at).toLocaleDateString(LANG)}</div></div>
        <a class="btn wa small" target="_blank" rel="noopener" href="https://wa.me/${digits(s.whatsapp)}">💬 ${esc(t('chat_student'))}</a></div>`;
    }).join('');
    return `<div class="stats"><div class="card stat"><b>${n ? avg.toFixed(1) : '–'}</b>${esc(t('stat_rating'))}</div><div class="card stat"><b>${ids.length}</b>${esc(t('stat_students'))}</div></div>
      <div class="card"><h3 style="margin-bottom:8px">${esc(t('requests_title'))}</h3>${items || `<div class="empty">${esc(t('no_requests'))}</div>`}</div>`;
  }

  async function pDashboard() {
    if (!me) { if (!DEMO) sessionStorage.setItem('next', '#/dashboard'); location.hash = '#/login'; return; }
    mount(`<div class="loader">${esc(t('loading'))}</div>`);
    if (!profile) await loadSession((await sb.auth.getSession()).data.session);
    if (!profile) { $('#view').innerHTML = `<div class="err">${esc(t('error'))}</div>`; return; }
    const body = profile.role === 'teacher' ? await dashTeacher() : await dashStudent();
    $('#view').innerHTML = `<h2 class="section-title">${esc(t('dash_title'))} — ${esc(profile.full_name)}</h2><div class="dash">${body}${profileForm()}</div>`;
    bindProfileForm();
    bindStarInputs($('#view'));
    $$('.save-rate').forEach(b => b.onclick = async () => {
      const row = b.closest('.list-item');
      const stars = +$('.star-input', row).dataset.val;
      if (!stars) return toast(t('rate_hint'));
      b.disabled = true;
      const { error } = await sb.from('ratings').upsert(
        { student_id: me.id, teacher_id: row.dataset.tid, stars, comment: $('textarea', row).value.trim() || null },
        { onConflict: 'student_id,teacher_id' });
      b.disabled = false;
      toast(error ? error.message : t('saved'));
    });
  }

  /* ---------- Router ---------- */
  async function route() {
    if (!sb && !DEMO) return;
    const h = location.hash.replace(/^#\/?/, '');
    const [path, query] = h.split('?');
    const [p, arg] = path.split('/');
    try {
      if (!p) return pHome();
      if (p === 'teachers') return await pTeachers();
      if (p === 'teacher' && arg) return await pTeacher(arg);
      if (p === 'login') return pLogin();
      if (p === 'signup') return pSignup(query);
      if (p === 'dashboard') return await pDashboard();
      pHome();
    } catch (e) {
      mount(`<div class="err">${esc(e.message || t('error'))}</div>`);
    }
  }

  async function boot() {
    let l = 'en';
    try { l = localStorage.getItem('lang') || (navigator.language || 'en').slice(0, 2); } catch (e) {}
    setLang(I18N[l] ? l : 'en');

    if (!CFG.SUPABASE_URL || CFG.SUPABASE_URL.includes('YOUR_PROJECT')) {
      DEMO = true; // وضع المعاينة: الموقع يفتح ببيانات تجريبية حتى يتم ربط Supabase
      window.addEventListener('hashchange', route);
      route();
      return;
    }
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
    const { data: { session } } = await sb.auth.getSession();
    await loadSession(session);
    sb.auth.onAuthStateChange((_e, s) => {
      if ((s?.user?.id || null) === (me?.id || null)) return;
      setTimeout(async () => { await loadSession(s); route(); }, 0); // تجنّب استدعاء supabase داخل الـ callback مباشرة
    });
    window.addEventListener('hashchange', route);
    route();
  }

  boot();
})();
