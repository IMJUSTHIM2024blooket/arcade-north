const tiles = [...document.querySelectorAll('.launch-tile')];
const filters = [...document.querySelectorAll('.filter')];
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');

function updateTiles() {
  const activeFilter = document.querySelector('.filter.active').dataset.filter;
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  tiles.forEach((tile) => {
    const matchesFilter = activeFilter === 'all' || tile.dataset.category === activeFilter;
    const matchesSearch = !query || tile.dataset.name.includes(query);
    const isVisible = matchesFilter && matchesSearch;
    tile.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
}

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => {
      item.classList.toggle('active', item === filter);
      item.setAttribute('aria-selected', item === filter ? 'true' : 'false');
    });
    updateTiles();
  });
});
searchInput.addEventListener('input', updateTiles);

document.querySelector('#themeButton').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.querySelector('#shuffleButton').addEventListener('click', (event) => {
  const tracks = [...document.querySelectorAll('.track')];
  const panel = event.target.closest('.list-panel');
  tracks.sort(() => Math.random() - 0.5).forEach((track) => panel.append(track));
});

document.querySelector('#addMirrorButton').addEventListener('click', () => {
  const link = window.prompt('Paste a link to a page you own or have permission to share:');
  if (!link) return;
  try {
    const url = new URL(link);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    window.alert(`Saved for your setup: ${url.hostname}`);
  } catch {
    window.alert('Please enter a complete http:// or https:// link.');
  }
});

const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const botReplies = [
  'Try a 20-minute build sprint, then take a real break. Small quests count.',
  'For focus: low-key instrumental, a glass of water, and one clear objective.',
  'Creative challenge: make a base with one room, one secret, and one ridiculous detail.',
  'That sounds like a good moment for a quick game, not an endless scroll. Pick a finish line first.'
];

function addMessage(text, className) {
  const message = document.createElement('div');
  message.className = `message ${className}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function respondTo(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('music') || lowerText.includes('focus')) return botReplies[1];
  if (lowerText.includes('build') || lowerText.includes('creative')) return botReplies[2];
  if (lowerText.includes('break') || lowerText.includes('game')) return botReplies[0];
  return botReplies[Math.floor(Math.random() * botReplies.length)];
}

document.querySelector('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user-message');
  chatInput.value = '';
  window.setTimeout(() => addMessage(respondTo(text), 'bot-message'), 300);
});

document.querySelectorAll('[data-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    chatInput.value = button.dataset.prompt;
    chatInput.focus();
  });
});
