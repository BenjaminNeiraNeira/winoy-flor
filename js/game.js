/* ==========================================================================
   game.js - Wiñoy Flor card battle (you vs. the computer).
   - 16 cards. Each player gets 5. There are 5 rounds.
   - Each round: you play a card, choose a power (Bloom, Fire or Harmony),
     the computer plays a card and the higher number wins the round.
   - The computer is easy: it picks the best card for the power only 40 % of
     the time, otherwise a random one.
   - A clock measures the whole battle and the end screen shows rounds won and time.
   - Tips (coach messages and glowing hints) can be turned off with a button.
   No libraries. All the texts of the cards are in the CARDS list below.
   ========================================================================== */

(function () {
  'use strict';

  var STATS = [
    { key: 'bloom', label: 'Bloom' },
    { key: 'fire', label: 'Fire' },
    { key: 'harmony', label: 'Harmony' }
  ];

  var ORIGIN = { co: 'Colombia', cl: 'Chile', both: 'Colombia + Chile' };
  var ORIGIN_SHORT = { co: 'Colombia', cl: 'Chile', both: 'Both' };

  /* name, type, origin, powers [bloom, fire, harmony], picture (assets/cards/<id>.svg), fact */
  var CARDS = [
    { id: 'petalo', name: 'Pétalo', type: 'Character', origin: 'both', p: [9, 5, 8],
      fact: 'The festival’s mascot is a smiling flower born from the sparks of the New Fire. It never wilts and travels between Colombia and Chile to announce the sun’s return.' },
    { id: 'silletero', name: 'Silletero', type: 'Character', origin: 'co', p: [8, 4, 7],
      fact: 'The silletero carries a silleta decorated with Mapuche symbols and leads the parade.' },
    { id: 'guardiana', name: 'Fire Guardian', type: 'Character', origin: 'cl', p: [4, 9, 7],
      fact: 'She carries a kultrún and wears a trarilonko, a silver headband. She guides the dawn ceremony and lights the fire.' },
    { id: 'silleta', name: 'Silleta', type: 'Symbol', origin: 'co', p: [10, 2, 6],
      fact: 'The silleta is a disc of flowers carried on the back by the silleteros. At Wiñoy Flor it is decorated with Mapuche motifs.' },
    { id: 'kultrun', name: 'Kultrún', type: 'Symbol', origin: 'cl', p: [3, 6, 9],
      fact: 'The kultrún is the Mapuche ceremonial drum and represents the universe. At Wiñoy Flor it is adorned with flowers.' },
    { id: 'fuego', name: 'New Fire', type: 'Symbol', origin: 'both', p: [2, 10, 6],
      fact: 'Every June 21, both peoples light the New Fire at the same time, one in Colombia and one in Chile.' },
    { id: 'sol', name: 'New Sun', type: 'Symbol', origin: 'cl', p: [6, 9, 8],
      fact: 'June 21 is the date of We Tripantu, the Mapuche New Year and the winter solstice in the Southern Hemisphere. That is why the festival opens on that day.' },
    { id: 'tiple', name: 'Tiple', type: 'Instrument', origin: 'co', p: [4, 5, 9],
      fact: 'The tiple is a string instrument of paisa music. At the festival it plays together with the kultrún.' },
    { id: 'trutruka', name: 'Trutruka', type: 'Instrument', origin: 'cl', p: [3, 7, 8],
      fact: 'The trutruka is a Mapuche wind instrument. In the fusion concerts it joins the carrilera music of Colombia.' },
    { id: 'sopaipilla', name: 'Paisa Sopaipilla', type: 'Food', origin: 'both', p: [5, 6, 6],
      fact: 'Fried squash dough with hogao, campesino cheese and avocado. It fuses the Chilean sopaipilla with paisa flavors.' },
    { id: 'multrun', name: 'Mültrün with Hogao', type: 'Food', origin: 'both', p: [4, 5, 7],
      fact: 'A corn (choclo) humita wrapped in a leaf and filled with Antioquian chorizo and hogao. It mixes a Mapuche dish with paisa flavors.' },
    { id: 'sancocho', name: 'Sancocho Wiñoy', type: 'Food', origin: 'both', p: [4, 8, 7],
      fact: 'Lamb, potato, yuca, plantain, corn on the cob and araucaria pine nuts: an Antioquian sancocho with a Mapuche touch.' },
    { id: 'natilla', name: 'Pine Nut Natilla', type: 'Food', origin: 'both', p: [6, 3, 8],
      fact: 'A cornstarch natilla with panela, cinnamon, crushed pine nut and honey. It fuses a Colombian dessert with a pine nut from southern Chile.' },
    { id: 'bfuego', name: 'Fuego Nuevo', type: 'Drink', origin: 'both', p: [3, 9, 5],
      fact: 'A warm toast of Antioquian aguardiente and apple chicha, with cinnamon and clove. It is for adults only.' },
    { id: 'bfresca', name: 'Silleta Fresca', type: 'Drink', origin: 'both', p: [8, 2, 7],
      fact: 'Lulo and maqui juice with ice and mint, decorated with an edible flower. It is alcohol-free and fuses fruits of Colombia with a native fruit of Chile.' },
    { id: 'bmuday', name: 'Muday with Panela', type: 'Drink', origin: 'cl', p: [5, 4, 9],
      fact: 'Muday is a traditional Mapuche grain drink, sweetened here with panela and cinnamon. The festival offers a fermented and an unfermented version.' }
  ];

  /* the animated card back: separate layers animated with CSS (see css/cardback.css) */
  var BACK_LAYERS = '<span class="cback" aria-hidden="true"><img class="cb" src="assets/cards/back/base.svg" alt="" width="400" height="560"><img class="cb cb-glow" src="assets/cards/back/glow.svg" alt="" width="400" height="560"><img class="cb cb-rays" src="assets/cards/back/rays.svg" alt="" width="500" height="500"><img class="cb" src="assets/cards/back/disc.svg" alt="" width="400" height="560"><img class="cb cb-spin" src="assets/cards/back/flowers.svg" alt="" width="400" height="560"><img class="cb cb-spinr" src="assets/cards/back/petals.svg" alt="" width="400" height="560"><img class="cb" src="assets/cards/back/inner.svg" alt="" width="400" height="560"><img class="cb cb-breathe" src="assets/cards/back/kultrun.svg" alt="" width="400" height="560"><img class="cb cb-s0 cb-tw" src="assets/cards/back/sparkle-9.svg" alt="" width="22" height="22"><img class="cb cb-s1 cb-tw cb-tw2" src="assets/cards/back/sparkle-8.svg" alt="" width="20" height="20"><img class="cb cb-s2 cb-tw cb-tw3" src="assets/cards/back/sparkle-8.svg" alt="" width="20" height="20"><img class="cb cb-s3 cb-tw" src="assets/cards/back/sparkle-10.svg" alt="" width="24" height="24"><img class="cb cb-s4 cb-tw cb-tw2" src="assets/cards/back/sparkle-6.svg" alt="" width="16" height="16"><img class="cb cb-s5 cb-tw cb-tw3" src="assets/cards/back/sparkle-6.svg" alt="" width="16" height="16"><img class="cb cb-s6 cb-tw" src="assets/cards/back/sparkle-7.svg" alt="" width="18" height="18"><img class="cb cb-s7 cb-tw cb-tw2" src="assets/cards/back/sparkle-6.svg" alt="" width="16" height="16"><img class="cb" src="assets/cards/back/top.svg" alt="" width="400" height="560"><img class="cb cb-flame" src="assets/cards/back/flame.svg" alt="" width="46" height="64"><img class="cb cb-s8 cb-tw cb-tw2" src="assets/cards/back/sparkle-6.svg" alt="" width="16" height="16"><img class="cb cb-s9 cb-tw cb-tw2" src="assets/cards/back/sparkle-6.svg" alt="" width="16" height="16"><svg class="cb cb-fall" style="overflow:visible;animation-delay:0.0s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(70.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#C2185B" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><svg class="cb cb-fall" style="overflow:visible;animation-delay:1.3s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(150.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#F48FB1" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><svg class="cb cb-fall" style="overflow:visible;animation-delay:2.6s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(250.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#FFD76A" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><svg class="cb cb-fall" style="overflow:visible;animation-delay:3.9s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(330.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#F48FB1" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><svg class="cb cb-fall" style="overflow:visible;animation-delay:5.2s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(110.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#F28C28" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><svg class="cb cb-fall" style="overflow:visible;animation-delay:6.5s" viewBox="0 0 400 560" preserveAspectRatio="none" width="400" height="560" aria-hidden="true" focusable="false"><g transform="translate(290.0 0.0) rotate(60)"><path d="M0 0 C 4.0 -5.4, 12.0 -5.4, 16.0 0 C 12.0 5.4, 4.0 5.4, 0 0 Z" fill="#C2185B" stroke="#3B2A38" stroke-width="1.2" stroke-linejoin="round"/></g></svg><span class="cb-clip"><img class="cb cb-sweep" src="assets/cards/back/sweep.svg" alt="" width="400" height="560"></span></span>';

  /* pre-load the 16 card pictures once (so a card never pops in while you play) */
  function preload() {
    CARDS.forEach(function (card) { var im = new Image(); im.decoding = 'async'; im.src = 'assets/cards/' + card.id + '.svg'; });
  }
  if ('requestIdleCallback' in window) { window.requestIdleCallback(preload, { timeout: 1500 }); } else { window.setTimeout(preload, 300); }

  var ROUNDS = 5;
  var AI_SMART = 0.4;

  var ICONS = {
    bloom: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><g fill="currentColor"><circle cx="12" cy="5.5" r="4"/><circle cx="18.2" cy="10" r="4"/><circle cx="15.8" cy="17.4" r="4"/><circle cx="8.2" cy="17.4" r="4"/><circle cx="5.8" cy="10" r="4"/></g><circle cx="12" cy="12" r="3.2" fill="#fff"/></svg>',
    fire: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-2.600 1.200-4.200 2.600-5.600C9 11 10.500 11 11 9.500 11.400 7.500 10.500 4.500 12 2z"/></svg>',
    harmony: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.600"><circle cx="8.500" cy="12" r="5.500"/><circle cx="15.500" cy="12" r="5.500"/></g></svg>'
  };

  /* ---------- small helpers ---------- */
  function $(id) { return document.getElementById(id); }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var els = {
    start: $('start-panel'), board: $('board'), end: $('end-panel'),
    roundN: $('round-n'), scoreYou: $('score-you'), scoreCpu: $('score-cpu'),
    prompt: $('prompt'), slotYou: $('slot-you-card'), slotCpu: $('slot-cpu-card'),
    picker: $('stat-picker'), statButtons: $('stat-buttons'),
    result: $('result'), resultTitle: $('result-title'), resultFact: $('result-fact'),
    next: $('next-btn'), hand: $('hand'), handTitle: $('hand-title'),
    endTitle: $('end-title'), endText: $('end-text'),
    timer: $('timer'), coach: $('coach'), coachText: $('coach-text'), tipsBtn: $('tips-toggle'),
    endWins: $('end-wins'), endTime: $('end-time')
  };
  if (!els.start || !els.board) {
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = null;
  var timerId = null;
  var tipsOn = false; /* the tips are OFF until the player turns them on */
  try { tipsOn = localStorage.getItem('winoy-tips') === 'on'; } catch (error) { /* keep the default */ }

  /* ---------- clock ---------- */
  function fmt(sec) {
    var m = Math.floor(sec / 60);
    var r = sec % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function elapsed() {
    return state ? Math.round((Date.now() - state.startedAt) / 1000) : 0;
  }

  function startClock() {
    stopClock();
    els.timer.textContent = '0:00';
    timerId = window.setInterval(function () { els.timer.textContent = fmt(elapsed()); }, 500);
  }

  function stopClock() {
    if (timerId) { window.clearInterval(timerId); timerId = null; }
  }

  /* ---------- tips (coach messages + glowing hints) ---------- */
  function hint(which, message) {
    els.hand.classList.toggle('hint-cards', tipsOn && which === 'cards');
    els.picker.classList.toggle('hint-stats', tipsOn && which === 'stats');
    els.next.classList.toggle('hint-next', tipsOn && which === 'next');
    if (tipsOn && message) {
      els.coachText.textContent = message;
      els.coach.hidden = false;
    } else {
      els.coach.hidden = true;
    }
    state.hintKind = which;
    state.hintMsg = message;
  }

  function renderTipsButton() {
    els.tipsBtn.textContent = tipsOn ? 'Tips: on' : 'Tips: off';
    els.tipsBtn.setAttribute('aria-pressed', tipsOn ? 'true' : 'false');
  }

  /* ---------- card drawing ---------- */
  function cardHtml(card, extraClass) {
    var rows = '';
    STATS.forEach(function (s, i) {
      var v = card.p[i];
      rows += '<li class="stat t-' + s.key + '" data-stat="' + s.key + '">' +
        '<span class="s-name">' + ICONS[s.key] + s.label + '</span>' +
        '<span class="s-bar"><i style="width:' + (v * 10) + '%"></i></span>' +
        '<b class="s-val">' + v + '</b></li>';
    });
    return '<div class="card ' + (extraClass || '') + ' kind-' + card.type.toLowerCase() + '">' +
      '<div class="c-name">' + card.name + '</div>' +
      '<div class="c-art"><img src="assets/cards/' + card.id + '.svg" alt="" width="320" height="240" decoding="async"></div>' +
      '<div class="c-meta"><span class="chip">' + card.type + '</span><span class="chip origin-' + card.origin + '" title="' + ORIGIN[card.origin] + '">' + ORIGIN_SHORT[card.origin] + '</span></div>' +
      '<ul class="c-stats">' + rows + '</ul></div>';
  }

  function backHtml() {
    return '<div class="card card-back">' + BACK_LAYERS + '</div>';
  }

  function cardLabel(card) {
    return card.name + ', ' + card.type + ', ' + ORIGIN[card.origin] + '. Bloom ' + card.p[0] + ', Fire ' + card.p[1] + ', Harmony ' + card.p[2] + '.';
  }

  /* ---------- game flow ---------- */
  function newGame() {
    var deck = shuffle(CARDS);
    state = {
      you: deck.slice(0, ROUNDS),
      cpu: deck.slice(ROUNDS, ROUNDS * 2),
      round: 1, scoreYou: 0, scoreCpu: 0, selected: null, locked: false, startedAt: Date.now(), hintKind: '', hintMsg: ''
    };
    els.start.hidden = true;
    els.end.hidden = true;
    handEls = {};
    els.hand.innerHTML = '';
    els.board.hidden = false;
    startClock();
    startRound(true);
    els.board.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function startRound(first) {
    state.selected = null;
    state.locked = false;
    els.roundN.textContent = state.round;
    els.scoreYou.textContent = state.scoreYou;
    els.scoreCpu.textContent = state.scoreCpu;
    els.prompt.textContent = 'Choose a card from your hand.';
    els.slotYou.innerHTML = '<div class="slot-empty">Your card</div>';
    els.slotCpu.innerHTML = backHtml();
    els.slotCpu.classList.add('waiting');
    els.picker.hidden = true;
    els.result.hidden = true;
    renderHand();
    hint('cards', first
      ? 'Welcome! These are your 5 cards. Tap one to play it. Look at its three powers: the bigger the number, the stronger the power.'
      : 'Round ' + state.round + ': pick another card from your hand.');
    if (!first) {
      els.handTitle.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
    /* keyboard users: keep the focus inside the game (the cards are rebuilt every round) */
    var firstCard = els.hand.querySelector('.hand-card');
    if (firstCard) { firstCard.focus({ preventScroll: true }); }
  }

  var handEls = {};

  function renderHand() {
    var present = {};
    state.you.forEach(function (card) {
      var b = handEls[card.id];
      if (!b) {
        b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Play ' + cardLabel(card));
        b.innerHTML = cardHtml(card);
        b.addEventListener('click', function () { selectCard(card); });
        handEls[card.id] = b;
      }
      var chosen = state.selected === card;
      b.className = 'hand-card' + (chosen ? ' is-selected' : '');
      b.setAttribute('aria-pressed', chosen ? 'true' : 'false');
      b.disabled = state.locked;
      if (b.parentNode !== els.hand) { els.hand.appendChild(b); }
      present[card.id] = true;
    });
    Object.keys(handEls).forEach(function (id) {
      if (!present[id]) {
        if (handEls[id].parentNode) { handEls[id].parentNode.removeChild(handEls[id]); }
        delete handEls[id];
      }
    });
  }

  function selectCard(card) {
    if (state.locked) {
      return;
    }
    state.selected = card;
    els.slotYou.innerHTML = cardHtml(card, 'is-live');
    els.prompt.textContent = card.name + ' is ready. Now choose a power.';
    renderHand();
    showPicker(card);
    var firstPower = els.statButtons.querySelector('button');
    if (firstPower) { firstPower.focus({ preventScroll: true }); }
    hint('stats', state.round === 1
      ? 'Great choice! Now press one of the glowing buttons. Compete with the power where your card has the highest number.'
      : 'Now choose the power where this card is strongest.');
  }

  function showPicker(card) {
    els.statButtons.innerHTML = '';
    STATS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'stat-btn t-' + s.key;
      b.innerHTML = ICONS[s.key] + '<span>' + s.label + '</span><b>' + card.p[i] + '</b>' +
        '<i class="ring glow" aria-hidden="true"><i></i></i><i class="ring" aria-hidden="true"><i></i></i>';
      b.setAttribute('aria-label', 'Compete with ' + s.label + ' ' + card.p[i]);
      b.addEventListener('click', function () { play(i); });
      els.statButtons.appendChild(b);
    });
    els.picker.hidden = false;
  }

  function pickCpuCard(statIndex) {
    var hand = state.cpu;
    if (Math.random() < AI_SMART) {
      var best = hand[0];
      hand.forEach(function (c) {
        if (c.p[statIndex] > best.p[statIndex]) { best = c; }
      });
      return best;
    }
    return hand[Math.floor(Math.random() * hand.length)];
  }

  function play(statIndex) {
    if (state.locked || !state.selected) {
      return;
    }
    state.locked = true;
    var mine = state.selected;
    var theirs = pickCpuCard(statIndex);
    var stat = STATS[statIndex];

    state.you = state.you.filter(function (c) { return c !== mine; });
    state.cpu = state.cpu.filter(function (c) { return c !== theirs; });

    els.picker.hidden = true;
    hint('', '');
    renderHand();
    els.prompt.textContent = 'The computer plays its card…';

    var reveal = function () {
      els.slotCpu.classList.remove('waiting');
      els.slotCpu.innerHTML = cardHtml(theirs, 'is-live');
      var a = mine.p[statIndex];
      var b = theirs.p[statIndex];
      var title, fact;
      var live = els.slotYou.firstChild;
      var liveCpu = els.slotCpu.firstChild;
      if (a > b) {
        state.scoreYou += 1;
        title = 'You win the round! ' + stat.label + ' ' + a + ' beats ' + b + '.';
        fact = mine.name + ': ' + mine.fact;
        live.classList.add('is-winner'); liveCpu.classList.add('is-loser');
      } else if (b > a) {
        state.scoreCpu += 1;
        title = 'The computer wins the round. ' + stat.label + ' ' + b + ' beats ' + a + '.';
        fact = theirs.name + ': ' + theirs.fact;
        liveCpu.classList.add('is-winner'); live.classList.add('is-loser');
      } else {
        title = 'It’s a tie! Both cards have ' + stat.label + ' ' + a + '.';
        fact = mine.name + ': ' + mine.fact;
      }
      els.scoreYou.textContent = state.scoreYou;
      els.scoreCpu.textContent = state.scoreCpu;
      els.resultTitle.textContent = title;
      els.resultFact.textContent = fact;
      els.next.textContent = state.round >= ROUNDS ? 'See the result' : 'Next round';
      els.prompt.textContent = 'Round ' + state.round + ' finished.';
      state.roundDone = true;
      els.result.hidden = false;
      hint('next', state.round >= ROUNDS ? 'That was the last round! Press the button to see your result.' : 'The winner gets a point and you learn a fact. Press the button when you are ready.');
      els.next.focus({ preventScroll: true });
    };

    window.setTimeout(reveal, reduceMotion ? 0 : 700);
  }

  function nextStep() {
    if (!state || !state.roundDone) {
      return; /* ignore a second click on "Next round" before the new round is ready */
    }
    state.roundDone = false;
    if (state.round >= ROUNDS) {
      finish();
      return;
    }
    state.round += 1;
    startRound(false);
  }

  function finish() {
    stopClock();
    state.finalTime = elapsed();
    els.board.hidden = true;
    els.end.hidden = false;
    els.coach.hidden = true;
    els.endWins.textContent = state.scoreYou + ' / ' + ROUNDS;
    els.endTime.textContent = fmt(state.finalTime);
    var y = state.scoreYou, c = state.scoreCpu;
    if (y > c) {
      els.endTitle.textContent = 'You win the battle!';
      els.endText.textContent = 'Final score: you ' + y + ', computer ' + c + '. Like Pétalo, you brought the flowers back. Play again to meet the other cards.';
    } else if (c > y) {
      els.endTitle.textContent = 'The computer wins this time';
      els.endText.textContent = 'Final score: you ' + y + ', computer ' + c + '. Every battle teaches something new about the festival, so try again!';
    } else {
      els.endTitle.textContent = 'It’s a draw!';
      els.endText.textContent = 'Final score: you ' + y + ', computer ' + c + '. The sun and the flowers share the day. Play again to break the tie.';
    }
    els.end.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    $('again-btn').focus({ preventScroll: true });
  }

  els.tipsBtn.addEventListener('click', function () {
    tipsOn = !tipsOn;
    try { localStorage.setItem('winoy-tips', tipsOn ? 'on' : 'off'); } catch (error) { /* ignore */ }
    renderTipsButton();
    if (state) { hint(state.hintKind, state.hintMsg); }
  });

  renderTipsButton();
  $('start-btn').addEventListener('click', newGame);
  $('again-btn').addEventListener('click', newGame);
  els.next.addEventListener('click', nextStep);
})();
