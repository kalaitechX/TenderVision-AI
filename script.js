// Page Navigation
        function showPage(pageName) {
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });
            const target = document.getElementById('page-' + pageName);
            if (target) {
                target.classList.add('active');
            }
            window.scrollTo(0, 0);
        }

        // Registration Steps
        let currentStep = 1;
        function nextStep(step) {
            document.getElementById('reg-step' + currentStep).classList.remove('active');
            document.getElementById('reg-step' + step).classList.add('active');

            document.getElementById('step' + currentStep + '-circle').classList.remove('active');
            document.getElementById('step' + currentStep + '-label').classList.remove('active');
            document.getElementById('step' + step + '-circle').classList.add('active');
            document.getElementById('step' + step + '-label').classList.add('active');

            currentStep = step;
        }

        function prevStep(step) {
            document.getElementById('reg-step' + currentStep).classList.remove('active');
            document.getElementById('reg-step' + step).classList.add('active');

            document.getElementById('step' + currentStep + '-circle').classList.remove('active');
            document.getElementById('step' + currentStep + '-label').classList.remove('active');
            document.getElementById('step' + step + '-circle').classList.add('active');
            document.getElementById('step' + step + '-label').classList.add('active');

            currentStep = step;
        }

        function handleRegister() {
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            if (localStorage.getItem(email)) {
                showToast('Email already registered! Please sign in.');
                return;
            }
            
            localStorage.setItem(email, JSON.stringify({ name, password }));
            localStorage.setItem('currentUserEmail', email);
            showToast('Welcome aboard! Your intelligence dashboard is loading...');
            
            // Clear form
            document.getElementById('register-form').reset();
            
            setTimeout(() => {
                // Update nav to show signed in state
                setLoggedInNav(name);
                showPage('dashboard');
            }, 2000);
        }

        function handleLogin() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const userStr = localStorage.getItem(email);
            if (!userStr) {
                showToast('Account not found. Please register.');
                return;
            }
            
            const user = JSON.parse(userStr);
            if (user.password !== password) {
                showToast('Incorrect password.');
                return;
            }
            
            localStorage.setItem('currentUserEmail', email);
            showToast('Welcome back! Dashboard loading...');
            document.getElementById('login-form').reset();
            
            setTimeout(() => {
                setLoggedInNav(user.name);
                showPage('dashboard');
            }, 2000);
        }

        function handleForgot() {
            const email = document.getElementById('forgot-email').value;
            
            if (!localStorage.getItem(email)) {
                showToast('If this email is registered, a reset link will be sent.');
            } else {
                showToast('Password reset link sent to your email!');
            }
            
            document.getElementById('forgot-form').reset();
            setTimeout(() => showPage('login'), 3000);
        }

        function setLoggedInNav(name) {
            document.getElementById('dash-user-name').textContent = name || 'User';
            document.querySelector('.nav-links').innerHTML = `
                <a href="#" onclick="showPage('dashboard')" style="color: #00ffaa;">Dashboard</a>
                <a href="#" onclick="showPage('tenders')">Tenders</a>
                <a href="#" onclick="showPage('analysis')">Analysis</a>
                <a href="#" onclick="showPage('prediction')">Prediction</a>
                <a href="#" onclick="showPage('proposals')">Proposals</a>
                <a href="#" onclick="showPage('notifications')">Notifications</a>
                <a href="#" onclick="showPage('profile')">Profile</a>
                <button class="btn-outline" onclick="logout()">Sign Out</button>
            `;
        }

        function logout() {
            document.querySelector('.nav-links').innerHTML = `
                <a href="#" onclick="showPage('home')">Home</a>
                <a href="#" onclick="showPage('features')">Features</a>
                <a href="#" onclick="showPage('pricing')">Pricing</a>
                <button class="btn-outline" onclick="showPage('login')">Sign In</button>
                <button class="btn-primary" onclick="showPage('register')">Get Started</button>
            `;
            showPage('login');
            showToast('Signed out successfully.');
        }

        // Pricing: Billing Toggle
        let isAnnual = false;
        function toggleBilling() {
            isAnnual = !isAnnual;
            const toggle = document.getElementById('billing-toggle');
            const monthlyLabel = document.getElementById('monthly-label');
            const annualLabel = document.getElementById('annual-label');
            toggle.classList.toggle('active', isAnnual);
            monthlyLabel.classList.toggle('active', !isAnnual);
            annualLabel.classList.toggle('active', isAnnual);

            document.querySelectorAll('.pricing-amount .amount[data-monthly]').forEach(el => {
                el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
            });
        }

        // FAQ Accordion
        function toggleFAQ(el) {
            const item = el.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        }

        // ============== Company Profile Functions ==============
        function switchProfileTab(tabName, btn) {
            document.querySelectorAll('.profile-tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + tabName).classList.add('active');
            btn.classList.add('active');
        }

        function handleTagInput(event, input) {
            if (event.key === 'Enter' && input.value.trim()) {
                event.preventDefault();
                const wrap = input.closest('.tag-input-wrap');
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `${input.value.trim()} <span class="tag-remove" onclick="removeTag(this)">×</span>`;
                wrap.insertBefore(tag, input);
                input.value = '';
            }
        }

        function removeTag(el) {
            el.closest('.tag').remove();
        }

        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatar = document.getElementById('company-avatar');
                    avatar.innerHTML = `<img src="${e.target.result}" alt="Company Logo">`;
                    showToast('Company logo updated!');
                };
                reader.readAsDataURL(file);
            }
        }

        function saveProfileSection(section) {
            showToast(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} information saved successfully!`);
            updateProfileProgress();
        }

        function saveAllProfile() {
            showToast('✅ All profile changes saved successfully!');
            updateProfileProgress();
        }

        function updateProfileProgress() {
            // Simple check of filled fields
            const fields = ['pf-company-name', 'pf-email', 'pf-phone', 'pf-industry', 'pf-company-type', 'pf-employees', 'pf-country', 'pf-owner-name'];
            let filled = 0;
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.value.trim()) filled++;
            });
            const pct = Math.round((filled / fields.length) * 100);
            document.getElementById('profile-progress-pct').textContent = pct + '%';
            document.getElementById('profile-progress-bar').style.width = pct + '%';

            const tips = document.getElementById('profile-tips');
            if (pct >= 100) {
                tips.innerHTML = '<div class="progress-tip" style="background: rgba(0,255,170,0.08); border-color: rgba(0,255,170,0.15); color: #00ffaa;">✅ Profile complete! You\'re getting the best AI recommendations.</div>';
            }
        }

        // ============== TENDER MANAGEMENT ==============
        let tendersData = [];

        async function fetchTenders() {
            try {
                const response = await fetch('/api/tenders');
                tendersData = await response.json();
                renderTenders(tendersData);
                renderAdminTenders();
            } catch (err) {
                console.error("Failed to fetch tenders:", err);
            }
        }

        let favorites = JSON.parse(localStorage.getItem('tenderFavorites') || '[]');
        let activeFilters = { categories: [], showFavOnly: false };

        function renderTenders(tenders) {
            const grid = document.getElementById('tenders-grid');
            const noResults = document.getElementById('no-results');
            document.getElementById('results-count').textContent = tenders.length;
            document.getElementById('fav-count').textContent = favorites.length;

            if (tenders.length === 0) {
                grid.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }
            noResults.style.display = 'none';

            grid.innerHTML = tenders.map(t => {
                const isFav = favorites.includes(t.id);
                const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / 86400000);
                const deadlineClass = daysLeft <= 7 ? 'red' : daysLeft <= 21 ? 'orange' : 'green';
                const probClass = t.winProb >= 75 ? 'green' : t.winProb >= 50 ? 'orange' : 'red';
                return `
                <div class="tender-card" ondblclick="openTenderDetail('${t.id}')">
                    <div class="tender-card-top">
                        <span class="tender-card-category cat-${t.category}">${t.catLabel}</span>
                        <button class="btn-fav ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${t.id}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">${isFav ? '★' : '☆'}</button>
                    </div>
                    <h3>${t.title}</h3>
                    <div class="tender-card-org">🏢 ${t.org}</div>
                    <div class="tender-card-meta">
                        <div class="tender-meta-item"><span class="meta-label">Value</span><span class="meta-value">$${(t.value/1000000).toFixed(1)}M</span></div>
                        <div class="tender-meta-item"><span class="meta-label">Deadline</span><span class="meta-value ${deadlineClass}">${daysLeft > 0 ? daysLeft + ' days' : 'Expired'}</span></div>
                        <div class="tender-meta-item"><span class="meta-label">Status</span><span class="meta-value">${t.status}</span></div>
                        <div class="tender-meta-item"><span class="meta-label">Region</span><span class="meta-value">${t.region}</span></div>
                    </div>
                    <div class="tender-card-footer">
                        <div class="win-prob">
                            <div class="win-bar-wrap" style="width:60px"><div class="win-bar" style="width:${t.winProb}%"></div></div>
                            <span class="win-prob-value ${probClass}">${t.winProb}%</span>
                        </div>
                        <button class="btn-view-detail" onclick="event.stopPropagation(); openTenderDetail('${t.id}')">View Details →</button>
                    </div>
                </div>`;
            }).join('');
        }

        function filterTenders() {
            let results = [...tendersData];
            const query = document.getElementById('tender-search').value.toLowerCase();
            const status = document.getElementById('filter-status').value;
            const minVal = parseFloat(document.getElementById('filter-min-val').value) || 0;
            const maxVal = parseFloat(document.getElementById('filter-max-val').value) || Infinity;
            const winFilter = document.getElementById('filter-win-prob').value;
            const region = document.getElementById('filter-region').value;
            const sort = document.getElementById('sort-select').value;

            if (query) results = results.filter(t => t.title.toLowerCase().includes(query) || t.org.toLowerCase().includes(query) || t.catLabel.toLowerCase().includes(query));
            if (status) results = results.filter(t => t.status === status);
            if (minVal) results = results.filter(t => t.value >= minVal * 1000000);
            if (maxVal < Infinity) results = results.filter(t => t.value <= maxVal * 1000000);
            if (winFilter === 'high') results = results.filter(t => t.winProb >= 75);
            else if (winFilter === 'medium') results = results.filter(t => t.winProb >= 50 && t.winProb < 75);
            else if (winFilter === 'low') results = results.filter(t => t.winProb < 50);
            if (region) results = results.filter(t => t.region === region);
            if (activeFilters.categories.length > 0) results = results.filter(t => activeFilters.categories.includes(t.category));
            if (activeFilters.showFavOnly) results = results.filter(t => favorites.includes(t.id));

            if (sort === 'deadline') results.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            else if (sort === 'value-desc') results.sort((a, b) => b.value - a.value);
            else if (sort === 'value-asc') results.sort((a, b) => a.value - b.value);
            else if (sort === 'win-prob') results.sort((a, b) => b.winProb - a.winProb);

            renderTenders(results);
        }

        function toggleFilterChip(el, type) {
            el.classList.toggle('active');
            const val = el.dataset.value;
            if (type === 'category') {
                if (activeFilters.categories.includes(val)) activeFilters.categories = activeFilters.categories.filter(c => c !== val);
                else activeFilters.categories.push(val);
            }
            filterTenders();
        }

        function clearAllFilters() {
            document.getElementById('tender-search').value = '';
            document.getElementById('filter-status').value = '';
            document.getElementById('filter-min-val').value = '';
            document.getElementById('filter-max-val').value = '';
            document.getElementById('filter-win-prob').value = '';
            document.getElementById('filter-region').value = '';
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            activeFilters = { categories: [], showFavOnly: false };
            document.getElementById('tab-all-tenders').classList.add('active');
            document.getElementById('tab-fav-tenders').classList.remove('active');
            filterTenders();
        }

        function toggleFavorite(id) {
            if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
            else favorites.push(id);
            localStorage.setItem('tenderFavorites', JSON.stringify(favorites));
            filterTenders();
            showToast(favorites.includes(id) ? '⭐ Added to favorites!' : 'Removed from favorites.');
        }

        function showFavoritesOnly(btn) {
            activeFilters.showFavOnly = true;
            document.getElementById('tab-all-tenders').classList.remove('active');
            document.getElementById('tab-fav-tenders').classList.add('active');
            filterTenders();
        }

        function showAllTenders(btn) {
            activeFilters.showFavOnly = false;
            document.getElementById('tab-all-tenders').classList.add('active');
            document.getElementById('tab-fav-tenders').classList.remove('active');
            filterTenders();
        }

        function setView(view, btn) {
            const grid = document.getElementById('tenders-grid');
            grid.classList.toggle('list-view', view === 'list');
            document.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }

        function openTenderDetail(id) {
            const t = tendersData.find(x => x.id == id);
            if (!t) return;
            const isFav = favorites.includes(t.id);
            const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / 86400000);
            document.getElementById('tender-modal-content').innerHTML = `
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-badges">
                    <span class="tender-card-category cat-${t.category}">${t.catLabel}</span>
                    <span class="status-badge ${t.status === 'Open' ? 'status-active' : t.status === 'Closing Soon' ? 'status-submitted' : 'status-review'}">${t.status}</span>
                </div>
                <h2 class="modal-title">${t.title}</h2>
                <p class="modal-org">🏢 ${t.org} · ${t.region}</p>
                <div class="modal-info-grid">
                    <div class="modal-info-item"><div class="mi-label">Estimated Value</div><div class="mi-value green">$${(t.value/1000000).toFixed(1)}M</div></div>
                    <div class="modal-info-item"><div class="mi-label">Deadline</div><div class="mi-value ${daysLeft <= 7 ? 'orange' : 'blue'}">${new Date(t.deadline).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})} (${daysLeft}d)</div></div>
                    <div class="modal-info-item"><div class="mi-label">Win Probability</div><div class="mi-value ${t.winProb >= 75 ? 'green' : t.winProb >= 50 ? 'orange' : ''}'">${t.winProb}%</div></div>
                </div>
                <div class="modal-section"><h4>📄 Description</h4><p>${t.desc}</p></div>
                <div class="modal-section"><h4>📋 Key Requirements</h4><ul>${t.reqs.map(r => `<li>${r}</li>`).join('')}</ul></div>
                <div class="modal-actions">
                    <button class="btn-modal-fav" onclick="toggleFavorite('${t.id}'); openTenderDetail('${t.id}');">${isFav ? '★ Favorited' : '☆ Save to Favorites'}</button>
                    <button class="btn-modal-secondary" onclick="generateAIProposal('${t.id}')">🤖 AI Draft Proposal</button>
                    <button class="btn-modal-primary" onclick="showToast('Downloading tender documents...'); closeModal();">📥 Apply Now</button>
                </div>
            `;
            document.getElementById('tender-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('tender-modal').classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

        // Initialize tenders on page load
        renderTenders(tendersData);

        // ============== PROPOSALS MANAGEMENT ==============
        let proposalsData = [
            { id: 1, title: 'Metro Rail Phase II - Signaling System', org: 'MMRDA', score: 92, status: 'Ready', date: '2026-07-22' },
            { id: 2, title: 'Defense Communications Network', org: 'Ministry of Defence', score: 88, status: 'Review', date: '2026-07-20' },
            { id: 3, title: 'Smart City IoT Infrastructure', org: 'Pune Smart City Corp', score: 85, status: 'Draft', date: '2026-07-18' },
            { id: 4, title: 'Highway Bridge Rehabilitation', org: 'NHAI', score: 79, status: 'Draft', date: '2026-07-15' },
            { id: 5, title: 'University Campus Wi-Fi Network', org: 'NUS', score: 95, status: 'Ready', date: '2026-07-10' }
        ];

        function toggleWizard() {
            const wiz = document.getElementById('prop-wizard');
            wiz.classList.toggle('active');
        }

        function selectTone(el, tone) {
            document.querySelectorAll('.wizard-option').forEach(opt => opt.classList.remove('selected'));
            el.classList.add('selected');
            el.dataset.tone = tone;
        }

        async function generateAIProposal(tenderId) {
            closeModal();
            document.getElementById('analysis-loader').style.display = 'block';
            document.getElementById('analysis-results').style.display = 'none';
            document.getElementById('upload-zone').style.display = 'none';
            
            showPage('analysis');
            
            const statusText = document.getElementById('analysis-status-text');
            statusText.textContent = "> Connecting to Groq AI to generate proposal...";

            try {
                const res = await fetch('/api/generate-proposal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tenderId })
                });

                if (!res.ok) throw new Error("Failed to generate proposal");

                const data = await res.json();
                
                document.getElementById('analysis-loader').style.display = 'none';
                document.getElementById('upload-zone').style.display = 'block';
                
                showPage('proposals');
                showToast('Proposal Generated Successfully!');
                
                const t = tendersData.find(x => x.id == tenderId);
                const newId = Date.now();
                proposalsData.unshift({
                    id: newId,
                    title: t ? t.title : 'AI Generated Proposal',
                    org: t ? t.org : 'TBD',
                    score: t ? t.winProb : 90,
                    status: 'Draft',
                    date: new Date().toISOString().split('T')[0],
                    content: data.content
                });
                renderProposals();
                openEditor(newId);
            } catch (err) {
                console.error(err);
                showToast('Error generating AI proposal.');
                document.getElementById('analysis-loader').style.display = 'none';
            }
        }

        function generateProposal() {
            // Wizard fallback
            toggleWizard();
            showToast('Please select a tender from the dashboard and click AI Draft Proposal.');
        }

        function renderProposals() {
            const list = document.getElementById('proposals-list');
            list.innerHTML = proposalsData.map(p => {
                const statusClass = p.status === 'Ready' ? 'status-ready' : p.status === 'Review' ? 'status-review' : 'status-draft';
                return `
                <tr>
                    <td>
                        <span class="prop-title">${p.title}</span>
                        <span class="prop-org">🏢 ${p.org}</span>
                    </td>
                    <td>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <div class="win-bar-wrap" style="width:40px"><div class="win-bar" style="width:${p.score}%"></div></div>
                            <span style="font-weight:700; color:#00ffaa; font-size:13px;">${p.score}%</span>
                        </div>
                    </td>
                    <td><span class="prop-status ${statusClass}">${p.status}</span></td>
                    <td style="color:#8899aa; font-size:13px;">${p.date}</td>
                    <td>
                        <button class="btn-prop-action" onclick="openEditor(${p.id})">✏️ Edit Draft</button>
                    </td>
                </tr>`;
            }).join('');
        }

        function openEditor(id) {
            const p = proposalsData.find(x => x.id === id);
            if(!p) return;
            document.getElementById('editor-title').textContent = 'Editing: ' + p.title;
            
            if (p.content) {
                document.getElementById('editor-text').value = p.content;
            } else {
                document.getElementById('editor-text').value = `// AI GENERATED DRAFT PROPOSAL
