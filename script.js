// Add sticky header scroll behavior
window.addEventListener('scroll', () => {
  const header = document.querySelector('.sticky-header');
  if (!header) return;
  
  if (window.scrollY > 10) {
    header.classList.add('scroll-shadow');
  } else {
    header.classList.remove('scroll-shadow');
  }
});

// Fetch events.json and render a simple starred repositories list.
// Place this file next to events.json or adjust the path as needed.

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.querySelector('#starred-list');
  const statusEl = document.querySelector('#starred-status');

  if (!listEl) return;

  statusEl.textContent = 'Loading...';

  fetch('events.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        statusEl.textContent = 'No starred repositories found.';
        return;
      }

      // Sort newest starred first (if starred_at exists)
      data.sort((a, b) => {
        const ta = a.starred_at ? Date.parse(a.starred_at) : 0;
        const tb = b.starred_at ? Date.parse(b.starred_at) : 0;
        return tb - ta;
      });

      statusEl.textContent = '';

      data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'starred-item';

        const meta = document.createElement('div');
        meta.className = 'repo-meta';

        const nameLink = document.createElement('a');
        nameLink.className = 'repo-name';
        nameLink.href = item.url || '#';
        nameLink.target = '_blank';
        nameLink.rel = 'noopener noreferrer';
        nameLink.textContent = item.name || 'Unnamed repo';

        const desc = document.createElement('div');
        desc.className = 'repo-desc';
        desc.textContent = item.description || '';

        meta.appendChild(nameLink);
        if (desc.textContent) meta.appendChild(desc);

        const extra = document.createElement('div');
        extra.className = 'repo-extra';
        const lang = document.createElement('span');
        lang.className = 'kv';
        lang.textContent = item.language ? item.language : '';
        const starred = document.createElement('span');
        starred.className = 'kv';
        if (item.starred_at) {
          const d = new Date(item.starred_at);
          starred.textContent = `★ ${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
        extra.appendChild(lang);
        extra.appendChild(starred);

        li.appendChild(meta);
        li.appendChild(extra);

        listEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Failed to load events.json', err);
      statusEl.textContent = 'Failed to load starred repositories.';
    });
});