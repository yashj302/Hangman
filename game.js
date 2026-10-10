const MAX = 6;
const STORE = "hangman-parlor";

const BOOKS = [
  {
    name: "Animals",
    prompt: "Name the animal",
    words: [
      ["PENGUIN", "A bird that swims and never flies"],
      ["OCTOPUS", "Eight arms and a cloud of ink"],
      ["CHAMELEON", "A lizard famous for changing color"],
      ["JAGUAR", "A spotted big cat of the Americas"],
      ["DOLPHIN", "A smiling mammal of the sea"],
      ["HEDGEHOG", "A small animal covered in spines"],
      ["FLAMINGO", "A pink bird that stands on one leg"],
      ["KANGAROO", "It hops and carries its young in a pouch"],
      ["PLATYPUS", "A mammal with a bill like a duck"],
      ["SCORPION", "A desert arachnid with a stinging tail"],
      ["GIRAFFE", "The tallest animal, with a very long neck"],
      ["PEACOCK", "A bird that fans a trail of eye-spots"]
    ]
  },
  {
    name: "Places",
    prompt: "Name the place",
    words: [
      ["VENICE", "A city of canals and gondolas"],
      ["SAHARA", "The world's largest hot desert"],
      ["KYOTO", "Japan's old capital of temples"],
      ["ICELAND", "An island of volcanoes, glaciers, and geysers"],
      ["AMAZON", "The great rainforest river of South America"],
      ["MOROCCO", "A North African kingdom facing Spain"],
      ["PATAGONIA", "The wild southern tip of South America"],
      ["PRAGUE", "A capital city of spires on the Vltava"],
      ["LISBON", "Portugal's hilly capital by the Atlantic"],
      ["TUSCANY", "The Italian region of cypress hills and wine"],
      ["CAIRO", "Egypt's capital on the Nile"],
      ["NEPAL", "The Himalayan home of Everest"]
    ]
  },
  {
    name: "Food",
    prompt: "Name the dish",
    words: [
      ["CROISSANT", "A flaky French pastry, shaped like a crescent"],
      ["PAELLA", "A Spanish rice dish colored with saffron"],
      ["BROWNIE", "A dense square of chocolate cake"],
      ["AVOCADO", "A green fruit with a large pit"],
      ["POMEGRANATE", "A red fruit packed with jewel-like seeds"],
      ["RISOTTO", "Creamy Italian rice, stirred slowly"],
      ["BAGUETTE", "A long, crackling French loaf"],
      ["PRETZEL", "A twisted bread sprinkled with salt"],
      ["WAFFLE", "A breakfast cake pressed into a grid"],
      ["BISCUIT", "A small baked bite, often taken with tea"],
      ["CHURRO", "Ridged fried dough, dusted with sugar"],
      ["NOODLE", "A long strand served in soup or sauce"]
    ]
  },
  {
    name: "Science",
    prompt: "Name the idea",
    words: [
      ["GRAVITY", "The pull that keeps your feet on the ground"],
      ["NEBULA", "A cloud of gas and dust among the stars"],
      ["PHOTON", "A single particle of light"],
      ["GALAXY", "A vast island of stars"],
      ["ECLIPSE", "When one body hides the sun or the moon"],
      ["VOLCANO", "A mountain that can pour out fire"],
      ["AURORA", "Colored lights in a polar sky"],
      ["FOSSIL", "The stone trace of ancient life"],
      ["QUASAR", "A brilliant core of a distant galaxy"],
      ["COMET", "An icy traveler with a bright tail"],
      ["GENOME", "The full set of an organism's genes"],
      ["CRYSTAL", "A solid whose atoms line up in a pattern"]
    ]
  },
  {
    name: "Myth",
    prompt: "Name the legend",
    words: [
      ["PHOENIX", "A bird that burns, then rises from the ash"],
      ["MINOTAUR", "Half man, half bull, lost in a maze"],
      ["VALKYRIE", "A chooser of the slain in Norse myth"],
      ["PEGASUS", "A horse with wings"],
      ["KRAKEN", "A giant sea monster from sailors' tales"],
      ["ANUBIS", "The jackal-headed god of the dead"],
      ["MEDUSA", "A glance from her could turn you to stone"],
      ["SPHINX", "A riddle-asker with the body of a lion"],
      ["HERCULES", "The hero of the twelve labors"],
      ["POSEIDON", "Greek god of the sea"],
      ["FENRIR", "The great wolf of Norse myth"],
      ["OSIRIS", "Egyptian lord of the afterlife"]
    ]
  },
  {
    name: "Cinema",
    prompt: "Name the film",
    words: [
      ["INCEPTION", "A dream folded inside another dream"],
      ["CASABLANCA", "Of all the gin joints in all the world"],
      ["PARASITE", "Two families, and one house between them"],
      ["WHIPLASH", "A drummer pushed past the breaking point"],
      ["ARRIVAL", "Linguists meet visitors from the sky"],
      ["GLADIATOR", "A Roman general becomes a fighter in the arena"],
      ["TITANIC", "A ship, an iceberg, and a doomed romance"],
      ["AMADEUS", "Mozart, and the rival who envied him"],
      ["PSYCHO", "A motel, a shower, and a famous scream"],
      ["ALIEN", "In space, no one can hear you scream"],
      ["JAWS", "A beach town and a very large shark"],
      ["GODFATHER", "An offer you can't refuse"]
    ]
  }
];