// Tender: ${p.title}
// Client: ${p.org}
// Date Generated: ${p.date}

[EXECUTIVE SUMMARY]
We are pleased to submit this proposal for the ${p.title} project. Our company has extensive experience in delivering high-quality solutions that meet and exceed client expectations.

[TECHNICAL APPROACH]
1. Requirement Analysis & Planning
2. System Design & Architecture
3. Implementation & Testing
4. Deployment & Maintenance

[PRICING & TIMELINE]
Detailed breakdown provided in attached spreadsheet.

// Edit your content here...`;
            }

            document.getElementById('editor-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeEditor() {
            document.getElementById('editor-modal').classList.remove('active');
            document.body.style.overflow = '';
        }

        // Initialize Proposals
        renderProposals();

        // ============== AI TENDER ANALYSIS ==============
        const uploadZone = document.getElementById('upload-zone');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('dragover'), false);
        });

        uploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if(files.length > 0) handleFileUpload({ files: files });
        }, false);

        async function handleFileUpload(input) {
            if(!input.files || input.files.length === 0) return;
            
            const file = input.files[0];
            const formData = new FormData();
            formData.append('document', file);
            
            document.getElementById('upload-zone').style.display = 'none';
            document.getElementById('analysis-loader').style.display = 'block';
            
            const statusText = document.getElementById('analysis-status-text');
            statusText.textContent = "> Sending document to AI for extraction...";

            try {
                const res = await fetch('/api/analyze-document', {
                    method: 'POST',
                    body: formData
                });
                
                if (!res.ok) throw new Error("Failed to analyze document");
                const data = await res.json();
                
                // Populate DOM
                document.getElementById('analysis-win-prob').textContent = data.winProbability + '%';
                
                document.getElementById('analysis-summary-text').innerHTML = `
                    <li>
                        <div class="icon">✨</div>
                        <div class="text">
                            <h4 style="margin:0;">AI Summary</h4>
                            <p style="font-size:12px; color:#8899aa;">${data.summary}</p>
                        </div>
                    </li>
                `;
                
                const reqsHtml = (data.requirements || []).map(r => `
                    <li>
                        <div class="icon">🎯</div>
                        <div class="text">
                            <p>${r}</p>
                        </div>
                    </li>
                `).join('');
                document.getElementById('analysis-reqs-list').innerHTML = reqsHtml;
                
                document.getElementById('analysis-loader').style.display = 'none';
                document.getElementById('analysis-results').style.display = 'block';
                showToast('AI Analysis Complete!');
                
            } catch (err) {
                console.error(err);
                document.getElementById('analysis-loader').style.display = 'none';
                document.getElementById('upload-zone').style.display = 'block';
                showToast('Error generating AI proposal.');
            }
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }

        // 3D Card tilt effect
        const floatCards = document.querySelectorAll('.float-card');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * -20;
            floatCards.forEach(card => {
                card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
            });
        });

        // Initialize data on load
        setTimeout(() => {
            fetchTenders();
        }, 500);

        // Web Scanner Logic
        async function scanWebsiteForTenders() {
            const urlInput = document.getElementById('scanner-url');
            const url = urlInput ? urlInput.value.trim() : "";
            const userEmail = localStorage.getItem('currentUserEmail');
            const btn = document.getElementById('btn-scan');
            
            if (!url) {
                showToast('Please enter a valid URL.');
                return;
            }
            if (!userEmail) {
                showToast('Please sign in first to scan and receive emails.');
                return;
            }

            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="scanner-spinner"></span> Connecting...';
            btn.disabled = true;
            showToast('Initializing secure connection to target website...');

            try {
                // Simulate progressive loading states for better UX
                const loadingStates = ['Connecting...', 'Bypassing Firewalls...', 'Extracting Text...', 'AI Analyzing...'];
                let stateIdx = 0;
                const stateInterval = setInterval(() => {
                    if (stateIdx < loadingStates.length) {
                        btn.innerHTML = `<span class="scanner-spinner"></span> ${loadingStates[stateIdx]}`;
                        stateIdx++;
                    }
                }, 1500);

                const res = await fetch('/api/scan-website', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, userEmail })
                });

                clearInterval(stateInterval);

                const data = await res.json();
                if (res.ok) {
                    btn.innerHTML = '✅ Complete!';
                    showToast(data.message);
                    if (data.count > 0) {
                        urlInput.value = ''; // clear input on success
                        fetchTenders(); // Refresh the tenders grid!
                    }
                } else {
                    btn.innerHTML = '❌ Failed';
                    showToast(data.error || 'Failed to scan website. Please try another URL.');
                }
            } catch (err) {
                console.error(err);
                btn.innerHTML = '❌ Error';
                showToast('Network error connecting to the scanner service. Ensure the server is running.');
            } finally {
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        }