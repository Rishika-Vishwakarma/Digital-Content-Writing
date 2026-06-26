/* ============================================
   Digital Content Writing - app.js
   Main Application Logic
   ============================================ */

// ── Storage helpers ────────────────────────────────────────────
const LS = {
    // Get data from localStorage (return defaultVal if not found)
    get: (key, defaultVal) => {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultVal;
        } catch { return defaultVal; }
    },
    // Save data to localStorage
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// ── Global app state ───────────────────────────────────────────
let currentUser = null; // logged-in user object
let activeTab = 'all'; // explore page type tab
let activeCat = 'All'; // explore page category
let searchQuery = ''; // search text
let signupRole = 'writer'; // selected role on signup page
let postType = 'article'; // post type when creating
let dashTab = 'ov'; // writer dashboard active tab
let adminTab_cur = 'u'; // admin panel active tab
let viewPostId = null; // currently viewed post id
let activeChatId = null; // active chat conversation id

// ── Categories & icons ────────────────────────────────────────
const CATS = ['All', 'Business', 'Technology', 'Education', 'Travel', 'Health', 'Other'];
const CAT_ICONS = {
    All: '🌐',
    Business: '💼',
    Technology: '💻',
    Education: '📚',
    Travel: '✈️',
    Health: '🌿',
    Other: '✦'
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

// Show toast notification
function toast(msg, type = 's') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    setTimeout(() => el.classList.remove('show'), 3000);
}

// Convert timestamp to "2h ago" format
function timeAgo(ts) {
    const sec = (Date.now() - ts) / 1000;
    if (sec < 60) return 'just now';
    if (sec < 3600) return Math.floor(sec / 60) + 'm ago';
    if (sec < 86400) return Math.floor(sec / 3600) + 'h ago';
    return Math.floor(sec / 86400) + 'd ago';
}

// Get unique ID
function uid() {
    return 'id' + Date.now() + Math.random().toString(36).slice(2, 5);
}

// Get user by ID
function getUser(id) {
    return LS.get('dcw_users', []).find(u => u.id === id);
}

// Get post by ID
function getPost(id) {
    return LS.get('dcw_posts', []).find(p => p.id === id);
}

// Get all non-deleted posts sorted newest first
function getAllPosts() {
    return LS.get('dcw_posts', [])
        .filter(p => !p.deleted)
        .sort((a, b) => b.createdAt - a.createdAt);
}

// Get all writers (non-blocked)
function getWriters() {
    return LS.get('dcw_users', []).filter(u => u.role === 'writer' && !u.blocked);
}

// Open / close modal
function openM(id) { document.getElementById(id).classList.add('open'); }

function closeM(id) { document.getElementById(id).classList.remove('open'); }

// Show error/success message inside a form
function formMsg(elId, msg, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = `<div style="padding:9px 13px; border-radius:9px; font-size:12px; margin-bottom:12px;
    background:${type==='e' ? '#fef2f2' : '#f0fdf4'};
    color:${type==='e' ? '#dc2626' : '#16a34a'};
    border:1px solid ${type==='e' ? '#fecaca' : '#bbf7d0'};">${msg}</div>`;
}

// Avatar color based on username first letter
function avatarColor(name) {
    const colors = ['#2a9d8f', '#c9a84c', '#e76f51', '#457b9d', '#8338ec', '#06d6a0', '#ef476f', '#118ab2'];
    return colors[name.charCodeAt(0) % colors.length];
}

// Build avatar HTML (image or colored initial)
function avatarHTML(user, size = 30) {
    if (!user) return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#999;display:flex;align-items:center;justify-content:center;font-size:${Math.floor(size*.36)}px;font-weight:700;color:#fff;flex-shrink:0;">?</div>`;
    if (user.avatar) return `<div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;flex-shrink:0;"><img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;"/></div>`;
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${avatarColor(user.username)};display:flex;align-items:center;justify-content:center;font-size:${Math.floor(size*.36)}px;font-weight:700;color:#fff;font-family:'Playfair Display',serif;flex-shrink:0;">${user.username[0].toUpperCase()}</div>`;
}

// Animate number from 0 to target
function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 28));
    const timer = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(timer);
    }, 40);
}

// Convert file to base64 (for image upload)
function fileToBase64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// ══════════════════════════════════════════════════════════════
// PAGE ROUTER
// ══════════════════════════════════════════════════════════════

function showPage(name) {
    // Hide all pages, show selected one
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');

    // Update navbar active link
    document.querySelectorAll('.nl').forEach(l => l.classList.remove('active'));
    const link = document.getElementById('nl-' + name);
    if (link) link.classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);

    // Render page content
    if (name === 'home') renderHome();
    if (name === 'explore') renderExplore();
    if (name === 'dashboard') renderDash();
    if (name === 'profile') renderProfile();
    if (name === 'admin') renderAdmin();
    if (name === 'cdash') renderClientDash();
    if (name === 'chat') renderChatPage();
    if (name === 'about') renderFooter('afoot');
}

function goHome() {
    showPage('home');
    const nl = document.getElementById('nl-home');
    if (nl) nl.classList.add('active');
}

// Go to correct dashboard based on user role
function showDash() {
    if (!currentUser) return showPage('login');
    if (currentUser.role === 'writer') showPage('dashboard');
    else if (currentUser.role === 'client') showPage('cdash');
    else showPage('admin');
}

// ══════════════════════════════════════════════════════════════
// AUTHENTICATION
// ══════════════════════════════════════════════════════════════

// Select role on signup page (writer or client)
function pickRole(role) {
    signupRole = role;
    document.getElementById('ro-w').classList.toggle('sel', role === 'writer');
    document.getElementById('ro-c').classList.toggle('sel', role === 'client');
}

// Login
function doLogin() {
    const username = document.getElementById('li-u').value.trim();
    const password = document.getElementById('li-p').value;

    const user = LS.get('dcw_users', []).find(u => u.username === username && u.password === password);

    if (!user) {
        formMsg('li-msg', 'Invalid username or password.', 'e');
        return;
    }
    if (user.blocked) {
        formMsg('li-msg', 'Your account has been blocked. Please contact admin.', 'e');
        return;
    }

    currentUser = user;
    LS.set('dcw_session', user.id);
    afterLogin();
}

// Signup
function doSignup() {
    const username = document.getElementById('su-u').value.trim();
    const email = document.getElementById('su-e').value.trim();
    const password = document.getElementById('su-p').value;

    if (!username || !password) {
        formMsg('su-msg', 'Username and password are required.', 'e');
        return;
    }

    const users = LS.get('dcw_users', []);

    if (users.find(u => u.username === username)) {
        formMsg('su-msg', 'This username is already taken. Please choose another.', 'e');
        return;
    }

    // Create new user
    const newUser = {
        id: uid(),
        username,
        password,
        role: signupRole,
        email,
        bio: '',
        blocked: false,
        followers: [],
        following: [],
        joined: Date.now(),
        avatar: null
    };

    users.push(newUser);
    LS.set('dcw_users', users);

    currentUser = newUser;
    LS.set('dcw_session', newUser.id);
    toast('Welcome to Digital Content Writing! 🎉');
    afterLogin();
}

// Called after successful login / signup
function afterLogin() {
    // Show navbar
    document.getElementById('nav').style.display = 'flex';

    // Update user chip in navbar
    document.getElementById('nav-un').textContent = currentUser.username;
    const avEl = document.getElementById('nav-av');
    if (currentUser.avatar) {
        avEl.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;
    } else {
        document.getElementById('nav-avl').textContent = currentUser.username[0].toUpperCase();
        avEl.style.background = avatarColor(currentUser.username);
    }

    // Show/hide role-specific nav items
    document.getElementById('nav-out').style.display = 'block';
    document.getElementById('nav-chat').style.display = currentUser.role !== 'admin' ? 'block' : 'none';
    document.getElementById('nl-dashboard').style.display = currentUser.role === 'writer' ? 'block' : 'none';
    document.getElementById('nl-cdash').style.display = currentUser.role === 'client' ? 'block' : 'none';
    document.getElementById('nl-admin').style.display = currentUser.role === 'admin' ? 'block' : 'none';

    updateChatBadge();
    goHome();
}