const $ = (id) => document.getElementById(id);

const els = {
  cats: $("cats"),
  prompt: $("prompt"),
  clue: $("clue"),
  word: $("word"),
  meta: $("meta"),
  keys: $("keys"),
  pips: $("pips"),
  chances: $("chances"),
  gallows: $("gallows"),
  figure: $("figure"),
  hint: $("hint"),
  fresh: $("fresh"),
  overlay: $("overlay"),
  kicker: $("kicker"),
  title: $("result-title"),
  answer: $("answer"),
  copy: $("result-copy"),
  again: $("again"),
  confetti: $("confetti"),
  live: $("live"),
  streak: $("streak"),
  best: $("best"),
  wins: $("wins")
};

let round = null;
let stats = loadStats();

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
    return {
      streak: Number(saved.streak) || 0,
      best: Number(saved.best) || 0,
      wins: Number(saved.wins) || 0
    };
  } catch {
    return { streak: 0, best: 0, wins: 0 };
  }
}

function saveStats() {
  try {
    localStorage.setItem(STORE, JSON.stringify(stats));
  } catch {
    /* Private browsing can block storage; the round still plays. */
  }
}

function book(name) {
  return BOOKS.find((item) => item.name === name) || BOOKS[0];
}

function start(name) {
  const chosen = book(name);
  let pick = chosen.words[Math.floor(Math.random() * chosen.words.length)];
  if (round && pick[0] === round.secret && chosen.words.length > 1) {
    pick = chosen.words.find((entry) => entry[0] !== round.secret) || pick;
  }
  const [secret, hint] = pick;
  round = {
    name: chosen.name,
    prompt: chosen.prompt,
    secret,
    hint,
    guessed: new Set(),
    wrong: 0,
    over: false,
    won: false,
    last: ""
  };
  closeOverlay();
  render();
  els.live.textContent = `${chosen.prompt}. Hint: ${hint}. ${secret.length} letters.`;
}

function missingLetters() {
  return [...new Set(round.secret)].filter((letter) => !round.guessed.has(letter));
}

function solved() {
  return [...round.secret].every((letter) => round.guessed.has(letter));
}

function guess(raw) {
  if (!round || round.over) return;
  const letter = String(raw || "").toUpperCase();
  if (!/^[A-Z]$/.test(letter) || round.guessed.has(letter)) return;
  round.guessed.add(letter);
  round.last = letter;
  const hit = round.secret.includes(letter);
  if (!hit) {
    round.wrong += 1;
    shake();
  }
  settle(hit
    ? `${letter} is in the word.`
    : `${letter} is not in the word. ${chancesLeft()} ${chancesLeft() === 1 ? "chance" : "chances"} left.`);
}

function reveal() {
  if (!round || round.over || round.wrong >= MAX) return;
  const pool = missingLetters();
  if (!pool.length) return;
  const letter = pool[Math.floor(Math.random() * pool.length)];
  round.guessed.add(letter);
  round.last = letter;
  if (!solved()) {
    round.wrong += 1;
    shake();
  }
  const left = chancesLeft();
  settle(`A flare shows ${letter}. ${left} ${left === 1 ? "chance" : "chances"} left.`);
}

function chancesLeft() {
  return Math.max(0, MAX - round.wrong);
}

function settle(message) {
  if (solved()) finish(true);
  else if (round.wrong >= MAX) finish(false);
  else render();
  els.live.textContent = message;
}