// Logout
function doLogout() {
    currentUser = null;
    localStorage.removeItem('dcw_session');

    // Hide navbar and role-specific items
    document.getElementById('nav').style.display = 'none';
    ['nl-dashboard', 'nl-cdash', 'nl-admin'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.getElementById('nav-out').style.display = 'none';
    document.getElementById('nav-chat').style.display = 'none';

    showPage('login');
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════

function renderHome() {
    const posts = getAllPosts();
    const writers = getWriters();
    const users = LS.get('dcw_users', []);

    // Animate stats
    animateNumber('h-w', writers.length);
    animateNumber('h-p', posts.length);
    animateNumber('h-r', users.filter(u => u.role === 'client').length);

    // Featured posts (top 3)
    renderFeaturedPosts(posts.slice(0, 3));

    // Category grid
    renderCategoryGrid(posts);

    // Writers grid
    renderWritersGrid(writers, posts);

    renderFooter('hfoot');
}

function renderFeaturedPosts(featured) {
    const container = document.getElementById('fg');
    if (!featured.length) {
        container.innerHTML = '<p style="color:var(--tm)">No posts yet.</p>';
        return;
    }
    // First post = big card, rest = small cards
    container.innerHTML = `
    <div class="pc pcb" onclick="openPost('${featured[0].id}')">
      ${thumbHTML(featured[0], true)}
      <div class="pbody">
        ${authorHTML(featured[0])}
        <span class="tag tg-t" style="margin-bottom:9px;display:inline-block;">${featured[0].category}</span>
        <h3 class="ptitle">${featured[0].title}</h3>
        <p class="pexc">${featured[0].excerpt}</p>
        <div class="pfoot">${statsHTML(featured[0])}<span class="tag tg-i">${featured[0].type}</span></div>
      </div>
    </div>
    ${featured.slice(1).map(p => `
      <div class="pc" onclick="openPost('${p.id}')">
        <div class="pbody pbsm">
          ${authorHTML(p)}
          <span class="tag tg-g" style="margin-bottom:7px;display:inline-block;">${p.category}</span>
          <h3 class="ptitle ptsm">${p.title}</h3>
          <div class="pfoot">${statsHTML(p)}<span class="tag tg-t">${p.type}</span></div>
        </div>
      </div>`).join('')}`;
}

function renderCategoryGrid(posts) {
  // Count posts per category
  const counts = {};
  CATS.slice(1).forEach(c => counts[c] = posts.filter(p => p.category === c).length);

  document.getElementById('hcats').innerHTML = CATS.slice(1).map(c => `
    <div class="catcard" onclick="filterByCat('${c}')">
      <div class="catic">${CAT_ICONS[c]}</div>
      <div class="catn">${c}</div>
      <div class="catcnt">${counts[c] || 0} posts</div>
    </div>`).join('');
}

function renderWritersGrid(writers, posts) {
  document.getElementById('hwrit').innerHTML = writers.map(w => {
    const writerPosts  = posts.filter(p => p.authorId === w.id);
    const isFollowing  = currentUser && w.followers.includes(currentUser.id);
    return `
      <div class="wcard">
        <div class="wav" style="background:${avatarColor(w.username)};margin:0 auto 11px;">
          ${w.avatar ? `<img src="${w.avatar}" style="width:100%;height:100%;object-fit:cover;"/>` : w.username[0].toUpperCase()}
        </div>
        <div class="wn">${w.username}</div>
        <div class="wb">${w.bio || 'Writer on Digital Content Writing'}</div>
        <div class="wsts">
          <div><div class="wsn">${writerPosts.length}</div><div class="wsl">Posts</div></div>
          <div><div class="wsn">${w.followers.length}</div><div class="wsl">Followers</div></div>
        </div>
        ${currentUser && currentUser.role === 'client' ? `
          <button class="btn btn-g btn-sm" style="width:100%;margin-bottom:5px;" onclick="event.stopPropagation();openEngage('${w.id}')">
            📨 Hire
          </button>` : ''}
        <button class="btn ${isFollowing ? 'btn-gh' : 'btn-t'} btn-sm" style="width:100%;"
          onclick="event.stopPropagation();toggleFollow('${w.id}',this)">
          ${isFollowing ? '✓ Following' : '+ Follow'}
        </button>
      </div>`;
  }).join('');
}

// Build thumbnail HTML for a post
function thumbHTML(post, big = false) {
  const h = big ? '280px' : '175px';
  if (post.img && (post.img.startsWith('http') || post.img.startsWith('data:'))) {
    return `<div style="width:100%;height:${h};overflow:hidden;">
      <img src="${post.img}" style="width:100%;height:100%;object-fit:cover;"
        onerror="this.parentElement.innerHTML='<div style=height:${h};background:var(--paper2);display:flex;align-items:center;justify-content:center;font-size:56px>📄</div>'"/>
      </div>`;
  }
  return `<div style="width:100%;height:${h};background:var(--paper2);display:flex;align-items:center;justify-content:center;font-size:${big?60:44}px;">
    ${post.img || '📄'}</div>`;
}

// Build author info HTML
function authorHTML(post) {
  const user = getUser(post.authorId);
  if (!user) return '';
  return `<div class="pau">
    ${avatarHTML(user, 28).replace('<div', '<div class="wav"')}
    <div>
      <div class="pavn">${user.username}</div>
      <div class="pavd">${timeAgo(post.createdAt)}</div>
    </div>
  </div>`;
}

// Build post stats HTML (likes, comments, shares)
function statsHTML(post) {
  return `<div class="psts">
    <span class="pst">❤️ ${post.likes.length}</span>
    <span class="pst">💬 ${post.comments.length}</span>
    <span class="pst">🔗 ${post.shares || 0}</span>
  </div>`;
}

// Build footer HTML
function renderFooter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `
    <div class="fgrid">
      <div>
        <div class="fbrand">Digital <span>Content Writing</span></div>
        <div class="fdesc">A premium content platform connecting writers with readers worldwide. 45+ posts across 5 categories.</div>
        <div class="fsocs">
          <div class="fsoc">🌐</div><div class="fsoc">🐦</div>
          <div class="fsoc">📘</div><div class="fsoc">💼</div>
        </div>
      </div>
      <div>
        <div class="fhead">Platform</div>
        <div class="flink" onclick="showPage('explore')">Explore</div>
        <div class="flink" onclick="showPage('about')">About</div>
      </div>
      <div>
        <div class="fhead">Writers</div>
        <div class="flink">How it Works</div>
        <div class="flink">Guidelines</div>
      </div>
      <div>
        <div class="fhead">Support</div>
        <div class="flink">Help Center</div>
        <div class="flink">Contact</div>
      </div>
    </div>
    <div class="fbot">
      <div>© 2026 Digital Content Writing · Made with ❤️ in India</div>
      <div>support@DitalContentWiting.com · +91 7223014089</div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════
// EXPLORE PAGE
// ══════════════════════════════════════════════════════════════

function renderExplore() {
  buildFilterBar();
  renderExplorePosts();
}

// Build category filter pills
function buildFilterBar() {
  document.getElementById('fbar').innerHTML = CATS.map(c =>
    `<button class="fpill ${c === activeCat ? 'active' : ''}" onclick="setCategory('${c}')">
      ${CAT_ICONS[c]} ${c}
    </button>`
  ).join('');
}

// Set active category
function setCategory(cat) {
  activeCat = cat;
  buildFilterBar();
  renderExplorePosts();
}

// Set active type tab (all / article / blog / content)
function setTTab(type, el) {
  activeTab = type;
  document.querySelectorAll('.ttab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderExplorePosts();
}

// Search button clicked
function doSearch() {
  searchQuery = document.getElementById('si').value.trim().toLowerCase();
  renderExplorePosts();
}

// Filter from home page category cards
function filterByCat(cat) {
  activeCat = cat;
  showPage('explore');
}

// Render the posts grid on explore page
function renderExplorePosts() {
  let posts = getAllPosts();

  // Apply type filter
  if (activeTab !== 'all') posts = posts.filter(p => p.type === activeTab);

  // Apply category filter
  if (activeCat !== 'All') posts = posts.filter(p => p.category === activeCat);

  // Apply search filter
  if (searchQuery) {
    posts = posts.filter(p => {
      const author = getUser(p.authorId) || { username: '' };
      return p.title.toLowerCase().includes(searchQuery)
        || p.excerpt.toLowerCase().includes(searchQuery)
        || p.category.toLowerCase().includes(searchQuery)
        || author.username.toLowerCase().includes(searchQuery);
    });
  }

  const grid = document.getElementById('exgrid');

  if (!posts.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:56px;color:var(--tl);">
        <div style="font-size:44px;margin-bottom:11px;">🔍</div>
        <p>No posts found. Try a different search or filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = posts.map(p => `
    <div class="pc" onclick="openPost('${p.id}')">
      ${thumbHTML(p)}
      <div class="pbody">
        ${authorHTML(p)}
        <div style="display:flex;gap:5px;margin-bottom:9px;flex-wrap:wrap;">
          <span class="tag tg-t">${p.type}</span>
          <span class="tag tg-g">${p.category}</span>
        </div>
        <h3 class="ptitle ptsm" style="font-size:15px;margin-bottom:6px;">${p.title}</h3>
        <p style="font-size:12px;color:var(--tm);line-height:1.5;margin-bottom:11px;">${p.excerpt}</p>
        <div class="pfoot">${statsHTML(p)}<span style="font-size:11px;color:var(--tl);">Read →</span></div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// POST DETAIL PAGE
// ══════════════════════════════════════════════════════════════

function openPost(postId) {
  viewPostId = postId;
  const post   = getPost(postId);
  if (!post) return;

  const author    = getUser(post.authorId);
  const isLoggedIn = !!currentUser;
  const hasLiked   = currentUser && post.likes.includes(currentUser.id);
  const isFollowing = currentUser && author && author.followers.includes(currentUser.id);
  const isOwner    = currentUser && currentUser.id === post.authorId;

  // Split content: show first 2 paragraphs, lock the rest for guests
  const paragraphs  = post.content.split('\n\n').filter(s => s.trim());
  const firstTwo    = paragraphs.slice(0, 2);
  const remaining   = paragraphs.slice(2);

  // Liked-by names (show up to 3)
  const likerNames = post.likes.slice(0, 3).map(id => {
    const u = getUser(id);
    return u ? u.username : '?';
  });
  const likerLabel = likerNames.length
    ? likerNames.join(', ') + (post.likes.length > 3 ? ` +${post.likes.length-3} more` : '')
    : '';

  showPage('post');
  const nl = document.getElementById('nl-explore');
  if (nl) nl.classList.add('active');

  document.getElementById('pdwrap').innerHTML = `
    <div class="pdwrap">
      <!-- Back button -->
      <button class="btn btn-gh btn-sm" onclick="showPage('explore')" style="margin-bottom:14px;">← Back</button>

      <!-- Tags -->
      <div class="pdtags">
        <span class="tag tg-t">${post.type}</span>
        <span class="tag tg-g">${post.category}</span>
      </div>

      <!-- Title -->
      <h1 class="pdtitle">${post.title}</h1>

      <!-- Author + action buttons -->
      <div class="pdmeta">
        <div style="display:flex;align-items:center;gap:9px;">
          ${avatarHTML(author, 40)}
          <div>
            <div style="font-size:14px;font-weight:700;">${author ? author.username : '?'}</div>
            <div style="font-size:10px;color:var(--tl);">${timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <div class="pdacts">
          <!-- Like button -->
          <button class="btn btn-sm ${hasLiked ? 'btn-t' : 'btn-gh'}" id="lbtn-${postId}" onclick="toggleLike('${postId}')">
            ${hasLiked ? '❤️' : '🤍'} <span id="lc-${postId}">${post.likes.length}</span>
          </button>
          <!-- Share button -->
          <button class="btn btn-sm btn-gh" onclick="sharePost('${postId}')">🔗 Share</button>

          ${currentUser && currentUser.role === 'client' && author && currentUser.id !== author.id ? `
            <button class="btn btn-sm btn-g" onclick="openEngage('${author.id}')">📨 Hire</button>
            <button class="btn btn-sm btn-pu" onclick="openChat('${author.id}')">💬 Chat</button>` : ''}

          ${isOwner ? `
            <button class="btn btn-sm btn-gh" onclick="openEditModal('${postId}')">✏️</button>
            <button class="btn btn-sm btn-d"  onclick="deletePost('${postId}')">🗑</button>` : ''}

          ${currentUser && !isOwner && author ? `
            <button class="btn btn-sm ${isFollowing ? 'btn-gh' : 'btn-t'}" id="fol-${author.id}"
              onclick="toggleFollow('${author.id}',this)">
              ${isFollowing ? '✓ Following' : '+ Follow'}
            </button>` : ''}
        </div>
      </div>

      <!-- Liked by names -->
      ${likerLabel ? `<div class="lknames" onclick="showLikesModal('${postId}')">❤️ Liked by <strong>${likerLabel}</strong></div>` : ''}

      <div style="margin-bottom:22px;"></div>

      <!-- Cover image -->
      ${thumbHTML(post, true)}

      <!-- First 2 paragraphs (always visible) -->
      <div class="pdbody">${firstTwo.map(p => `<p>${p}</p>`).join('')}</div>

      <!-- Lock overlay for guests -->
      ${!isLoggedIn && remaining.length ? `
        <div class="lock-ov">
          <div class="lock-bx">
            <div style="font-size:40px;margin-bottom:12px;">🔒</div>
            <h3 style="font-size:18px;font-weight:700;margin-bottom:6px;">Continue Reading</h3>
            <p style="font-size:13px;color:var(--tm);margin-bottom:18px;">
              Create a free account to read the full article on Digital Content Writing.
            </p>
            <div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-p" onclick="showPage('signup')">Join Free →</button>
              <button class="btn btn-gh" onclick="showPage('login')">Sign In</button>
            </div>
          </div>
        </div>` : ''}

      <!-- Remaining paragraphs (logged-in users) -->
      ${isLoggedIn && remaining.length ? `
        <div class="pdbody">${remaining.map(p => `<p>${p}</p>`).join('')}</div>` : ''}

      <!-- Comments section (logged-in users only) -->
      ${isLoggedIn ? `
        <div class="cmtsec">
          <h3 style="font-size:18px;font-weight:700;margin-bottom:18px;">💬 Comments (${post.comments.length})</h3>
          <!-- Comment form -->
          <div class="cmtform">
            <div style="font-size:13px;font-weight:600;margin-bottom:9px;">Leave a comment</div>
            <textarea class="fi" id="cinp-${postId}" placeholder="Share your thoughts…" style="min-height:75px;"></textarea>
            <div style="margin-top:9px;text-align:right;">
              <button class="btn btn-p btn-sm" onclick="addComment('${postId}')">Post Comment</button>
            </div>
          </div>
          <!-- Comment list -->
          <div id="clist-${postId}">${post.comments.map(c => commentHTML(c)).join('')}</div>
        </div>` : `
        <div style="padding:24px;text-align:center;color:var(--tm);">
          <a onclick="showPage('login')" style="color:var(--teal);font-weight:600;cursor:pointer;">Sign in</a> to comment.
        </div>`}
    </div>`;
}

// Build HTML for a single comment
function commentHTML(c) {
  const user = getUser(c.userId);
  return `
    <div class="cmtitem">
      ${avatarHTML(user, 32).replace('<div', '<div class="cav"')}
      <div style="flex:1;">
        <div style="display:flex;gap:7px;align-items:baseline;">
          <div style="font-size:13px;font-weight:700;">${user ? user.username : '?'}</div>
          <div style="font-size:10px;color:var(--tl);">${timeAgo(c.ts)}</div>
        </div>
        <div style="font-size:13px;color:var(--tm);line-height:1.55;margin-top:4px;">${c.text}</div>
      </div>
    </div>`;
}

// Add a new comment
function addComment(postId) {
  if (!currentUser) { toast('Please login to comment', 'e'); return; }
  const inp = document.getElementById('cinp-' + postId);
  const val = inp ? inp.value.trim() : '';
  if (!val) return;

  const posts = LS.get('dcw_posts', []);
  const post  = posts.find(p => p.id === postId);
  if (!post) return;

  const newComment = { id: uid(), userId: currentUser.id, text: val, ts: Date.now() };
  post.comments.push(newComment);
  LS.set('dcw_posts', posts);

  inp.value = '';

  // Update DOM without re-rendering whole page
  const list = document.getElementById('clist-' + postId);
  if (list) list.insertAdjacentHTML('beforeend', commentHTML(newComment));

  const heading = document.querySelector('.cmtsec h3');
  if (heading) heading.textContent = `💬 Comments (${post.comments.length})`;

  toast('Comment posted!');
}

// Toggle like on a post
function toggleLike(postId) {
  if (!currentUser) { toast('Please login to like posts', 'e'); return; }

  const posts = LS.get('dcw_posts', []);
  const post  = posts.find(p => p.id === postId);
  if (!post) return;

  const idx = post.likes.indexOf(currentUser.id);
  if (idx >= 0) {
    post.likes.splice(idx, 1); // remove like
  } else {
    post.likes.push(currentUser.id); // add like
  }

  LS.set('dcw_posts', posts);
  const liked = post.likes.includes(currentUser.id);

  // Update like button without re-rendering
  const btn = document.getElementById('lbtn-' + postId);
  if (btn) {
    btn.className = `btn btn-sm ${liked ? 'btn-t' : 'btn-gh'}`;
    btn.innerHTML = `${liked ? '❤️' : '🤍'} <span id="lc-${postId}">${post.likes.length}</span>`;
  }

  // Update liked-by names
  const likerNames = post.likes.slice(0, 3).map(id => {
    const u = getUser(id);
    return u ? u.username : '?';
  });
  const label = likerNames.length
    ? likerNames.join(', ') + (post.likes.length > 3 ? ` +${post.likes.length-3} more` : '')
    : '';

  let lkRow = document.querySelector('.lknames');
  if (label && !lkRow) {
    const meta = document.querySelector('.pdmeta');
    if (meta) meta.insertAdjacentHTML('afterend',
      `<div class="lknames" onclick="showLikesModal('${postId}')">❤️ Liked by <strong>${label}</strong></div>`);
  } else if (label && lkRow) {
    lkRow.innerHTML = `❤️ Liked by <strong>${label}</strong>`;
    lkRow.onclick = () => showLikesModal(postId);
  } else if (!label && lkRow) {
    lkRow.remove();
  }

  toast(liked ? 'Liked! ❤️' : 'Unliked');
}

// Show modal with all likers
function showLikesModal(postId) {
  const post = getPost(postId);
  if (!post || !post.likes.length) return;

  document.getElementById('likes-list').innerHTML = post.likes.map(id => {
    const user = getUser(id);
    return user ? `
      <div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--paper3);">
        ${avatarHTML(user, 34)}
        <span style="font-weight:600;">${user.username}</span>
      </div>` : '';
  }).join('');

  openM('m-likes');
}

// Share a post
function sharePost(postId) {
  const posts = LS.get('dcw_posts', []);
  const post  = posts.find(p => p.id === postId);
  if (post) { post.shares = (post.shares || 0) + 1; LS.set('dcw_posts', posts); }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(location.href + '#' + postId).then(() => toast('Link copied! 🔗'));
  } else {
    toast('Shared!');
  }
}

// Follow / unfollow a writer
function toggleFollow(writerId, btn) {
  if (!currentUser) { toast('Please login to follow writers', 'e'); return; }
  if (currentUser.id === writerId) { toast('You cannot follow yourself', 'e'); return; }

  const users  = LS.get('dcw_users', []);
  const writer = users.find(u => u.id === writerId);
  const me     = users.find(u => u.id === currentUser.id);
  if (!writer || !me) return;

  const idx = writer.followers.indexOf(currentUser.id);
  if (idx >= 0) {
    // Unfollow
    writer.followers.splice(idx, 1);
    me.following = me.following.filter(id => id !== writerId);
  } else {
    // Follow
    writer.followers.push(currentUser.id);
    if (!me.following.includes(writerId)) me.following.push(writerId);
  }

  LS.set('dcw_users', users);
  currentUser = users.find(u => u.id === currentUser.id);

  const isNowFollowing = writer.followers.includes(currentUser.id);
  if (btn) {
    btn.textContent  = isNowFollowing ? '✓ Following' : '+ Follow';
    btn.className    = `btn ${isNowFollowing ? 'btn-gh' : 'btn-t'} btn-sm`;
  }

  toast(isNowFollowing ? `Following ${writer.username}!` : `Unfollowed ${writer.username}`);
}

// ══════════════════════════════════════════════════════════════
// EDIT / DELETE POST
// ══════════════════════════════════════════════════════════════

// Open edit modal with existing post data
function openEditModal(postId) {
  const post = getPost(postId);
  if (!post) return;

  document.getElementById('e-pid').value   = postId;
  document.getElementById('e-title').value = post.title;
  document.getElementById('e-exc').value   = post.excerpt || '';
  document.getElementById('e-cont').value  = post.content;
  document.getElementById('e-cat').value   = post.category;
  document.getElementById('e-img').value   = (post.img && post.img.startsWith('http')) ? post.img : '';
  document.getElementById('e-iprev').innerHTML = '';

  openM('m-edit');
}

// Save edited post
async function saveEdit() {
  const postId = document.getElementById('e-pid').value;
  const posts  = LS.get('dcw_posts', []);
  const post   = posts.find(p => p.id === postId);
  if (!post) return;

  post.title    = document.getElementById('e-title').value.trim();
  post.excerpt  = document.getElementById('e-exc').value.trim();
  post.content  = document.getElementById('e-cont').value.trim();
  post.category = document.getElementById('e-cat').value;

  const imgUrl  = document.getElementById('e-img').value.trim();
  const imgFile = document.getElementById('e-ifile').files[0];
  if (imgFile)      post.img = await fileToBase64(imgFile);
  else if (imgUrl)  post.img = imgUrl;

  LS.set('dcw_posts', posts);
  closeM('m-edit');
  toast('Post updated!');

  // Refresh current view
  if (viewPostId === postId) openPost(postId);
  else showDTab(dashTab);
}

// Preview edit image
function prevEImg(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('e-iprev').innerHTML =
        `<img src="${e.target.result}" style="max-width:100%;border-radius:7px;max-height:130px;object-fit:cover;"/>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Delete a post (soft delete)
function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  const posts = LS.get('dcw_posts', []);
  const post  = posts.find(p => p.id === postId);
  if (!post) return;

  post.deleted = true;
  LS.set('dcw_posts', posts);
  toast('Post deleted');

  if (currentUser && currentUser.role === 'writer') showDTab('posts');
  else if (currentUser && currentUser.role === 'admin') adminTab('po');
  else showPage('explore');
}

// ══════════════════════════════════════════════════════════════
// WRITER DASHBOARD
// ══════════════════════════════════════════════════════════════

function renderDash() {
  if (!currentUser || currentUser.role !== 'writer') return;
  updateRequestBadge();
  showDTab(dashTab);
}

// Update red badge on Requests tab
function updateRequestBadge() {
  const pending = LS.get('dcw_requests', []).filter(r => r.writerId === currentUser.id && r.status === 'pending');
  const badge   = document.getElementById('rbadge');
  if (badge) {
    badge.style.display = pending.length ? 'inline' : 'none';
    badge.textContent   = pending.length;
  }
}

// Switch dashboard tab
function showDTab(tab) {
  dashTab = tab;

  // Update sidebar active state
  document.querySelectorAll('.di').forEach(i => i.classList.remove('active'));
  const el = document.getElementById('dn-' + tab);
  if (el) el.classList.add('active');

  const main  = document.getElementById('dmain');
  const posts = getAllPosts().filter(p => p.authorId === currentUser.id);
  const totalLikes    = posts.reduce((a, p) => a + p.likes.length, 0);
  const totalComments = posts.reduce((a, p) => a + p.comments.length, 0);

  if (tab === 'ov') {
    // Overview tab
    main.innerHTML = `
      <div class="dhdr">
        <div>
          <div style="font-size:12px;color:var(--tm);margin-bottom:2px;">Welcome back,</div>
          <div class="dtitle">${currentUser.username} ✦</div>
        </div>
        <button class="btn btn-p" onclick="showDTab('create')">+ New Post</button>
      </div>

      <!-- Stats cards -->
      <div class="sgrid">
        <div class="sc"><div class="scic">📄</div><div class="scn">${posts.length}</div><div class="scl">Total Posts</div></div>
        <div class="sc"><div class="scic">❤️</div><div class="scn">${totalLikes}</div><div class="scl">Total Likes</div></div>
        <div class="sc"><div class="scic">💬</div><div class="scn">${totalComments}</div><div class="scl">Comments</div></div>
        <div class="sc"><div class="scic">👥</div><div class="scn">${(getUser(currentUser.id) || {followers:[]}).followers.length}</div><div class="scl">Followers</div></div>
        <div class="sc"><div class="scic">🔗</div><div class="scn">${posts.reduce((a,p) => a+(p.shares||0), 0)}</div><div class="scl">Shares</div></div>
      </div>

      <!-- Recent posts table -->
      <div style="font-size:16px;font-weight:700;margin-bottom:13px;font-family:'Playfair Display',serif;">Recent Posts</div>
      <div class="twrap">
        <table>
          <thead><tr><th>Title</th><th>Type</th><th>Likes</th><th>Comments</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            ${posts.slice(0, 8).map(p => `
              <tr>
                <td><strong style="cursor:pointer;color:var(--teal);" onclick="openPost('${p.id}')">${p.title.slice(0,38)}${p.title.length>38?'…':''}</strong></td>
                <td><span class="tag tg-t">${p.type}</span></td>
                <td>❤️ ${p.likes.length}</td>
                <td>💬 ${p.comments.length}</td>
                <td style="color:var(--tl);">${timeAgo(p.createdAt)}</td>
                <td>
                  <div style="display:flex;gap:4px;">
                    <button class="btn btn-gh btn-sm" onclick="openEditModal('${p.id}')">Edit</button>
                    <button class="btn btn-d  btn-sm" onclick="deletePost('${p.id}')">Del</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (tab === 'posts') {
    // All posts tab
    main.innerHTML = `
      <div class="dhdr">
        <div class="dtitle">My Posts</div>
        <button class="btn btn-p" onclick="showDTab('create')">+ New Post</button>
      </div>
      <div class="twrap">
        <table>
          <thead><tr><th>Title</th><th>Type</th><th>Category</th><th>❤️</th><th>💬</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            ${posts.length ? posts.map(p => `
              <tr>
                <td><strong style="cursor:pointer;color:var(--teal);" onclick="openPost('${p.id}')">${p.title.slice(0,34)}${p.title.length>34?'…':''}</strong></td>
                <td><span class="tag tg-t">${p.type}</span></td>
                <td><span class="tag tg-g">${p.category}</span></td>
                <td>${p.likes.length}</td>
                <td>${p.comments.length}</td>
                <td style="color:var(--tl);">${timeAgo(p.createdAt)}</td>
                <td>
                  <div style="display:flex;gap:4px;">
                    <button class="btn btn-gh btn-sm" onclick="openEditModal('${p.id}')">Edit</button>
                    <button class="btn btn-d  btn-sm" onclick="deletePost('${p.id}')">Del</button>
                  </div>
                </td>
              </tr>`).join('')
            : `<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--tl);">No posts yet. Create your first post!</td></tr>`}
          </tbody>
        </table>
      </div>`;

  } else if (tab === 'create') {
    // Create post tab
    main.innerHTML = `
      <div class="dtitle" style="margin-bottom:22px;">Create New Post</div>
      <div style="max-width:680px;">
        <!-- Post type selector -->
        <div class="fg">
          <label class="fl">Post Type</label>
          <div class="ptype-grid">
            <div class="ptc sel" id="pt-article" onclick="pickPostType('article')">
              <div style="font-size:24px;margin-bottom:5px;">📰</div>
              <div style="font-size:13px;font-weight:600;">Article</div>
            </div>
            <div class="ptc" id="pt-blog" onclick="pickPostType('blog')">
              <div style="font-size:24px;margin-bottom:5px;">✍️</div>
              <div style="font-size:13px;font-weight:600;">Blog</div>
            </div>
            <div class="ptc" id="pt-content" onclick="pickPostType('content')">
              <div style="font-size:24px;margin-bottom:5px;">📋</div>
              <div style="font-size:13px;font-weight:600;">Content</div>
            </div>
          </div>
        </div>
        <div class="fg"><label class="fl">Title *</label>    <input class="fi" id="cr-t" placeholder="Write a compelling title…"/></div>
        <div class="fg">
          <label class="fl">Category</label>
          <select class="fi" id="cr-c">
            ${CATS.slice(1).map(c => `<option>${c}</option>`).join('')}
          </select>
        </div>
        <div class="fg"><label class="fl">Excerpt *</label>  <input class="fi" id="cr-e" placeholder="Short summary shown on cards…"/></div>
        <div class="fg"><label class="fl">Full Content *</label><textarea class="fi" id="cr-ct" style="min-height:180px;" placeholder="Write your full post here… (leave blank lines between paragraphs)"></textarea></div>
        <div class="fg"><label class="fl">Cover Image URL</label><input class="fi" id="cr-iu" placeholder="https://…" onchange="previewCreateImg()"/></div>
        <div class="fg"><label class="fl">Or Upload Image</label><input type="file" id="cr-if" accept="image/*" class="fi" onchange="previewCreateImgFile(this)"/></div>
        <div id="cr-iprev" style="margin-bottom:14px;"></div>
        <div style="display:flex;gap:11px;">
          <button class="btn btn-p" onclick="submitPost()">Publish Post →</button>
          <button class="btn btn-gh" onclick="showDTab('posts')">Cancel</button>
        </div>
      </div>`;
    postType = 'article'; // reset to default

  } else if (tab === 'reqs') {
    // Engagement requests tab
    const requests = LS.get('dcw_requests', [])
      .filter(r => r.writerId === currentUser.id)
      .sort((a, b) => b.createdAt - a.createdAt);

    main.innerHTML = `
      <div class="dtitle" style="margin-bottom:22px;">📨 Engagement Requests</div>
      ${requests.length ? requests.map(r => {
        const client = getUser(r.clientId);
        return `
          <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--rlg);padding:18px;margin-bottom:13px;">
            <!-- Client info + status -->
            <div style="display:flex;align-items:center;gap:9px;margin-bottom:11px;">
              ${avatarHTML(client, 34)}
              <div>
                <div style="font-weight:700;">${client ? client.username : 'Client'}</div>
                <div style="font-size:10px;color:var(--tl);">${timeAgo(r.createdAt)}</div>
              </div>
              <span class="tag ${r.status==='pending' ? 'tg-ye' : r.status==='accepted' ? 'tg-gr' : 'tg-re'}" style="margin-left:auto;">
                ${r.status}
              </span>
            </div>
            <!-- Project details -->
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${r.projectTitle}</div>
            <div style="font-size:12px;color:var(--tm);margin-bottom:7px;">${r.projectDesc}</div>
            <div class="tlpill" style="margin-bottom:11px;">⏱ Deadline: ${r.deadline}</div>
            ${r.budget ? `<div style="font-size:11px;color:var(--tm);margin-bottom:11px;">💰 Budget: ${r.budget}</div>` : ''}
            <!-- Action buttons -->
            <div style="display:flex;gap:7px;">
              ${r.status === 'pending' ? `
                <button class="btn btn-t btn-sm" onclick="respondRequest('${r.id}','accepted')">✓ Accept</button>
                <button class="btn btn-d btn-sm" onclick="respondRequest('${r.id}','declined')">✕ Decline</button>` : ''}
              <button class="btn btn-gh btn-sm" onclick="openChat('${r.clientId}')">💬 Chat</button>
            </div>
          </div>`;
      }).join('')
      : `<div style="text-align:center;padding:56px;color:var(--tl);">
          <div style="font-size:44px;margin-bottom:11px;">📭</div>
          <p>No engagement requests yet.</p>
        </div>`}`;

    updateRequestBadge();
  }
}

// Pick post type (article / blog / content)
function pickPostType(type) {
  postType = type;
  document.querySelectorAll('.ptc').forEach(c => c.classList.remove('sel'));
  const el = document.getElementById('pt-' + type);
  if (el) el.classList.add('sel');
}

// Preview create post image URL
function previewCreateImg() {
  const url  = document.getElementById('cr-iu').value.trim();
  const prev = document.getElementById('cr-iprev');
  prev.innerHTML = url ? `<img src="${url}" style="max-width:100%;max-height:140px;object-fit:cover;border-radius:9px;"/>` : '';
}

// Preview create post image file
function previewCreateImgFile(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('cr-iprev').innerHTML =
        `<img src="${e.target.result}" style="max-width:100%;max-height:140px;object-fit:cover;border-radius:9px;"/>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Submit new post
async function submitPost() {
  if (!currentUser || currentUser.role !== 'writer') {
    toast('Only writers can create posts', 'e');
    return;
  }

  const title   = document.getElementById('cr-t').value.trim();
  const excerpt = document.getElementById('cr-e').value.trim();
  const content = document.getElementById('cr-ct').value.trim();
  const cat     = document.getElementById('cr-c').value;
  const imgUrl  = document.getElementById('cr-iu').value.trim();
  const imgFile = document.getElementById('cr-if').files[0];

  if (!title || !excerpt || !content) {
    toast('Please fill in all required fields', 'e');
    return;
  }

  // Default emoji per category
  const emojiMap = { Business:'📈', Technology:'💡', Education:'📚', Travel:'✈️', Health:'🌿', Other:'✦' };
  let img = imgUrl || emojiMap[cat] || '📄';
  if (imgFile) img = await fileToBase64(imgFile);

  const posts = LS.get('dcw_posts', []);

  // Add to beginning (newest first)
  posts.unshift({
    id: uid(), authorId: currentUser.id,
    type: postType, category: cat,
    title, excerpt, content, img,
    likes: [], comments: [], shares: 0,
    deleted: false, createdAt: Date.now()
  });

  LS.set('dcw_posts', posts);
  toast('Post published! 🎉');
  showDTab('posts');
}

// ══════════════════════════════════════════════════════════════
// ENGAGEMENT REQUESTS
// ══════════════════════════════════════════════════════════════

// Open engagement request modal
function openEngage(writerId) {
  if (!currentUser) { toast('Please login first', 'e'); return; }
  if (currentUser.role !== 'client') { toast('Only clients can send hire requests', 'e'); return; }

  // Reset form
  document.getElementById('eng-wid').value = writerId;
  document.getElementById('eng-pt').value  = '';
  document.getElementById('eng-pd').value  = '';
  document.getElementById('eng-dl').value  = '';
  document.getElementById('eng-bg').value  = '';
  document.getElementById('eng-dl').min    = new Date().toISOString().split('T')[0];

  openM('m-engage');
}

// Send engagement request
function sendReq() {
  const writerId = document.getElementById('eng-wid').value;
  const title    = document.getElementById('eng-pt').value.trim();
  const desc     = document.getElementById('eng-pd').value.trim();
  const deadline = document.getElementById('eng-dl').value;
  const budget   = document.getElementById('eng-bg').value.trim();

  if (!title || !desc || !deadline) {
    toast('Please fill in all required fields', 'e');
    return;
  }

  // Create request object
  const newRequest = {
    id: uid(), clientId: currentUser.id, writerId,
    projectTitle: title, projectDesc: desc,
    deadline, budget, status: 'pending',
    createdAt: Date.now()
  };

  const requests = LS.get('dcw_requests', []);
  requests.push(newRequest);
  LS.set('dcw_requests', requests);

  // Send as a card message in chat
  const chatId = getChatId(currentUser.id, writerId);
  addMessage(chatId, currentUser.id, null, {
    type: 'request', reqId: newRequest.id,
    projectTitle: title, projectDesc: desc,
    deadline, budget
  });

  closeM('m-engage');
  toast('Request sent successfully! ✅');
  openChat(writerId);
}

// Accept or decline a request (from dashboard)
function respondRequest(requestId, status) {
  const requests = LS.get('dcw_requests', []);
  const req      = requests.find(r => r.id === requestId);
  if (!req) return;

  req.status = status;
  LS.set('dcw_requests', requests);

  // Send system message in chat
  const chatId = getChatId(req.clientId, req.writerId);
  addMessage(chatId, currentUser.id, null, {
    type: 'system',
    text: `${currentUser.username} ${status} the request: "${req.projectTitle}" ${status==='accepted' ? '✅' : '❌'}`
  });

  toast(status === 'accepted' ? 'Request accepted!' : 'Request declined.');
  showDTab('reqs');
  if (status === 'accepted') openChat(req.clientId);
}

// ══════════════════════════════════════════════════════════════
// CHAT SYSTEM
// ══════════════════════════════════════════════════════════════

// Get unique chat ID for two users (sorted so A↔B = B↔A)
function getChatId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

// Get all chats from storage
function getChats() { return LS.get('dcw_chats', {}); }

// Save chats to storage
function saveChats(chats) { LS.set('dcw_chats', chats); }

// Get a single conversation data
function getChatData(chatId) {
  const chats = getChats();
  return chats[chatId] || { msgs: [], deadline: null };
}

// Add a message to a conversation
function addMessage(chatId, fromId, text, special = null) {
  const chats = getChats();
  if (!chats[chatId]) chats[chatId] = { msgs: [], deadline: null };
  chats[chatId].msgs.push({
    id: uid(), from: fromId, text,
    special, ts: Date.now(), read: false
  });
  saveChats(chats);
  updateChatBadge();
}

// Update the unread messages badge in navbar
function updateChatBadge() {
  if (!currentUser) return;
  const chats = getChats();
  let unread = 0;
  Object.entries(chats).forEach(([chatId, data]) => {
    if (chatId.includes(currentUser.id)) {
      unread += data.msgs.filter(m => m.from !== currentUser.id && !m.read).length;
    }
  });
  const badge = document.getElementById('cbadge');
  if (badge) {
    badge.style.display = unread ? 'inline' : 'none';
    badge.textContent   = unread;
  }
}

// Open chat with a specific user
function openChat(otherId) {
  if (!currentUser) { toast('Please login first', 'e'); return; }
  activeChatId = getChatId(currentUser.id, otherId);
  showPage('chat');
  renderChatPage();
  setTimeout(() => openChatConversation(otherId), 80);
}

// Render the chat page (conversation list in sidebar)
function renderChatPage() {
  if (!currentUser) return;

  const chats    = getChats();
  const requests = LS.get('dcw_requests', []);

  // Collect all chat partners
  const partners = new Set();
  Object.keys(chats).forEach(chatId => {
    if (chatId.includes(currentUser.id)) {
      chatId.split('_').forEach(id => { if (id !== currentUser.id) partners.add(id); });
    }
  });
  // Also include request partners
  requests.forEach(r => {
    if (r.clientId === currentUser.id) partners.add(r.writerId);
    if (r.writerId === currentUser.id) partners.add(r.clientId);
  });

  const list = document.getElementById('clist');

  if (!partners.size) {
    list.innerHTML = '<div style="padding:18px;text-align:center;color:var(--tl);font-size:12px;">No conversations yet</div>';
    return;
  }

  list.innerHTML = [...partners].map(otherId => {
    const other  = getUser(otherId);
    if (!other) return '';
    const chatId = getChatId(currentUser.id, otherId);
    const data   = chats[chatId] || { msgs: [] };
    const last   = data.msgs[data.msgs.length - 1];
    const unread = data.msgs.filter(m => m.from !== currentUser.id && !m.read).length;

    return `
      <div class="citm ${activeChatId === chatId ? 'active' : ''}" onclick="openChatConversation('${otherId}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <span class="citn">${other.username}</span>
          <div style="display:flex;align-items:center;gap:3px;">
            ${unread ? `<span class="cunread">${unread}</span>` : ''}
            <span class="cit">${last ? timeAgo(last.ts) : ''}</span>
          </div>
        </div>
        <div class="citp">${last ? (last.special ? '📨 Request' : last.text || '') : 'Start a conversation'}</div>
      </div>`;
  }).join('');
}

// Open a specific conversation
function openChatConversation(otherId) {
  if (!currentUser) return;
  activeChatId  = getChatId(currentUser.id, otherId);
  const other   = getUser(otherId);
  const data    = getChatData(activeChatId);

  // Mark messages as read
  const chats = getChats();
  if (chats[activeChatId]) {
    chats[activeChatId].msgs.forEach(m => { if (m.from !== currentUser.id) m.read = true; });
  }
  saveChats(chats);
  updateChatBadge();

  const isClient = currentUser.role === 'client';

  document.getElementById('cmain').innerHTML = `
    <!-- Top bar -->
    <div class="ctbar">
      ${avatarHTML(other, 36)}
      <div>
        <div class="ctbn">${other ? other.username : 'User'}</div>
        <div class="ctbs">${other ? other.role : ''} ${data.deadline ? '· ⏱ Due: ' + data.deadline : ''}</div>
      </div>
      ${isClient && other && other.role === 'writer' ? `
        <div style="display:flex;gap:6px;margin-left:auto;align-items:center;">
          <button class="btn btn-g btn-sm" onclick="openEngage('${otherId}')">📨 Send Request</button>
          <!-- Deadline setter -->
          <input type="date" value="${data.deadline || ''}"
            min="${new Date().toISOString().split('T')[0]}"
            style="padding:5px 9px;border:1px solid var(--paper3);border-radius:7px;font-size:11px;outline:none;"
            onchange="setDeadline('${activeChatId}', this.value)"/>
        </div>` : ''}
    </div>

    <!-- Messages -->
    <div class="cmsgs" id="cmsgs">${renderMessages(activeChatId)}</div>

    <!-- Input bar -->
    <div class="cinp">
      <input id="cinput" placeholder="Type a message…" onkeydown="if(event.key==='Enter') sendMsg('${otherId}')"/>
      <button class="btn btn-t btn-sm" onclick="sendMsg('${otherId}')">Send →</button>
    </div>`;

  // Scroll to bottom
  setTimeout(() => {
    const box = document.getElementById('cmsgs');
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);

  renderChatPage(); // refresh sidebar
}

// Build messages HTML
function renderMessages(chatId) {
  const data = getChatData(chatId);
  if (!data.msgs.length) {
    return '<div style="text-align:center;color:var(--tl);font-size:12px;padding:18px;">Start the conversation!</div>';
  }

  return data.msgs.map(msg => {
    // Special messages (system or request cards)
    if (msg.special) {
      if (msg.special.type === 'system') {
        return `<div class="msys">${msg.special.text}</div>`;
      }
      if (msg.special.type === 'request') {
        const req    = LS.get('dcw_requests', []).find(r => r.id === msg.special.reqId);
        const status = req ? req.status : 'pending';
        const isMine = msg.from === currentUser.id;

        return `
          <div style="align-self:${isMine ? 'flex-end' : 'flex-start'};max-width:68%;">
            <div class="rcard">
              <div class="rtitle">📨 Engagement Request</div>
              <div style="font-size:13px;font-weight:700;margin-bottom:3px;">${msg.special.projectTitle}</div>
              <div class="rdesc">${msg.special.projectDesc}</div>
              <div class="rtl">⏱ Deadline: ${msg.special.deadline}</div>
              ${msg.special.budget ? `<div style="font-size:10px;color:var(--tm);margin-bottom:7px;">💰 ${msg.special.budget}</div>` : ''}
              <div style="display:flex;align-items:center;gap:7px;">
                <span class="tag ${status==='pending' ? 'tg-ye' : status==='accepted' ? 'tg-gr' : 'tg-re'}">${status}</span>
                ${!isMine && status === 'pending' ? `
                  <button class="btn btn-t btn-sm" onclick="respondReqInChat('${msg.special.reqId}','accepted','${chatId}')">✓ Accept</button>
                  <button class="btn btn-d btn-sm" onclick="respondReqInChat('${msg.special.reqId}','declined','${chatId}')">✕ Decline</button>` : ''}
              </div>
            </div>
            <div style="font-size:9px;color:var(--tl);margin-top:3px;text-align:${isMine?'right':'left'};">${timeAgo(msg.ts)}</div>
          </div>`;
      }
    }

    // Normal text message
    const isMine = msg.from === currentUser.id;
    return `
      <div class="msg ${isMine ? 'sent' : 'recv'}">
        ${msg.text || ''}
        <div class="mtime">${timeAgo(msg.ts)}</div>
      </div>`;
  }).join('');
}

// Accept/decline request from within chat
function respondReqInChat(reqId, status, chatId) {
  const requests = LS.get('dcw_requests', []);
  const req      = requests.find(r => r.id === reqId);
  if (!req) return;

  req.status = status;
  LS.set('dcw_requests', requests);

  addMessage(chatId, currentUser.id, null, {
    type: 'system',
    text: `${currentUser.username} ${status} the request: "${req.projectTitle}" ${status==='accepted' ? '✅' : '❌'}`
  });

  toast(status === 'accepted' ? 'Request Accepted! ✅' : 'Declined.');

  const otherId = chatId.replace(currentUser.id, '').replace('_', '');
  openChatConversation(otherId);
  updateRequestBadge();
}

// Set project deadline in chat
function setDeadline(chatId, date) {
  if (!date) return;
  const chats = getChats();
  if (!chats[chatId]) chats[chatId] = { msgs: [], deadline: null };
  chats[chatId].deadline = date;
  saveChats(chats);

  addMessage(chatId, currentUser.id, null, {
    type: 'system',
    text: `⏱ Project deadline set to ${date}`
  });

  toast('Deadline set!');
  const otherId = chatId.replace(currentUser.id, '').replace('_', '');
  openChatConversation(otherId);
}

// Send a text message
function sendMsg(otherId) {
  const inp  = document.getElementById('cinput');
  const text = inp ? inp.value.trim() : '';
  if (!text || !activeChatId) return;

  addMessage(activeChatId, currentUser.id, text);
  inp.value = '';

  // Update chat messages in DOM
  const box = document.getElementById('cmsgs');
  if (box) {
    box.innerHTML     = renderMessages(activeChatId);
    box.scrollTop     = box.scrollHeight;
  }

  renderChatPage();
}

// ══════════════════════════════════════════════════════════════
// CLIENT HUB
// ══════════════════════════════════════════════════════════════

function renderClientDash() {
  if (!currentUser) return;

  const users   = LS.get('dcw_users', []);
  const me      = users.find(u => u.id === currentUser.id) || currentUser;
  const posts   = getAllPosts();

  const following  = users.filter(u => me.following && me.following.includes(u.id));
  const likedPosts = posts.filter(p => p.likes.includes(currentUser.id));
  const myRequests = LS.get('dcw_requests', [])
    .filter(r => r.clientId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  document.getElementById('cdash').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:11px;">
      <h2 style="font-size:24px;font-weight:700;font-family:'Playfair Display',serif;">My Hub 📖</h2>
      <div style="display:flex;gap:7px;">
        <button class="btn btn-p"  onclick="showPage('explore')">Explore →</button>
        <button class="btn btn-pu" onclick="showPage('chat')">💬 Messages</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="sgrid">
      <div class="sc"><div class="scic">👥</div><div class="scn">${following.length}</div><div class="scl">Following</div></div>
      <div class="sc"><div class="scic">❤️</div><div class="scn">${likedPosts.length}</div><div class="scl">Liked Posts</div></div>
      <div class="sc"><div class="scic">📨</div><div class="scn">${myRequests.length}</div><div class="scl">Requests Sent</div></div>
    </div>

    <!-- My requests -->
    ${myRequests.length ? `
      <div style="font-size:16px;font-weight:700;margin-bottom:12px;font-family:'Playfair Display',serif;">My Engagement Requests</div>
      ${myRequests.map(r => {
        const writer = getUser(r.writerId);
        return `
          <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--r);padding:14px;margin-bottom:9px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            ${avatarHTML(writer, 34)}
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13px;">${r.projectTitle}</div>
              <div style="font-size:11px;color:var(--tm);">To: ${writer ? writer.username : 'Writer'} · ${timeAgo(r.createdAt)}</div>
              <div class="tlpill" style="margin-top:4px;">⏱ Deadline: ${r.deadline}</div>
            </div>
            <span class="tag ${r.status==='pending' ? 'tg-ye' : r.status==='accepted' ? 'tg-gr' : 'tg-re'}">${r.status}</span>
            <button class="btn btn-gh btn-sm" onclick="openChat('${r.writerId}')">💬 Chat</button>
          </div>`;
      }).join('')}` : ''}

    <!-- Following writers -->
    ${following.length ? `
      <div style="font-size:16px;font-weight:700;margin:22px 0 12px;font-family:'Playfair Display',serif;">Writers You Follow</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:11px;margin-bottom:22px;">
        ${following.map(w => `
          <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--r);padding:14px;text-align:center;">
            ${avatarHTML(w, 40)}
            <div style="font-weight:700;margin:7px 0 4px;font-size:13px;">${w.username}</div>
            <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-pu btn-sm" onclick="openChat('${w.id}')">💬</button>
              <button class="btn btn-g  btn-sm" onclick="openEngage('${w.id}')">📨</button>
            </div>
          </div>`).join('')}
      </div>` : ''}

    <!-- Liked posts -->
    ${likedPosts.length ? `
      <div style="font-size:16px;font-weight:700;margin-bottom:12px;font-family:'Playfair Display',serif;">Posts You Liked ❤️</div>
      ${likedPosts.slice(0, 5).map(p => `
        <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--r);padding:12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="openPost('${p.id}')">
          <div>
            <div style="font-weight:600;font-size:13px;">${p.title.slice(0,48)}${p.title.length>48?'…':''}</div>
            <div style="font-size:10px;color:var(--tl);">${p.category} · ${timeAgo(p.createdAt)}</div>
          </div>
          <span class="tag tg-t">→</span>
        </div>`).join('')}` : ''}`;
}

// ══════════════════════════════════════════════════════════════
// PROFILE PAGE
// ══════════════════════════════════════════════════════════════

function renderProfile() {
  if (!currentUser) { showPage('login'); return; }

  const user        = getUser(currentUser.id) || currentUser;
  const posts       = getAllPosts().filter(p => p.authorId === user.id);
  const totalLikes  = posts.reduce((a, p) => a + p.likes.length, 0);

  document.getElementById('profwrap').innerHTML = `
    <div>
      <!-- Banner -->
      <div class="pbanner"></div>
      <div class="pcont">
        <!-- Avatar with edit button -->
        <div class="pavwrap">
          <div class="pav" style="background:${avatarColor(user.username)};">
            ${user.avatar ? `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;"/>` : user.username[0].toUpperCase()}
          </div>
          <label class="paved" title="Change profile photo">
            📷
            <input type="file" accept="image/*" style="display:none;" onchange="uploadAvatar(this)"/>
          </label>
        </div>

        <!-- Name + bio -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:11px;margin-bottom:7px;">
          <div>
            <div class="pname">${user.username}</div>
            <div class="pbio">${user.bio || 'No bio yet.'}</div>
          </div>
          <span class="tag ${user.role==='writer' ? 'tg-t' : user.role==='admin' ? 'tg-c' : 'tg-g'}">${user.role}</span>
        </div>
        <div style="font-size:12px;color:var(--tm);margin-bottom:14px;">📧 ${user.email || 'No email set'}</div>

        <!-- Stats row -->
        <div class="pstrow">
          <div class="psr"><div class="psrn">${posts.length}</div><div class="psrl">Posts</div></div>
          <div class="psr"><div class="psrn">${totalLikes}</div><div class="psrl">Likes</div></div>
          <div class="psr"><div class="psrn">${user.followers ? user.followers.length : 0}</div><div class="psrl">Followers</div></div>
          <div class="psr"><div class="psrn">${user.following ? user.following.length : 0}</div><div class="psrl">Following</div></div>
        </div>

        <!-- Edit form + quick stats -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
          <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--rlg);padding:20px;">
            <div style="font-size:14px;font-weight:700;margin-bottom:13px;font-family:'Playfair Display',serif;">Edit Profile</div>
            <div class="fg"><label class="fl">Bio</label>          <textarea class="fi" id="p-bio" style="min-height:65px;">${user.bio || ''}</textarea></div>
            <div class="fg"><label class="fl">Email</label>        <input class="fi" id="p-email" value="${user.email || ''}"/></div>
            <div class="fg"><label class="fl">New Password</label> <input class="fi" type="password" id="p-pass" placeholder="Leave blank to keep current"/></div>
            <button class="btn btn-p btn-sm" onclick="saveProfile()">Save Changes</button>
          </div>
          <div style="background:#fff;border:1px solid var(--paper3);border-radius:var(--rlg);padding:20px;">
            <div style="font-size:14px;font-weight:700;margin-bottom:13px;font-family:'Playfair Display',serif;">Quick Stats</div>
            <div style="font-size:12px;color:var(--tm);line-height:2.1;">
              📄 ${posts.length} posts published<br/>
              ❤️ ${totalLikes} total likes received<br/>
              💬 ${posts.reduce((a,p) => a+p.comments.length, 0)} total comments<br/>
              🔗 ${posts.reduce((a,p) => a+(p.shares||0), 0)} total shares
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// Upload profile avatar
async function uploadAvatar(input) {
  if (!input.files || !input.files[0]) return;
  const base64  = await fileToBase64(input.files[0]);
  const users   = LS.get('dcw_users', []);
  const idx     = users.findIndex(u => u.id === currentUser.id);
  if (idx < 0) return;

  users[idx].avatar = base64;
  LS.set('dcw_users', users);
  currentUser = users[idx];
  LS.set('dcw_session', currentUser.id);

  // Update navbar avatar
  const avEl = document.getElementById('nav-av');
  if (avEl) avEl.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>`;

  toast('Profile photo updated! 📷');
  renderProfile();
}

// Save profile changes
function saveProfile() {
  const users = LS.get('dcw_users', []);
  const idx   = users.findIndex(u => u.id === currentUser.id);
  if (idx < 0) return;

  users[idx].bio   = document.getElementById('p-bio').value;
  users[idx].email = document.getElementById('p-email').value;

  const newPass = document.getElementById('p-pass').value;
  if (newPass) users[idx].password = newPass;

  LS.set('dcw_users', users);
  currentUser = users[idx];
  LS.set('dcw_session', currentUser.id);
  toast('Profile updated!');
  renderProfile();
}

// ══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════

function renderAdmin() {
  adminTab(adminTab_cur);
}

function adminTab(tab) {
  adminTab_cur = tab;

  // Update sidebar active state
  document.querySelectorAll('.asbi').forEach(i => i.classList.remove('active'));
  const el = document.getElementById('an-' + tab);
  if (el) el.classList.add('active');

  const main     = document.getElementById('amain');
  const users    = LS.get('dcw_users', []);
  const posts    = getAllPosts();
  const requests = LS.get('dcw_requests', []);

  if (tab === 'u') {
    // Users management
    main.innerHTML = `
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;font-family:'Playfair Display',serif;">User Management</h2>
      <div class="twrap">
        <table>
          <thead><tr><th>User</th><th>Role</th><th>Posts</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr style="${u.blocked ? 'opacity:.42' : ''}">
                <td>
                  <div style="display:flex;align-items:center;gap:7px;">
                    ${avatarHTML(u, 26)}
                    <strong>${u.username}</strong>
                  </div>
                </td>
                <td><span class="tag ${u.role==='writer' ? 'tg-t' : u.role==='admin' ? 'tg-c' : 'tg-g'}">${u.role}</span></td>
                <td>${posts.filter(p => p.authorId === u.id).length}</td>
                <td><span class="tag ${u.blocked ? 'tg-re' : 'tg-gr'}">${u.blocked ? 'Blocked' : 'Active'}</span></td>
                <td>
                  <div style="display:flex;gap:4px;">
                    <button class="btn btn-sm ${u.blocked ? 'btn-t' : 'btn-d'}" onclick="adminBlockUser('${u.id}')">
                      ${u.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button class="btn btn-sm btn-gh" onclick="adminDeleteUser('${u.id}')">Delete</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (tab === 'po') {
    // Posts management
    main.innerHTML = `
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;font-family:'Playfair Display',serif;">Post Management (${posts.length} posts)</h2>
      <div class="twrap">
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Type</th><th>❤️</th><th>💬</th><th>Action</th></tr></thead>
          <tbody>
            ${posts.map(p => {
              const author = getUser(p.authorId);
              return `
                <tr>
                  <td><strong style="cursor:pointer;color:var(--teal);" onclick="openPost('${p.id}')">${p.title.slice(0,38)}${p.title.length>38?'…':''}</strong></td>
                  <td style="font-size:11px;">${author ? author.username : '?'}</td>
                  <td><span class="tag tg-t">${p.type}</span></td>
                  <td>${p.likes.length}</td>
                  <td>${p.comments.length}</td>
                  <td><button class="btn btn-d btn-sm" onclick="deletePost('${p.id}')">Delete</button></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (tab === 'ch') {
    // Chats overview
    const chats = getChats();
    main.innerHTML = `
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;font-family:'Playfair Display',serif;">Chat Management</h2>
      <div class="twrap">
        <table>
          <thead><tr><th>Conversation</th><th>Messages</th><th>Deadline</th><th>Last Message</th></tr></thead>
          <tbody>
            ${Object.entries(chats).map(([chatId, data]) => {
              const ids  = chatId.split('_');
              const ua   = getUser(ids[0]);
              const ub   = getUser(ids[1]);
              const last = data.msgs[data.msgs.length - 1];
              return `
                <tr>
                  <td><strong>${ua ? ua.username : '?'} ↔ ${ub ? ub.username : '?'}</strong></td>
                  <td>${data.msgs.length}</td>
                  <td>${data.deadline || '-'}</td>
                  <td style="color:var(--tm);max-width:160px;overflow:hidden;text-overflow:ellipsis;font-size:11px;">
                    ${last ? (last.special ? '📨 Request' : last.text || 'System') : '-'}
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Engagement requests table -->
      ${requests.length ? `
        <h2 style="font-size:18px;font-weight:700;margin:24px 0 14px;font-family:'Playfair Display',serif;">Engagement Requests</h2>
        <div class="twrap">
          <table>
            <thead><tr><th>Client</th><th>Writer</th><th>Project</th><th>Deadline</th><th>Status</th></tr></thead>
            <tbody>
              ${requests.map(r => {
                const client = getUser(r.clientId);
                const writer = getUser(r.writerId);
                return `
                  <tr>
                    <td>${client ? client.username : '?'}</td>
                    <td>${writer ? writer.username : '?'}</td>
                    <td><strong style="font-size:12px;">${r.projectTitle}</strong></td>
                    <td>${r.deadline}</td>
                    <td><span class="tag ${r.status==='pending' ? 'tg-ye' : r.status==='accepted' ? 'tg-gr' : 'tg-re'}">${r.status}</span></td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>` : ''}`;

  } else if (tab === 'an') {
    // Analytics
    const allPosts  = LS.get('dcw_posts', []).filter(p => !p.deleted);
    const writers   = users.filter(u => u.role === 'writer');
    const clients   = users.filter(u => u.role === 'client');
    const totalLikes = allPosts.reduce((a, p) => a + p.likes.length, 0);
    const totalCmts  = allPosts.reduce((a, p) => a + p.comments.length, 0);

    main.innerHTML = `
      <h2 style="font-size:20px;font-weight:700;margin-bottom:18px;font-family:'Playfair Display',serif;">Analytics Report</h2>

      <!-- Platform stats -->
      <div class="sgrid" style="margin-bottom:26px;">
        <div class="sc"><div class="scic">👥</div><div class="scn">${users.length}</div>  <div class="scl">Total Users</div></div>
        <div class="sc"><div class="scic">✍️</div><div class="scn">${writers.length}</div> <div class="scl">Writers</div></div>
        <div class="sc"><div class="scic">📖</div><div class="scn">${clients.length}</div> <div class="scl">Readers</div></div>
        <div class="sc"><div class="scic">📄</div><div class="scn">${allPosts.length}</div><div class="scl">Total Posts</div></div>
        <div class="sc"><div class="scic">❤️</div><div class="scn">${totalLikes}</div>    <div class="scl">Total Likes</div></div>
        <div class="sc"><div class="scic">💬</div><div class="scn">${totalCmts}</div>     <div class="scl">Comments</div></div>
        <div class="sc"><div class="scic">📨</div><div class="scn">${requests.length}</div><div class="scl">Requests</div></div>
      </div>

      <!-- Top writers table -->
      <h3 style="font-size:15px;font-weight:700;margin-bottom:12px;font-family:'Playfair Display',serif;">Top Writers by Likes</h3>
      <div class="twrap">
        <table>
          <thead><tr><th>Writer</th><th>Posts</th><th>Total Likes</th><th>Comments</th><th>Followers</th></tr></thead>
          <tbody>
            ${writers
              .sort((a, b) => {
                // Sort by total likes descending
                const aLikes = allPosts.filter(p => p.authorId === a.id).reduce((s, p) => s + p.likes.length, 0);
                const bLikes = allPosts.filter(p => p.authorId === b.id).reduce((s, p) => s + p.likes.length, 0);
                return bLikes - aLikes;
              })
              .map(w => {
                const wp = allPosts.filter(p => p.authorId === w.id);
                return `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:7px;">
                        ${avatarHTML(w, 26)}
                        <strong>${w.username}</strong>
                      </div>
                    </td>
                    <td>${wp.length}</td>
                    <td>${wp.reduce((a,p) => a+p.likes.length, 0)}</td>
                    <td>${wp.reduce((a,p) => a+p.comments.length, 0)}</td>
                    <td>${w.followers.length}</td>
                  </tr>`;
              }).join('')}
          </tbody>
        </table>
      </div>`;
  }
}

// Block / unblock a user
function adminBlockUser(userId) {
  const users = LS.get('dcw_users', []);
  const user  = users.find(u => u.id === userId);
  if (!user) return;

  user.blocked = !user.blocked;
  LS.set('dcw_users', users);
  toast(user.blocked ? `${user.username} has been blocked` : `${user.username} has been unblocked`);
  adminTab('u');
}

// Delete a user
function adminDeleteUser(userId) {
  if (!confirm('Are you sure you want to permanently delete this user?')) return;
  LS.set('dcw_users', LS.get('dcw_users', []).filter(u => u.id !== userId));
  toast('User deleted successfully');
  adminTab('u');
}

// ══════════════════════════════════════════════════════════════
// APP INITIALIZATION
// ══════════════════════════════════════════════════════════════

(function init() {
  // Check if user was logged in before (session saved in localStorage)
  const savedSession = LS.get('dcw_session', null);

  if (savedSession) {
    const user = getUser(savedSession);
    if (user && !user.blocked) {
      currentUser = user;
      afterLogin();
      return;
    }
  }

  // No session — show login page
  showPage('login');
})();