function finish(won) {
  round.over = true;
  round.won = won;
  if (won) {
    stats.wins += 1;
    stats.streak += 1;
    stats.best = Math.max(stats.best, stats.streak);
    burst();
  } else {
    stats.streak = 0;
  }
  saveStats();
  render();
  els.kicker.textContent = won ? "Spared" : "The drawing is done";
  els.title.textContent = won ? "The rope stayed slack" : "Not this word";
  els.answer.textContent = round.secret;
  els.copy.textContent = won
    ? `Streak of ${stats.streak}. The ${round.name.toLowerCase()} word was yours.`
    : "The streak resets.";
  els.overlay.inert = false;
  els.overlay.setAttribute("aria-hidden", "false");
  els.overlay.classList.add("open");
  els.again.focus();
}

function closeOverlay() {
  els.overlay.classList.remove("open");
  els.overlay.inert = true;
  els.overlay.setAttribute("aria-hidden", "true");
}

function shake() {
  els.gallows.classList.remove("shake");
  void els.gallows.offsetWidth;
  els.gallows.classList.add("shake");
}

function burst() {
  els.confetti.replaceChildren();
  for (let i = 0; i < 26; i += 1) {
    const bit = document.createElement("i");
    bit.style.setProperty("--x", `${Math.random() * 100}vw`);
    bit.style.setProperty("--r", `${Math.random() * 240 - 120}deg`);
    bit.style.setProperty("--d", `${Math.random() * 0.25}s`);
    if (i % 3 === 0) bit.style.background = "#f6ead7";
    els.confetti.appendChild(bit);
  }
}

function render() {
  const left = chancesLeft();
  els.streak.textContent = stats.streak;
  els.best.textContent = stats.best;
  els.wins.textContent = stats.wins;
  els.prompt.textContent = round.prompt;
  els.clue.textContent = round.hint;
  els.chances.textContent = left === 1 ? "1 chance left" : `${left} chances left`;
  els.meta.textContent = `${round.secret.length} letters · ${round.name}`;
  els.gallows.classList.toggle("peril", round.wrong >= MAX - 1 && !round.won);
  els.figure.classList.toggle("lost", round.over && !round.won);

  els.pips.replaceChildren();
  for (let i = 0; i < MAX; i += 1) {
    const pip = document.createElement("span");
    pip.className = i < left ? "pip lit" : "pip";
    els.pips.appendChild(pip);
  }

  document.querySelectorAll(".part").forEach((part) => {
    part.classList.toggle("on", Number(part.dataset.step) <= round.wrong);
  });

  document.querySelectorAll(".cat").forEach((button) => {
    button.classList.toggle("active", button.dataset.name === round.name);
  });

  els.word.replaceChildren();
  for (const letter of round.secret) {
    const slot = document.createElement("span");
    const known = round.guessed.has(letter) || (round.over && !round.won);
    slot.className = "slot";
    if (known && letter === round.last) slot.classList.add("pop");
    if (round.over && !round.won && !round.guessed.has(letter)) slot.classList.add("missed");
    slot.textContent = known ? letter : "";
    els.word.appendChild(slot);
  }

  document.querySelectorAll(".key").forEach((key) => {
    const letter = key.dataset.letter;
    const used = round.guessed.has(letter);
    key.disabled = round.over || used;
    key.classList.toggle("good", used && round.secret.includes(letter));
    key.classList.toggle("bad", used && !round.secret.includes(letter));
  });

  els.hint.disabled = round.over || left === 0 || missingLetters().length === 0;
}

function buildCategories() {
  for (const item of BOOKS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cat";
    button.dataset.name = item.name;
    button.textContent = item.name;
    button.addEventListener("click", () => start(item.name));
    els.cats.appendChild(button);
  }
}

function buildKeyboard() {
  for (const row of ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]) {
    const line = document.createElement("div");
    line.className = "row";
    for (const letter of row) {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "key";
      key.dataset.letter = letter;
      key.textContent = letter;
      key.addEventListener("click", () => guess(letter));
      line.appendChild(key);
    }
    els.keys.appendChild(line);
  }
}

buildCategories();
buildKeyboard();
els.hint.addEventListener("click", reveal);
els.fresh.addEventListener("click", () => start(round ? round.name : BOOKS[0].name));
els.again.addEventListener("click", () => start(round.name));

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key === "Enter" && els.overlay.classList.contains("open")) {
    start(round.name);
    return;
  }
  if (event.key === "Escape" && els.overlay.classList.contains("open")) {
    closeOverlay();
    return;
  }
  if (/^[a-zA-Z]$/.test(event.key)) guess(event.key);
});

start(BOOKS[Math.floor(Math.random() * BOOKS.length)].name);
