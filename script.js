 
        // =====================
        // NAVEGACIÓ DE PÀGINES
        // =====================
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            document.getElementById(pageId).classList.add('active');
            
            const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
            const pageIndex = ['dashboard', 'historic', 'personal', 'config'].indexOf(pageId);
            if (pageIndex >= 0) {
                navItems[pageIndex].classList.add('active');
            }
            
            const subtitles = {
                'dashboard': 'Sistema de Gestió de Cues',
                'historic': 'Anàlisi i Estadístiques',
                'personal': 'Gestió d\'Equip',
                'config': 'Configuració'
            };
            document.getElementById('page-subtitle').textContent = subtitles[pageId];
        }
        
        // =====================
        // TOGGLE VISTA TARGETES/LLISTA
        // =====================
        document.querySelectorAll('.view-toggle').forEach(toggle => {
            toggle.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    toggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const view = this.textContent.trim().toLowerCase();
                    const grid = document.querySelector('.taulells-grid');
                    
                    if (view === 'llista') {
                        grid.classList.add('hidden');
                        showToast('Vista de llista activada', 'success');
                    } else {
                        grid.classList.remove('hidden');
                    }
                });
            });
        });
        
        // =====================
        // FILTRES DE PERSONAL
        // =====================
        const personalFilters = document.querySelectorAll('#personal .view-toggle .toggle-btn');
        personalFilters.forEach(btn => {
            btn.addEventListener('click', function() {
                personalFilters.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.textContent.trim().toLowerCase();
                const cards = document.querySelectorAll('.personal-card');
                
                cards.forEach(card => {
                    const status = card.dataset.status;
                    if (filter === 'tots') {
                        card.style.display = 'flex';
                    } else if (filter === 'actius' && status === 'active') {
                        card.style.display = 'flex';
                    } else if (filter === 'disponibles' && status === 'available') {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // =====================
        // CERCA DE PERSONAL
        // =====================
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const cards = document.querySelectorAll('.personal-card');
                
                cards.forEach(card => {
                    const name = card.querySelector('.personal-name').textContent.toLowerCase();
                    const role = card.querySelector('.personal-role').textContent.toLowerCase();
                    
                    if (name.includes(query) || role.includes(query)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // =====================
        // MODALS
        // =====================
        let currentSection = '';
        let selectedWorker = null;
        let selectedStore = '';
        
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        
        // Tancar modal clicant fora
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
        
        // Botons d'afegir treballador
        document.querySelectorAll('.add-worker-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.taulell-card');
                currentSection = card.querySelector('.taulell-name').textContent;
                document.getElementById('modal-section-name').textContent = currentSection;
                openModal('modal-add-worker');
            });
        });
        
        function selectWorker(element) {
            document.querySelectorAll('.worker-select-item').forEach(item => {
                item.classList.remove('selected');
            });
            element.classList.add('selected');
            selectedWorker = element.querySelector('.worker-select-name').textContent;
        }
        
        function confirmAddWorker() {
            if (selectedWorker) {
                showToast(`${selectedWorker} assignat/da a ${currentSection}`, 'success');
                closeModal('modal-add-worker');
                selectedWorker = null;
            } else {
                showToast('Selecciona un treballador', 'warning');
            }
        }
        
        // Selector de botiga
        document.querySelector('.store-selector').addEventListener('click', function() {
            openModal('modal-store-selector');
        });
        
        function selectStore(element, storeName) {
            document.querySelectorAll('#store-list .worker-select-item').forEach(item => {
                item.classList.remove('selected');
            });
            element.classList.add('selected');
            selectedStore = storeName;
        }
        
        function confirmStoreSelection() {
            if (selectedStore) {
                document.querySelector('.store-selector').innerHTML = `
                    <span>📍</span>
                    ${selectedStore}
                    <span>▼</span>
                `;
                showToast(`Establiment canviat a ${selectedStore}`, 'success');
                closeModal('modal-store-selector');
            }
        }
        
        // =====================
        // TOAST NOTIFICATIONS
        // =====================
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-circle'}"></i>
                ${message}
            `;
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        // =====================
        // ALERTA - ASSIGNAR PERSONAL
        // =====================
        document.querySelector('.alert-action').addEventListener('click', function() {
            currentSection = 'Peixateria';
            document.getElementById('modal-section-name').textContent = currentSection;
            openModal('modal-add-worker');
        });
        
        // =====================
        // CONFIGURACIÓ - NAVEGACIÓ
        // =====================
        document.querySelectorAll('.config-nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.config-nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                showToast('Secció: ' + this.textContent.trim(), 'success');
            });
        });
        
        // =====================
        // CONFIGURACIÓ - DESAR CANVIS
        // =====================
        document.querySelector('.save-btn').addEventListener('click', function() {
            showToast('Configuració desada correctament', 'success');
        });
        
        // =====================
        // HISTÒRIC - APLICAR FILTRE
        // =====================
        document.querySelector('.filter-btn').addEventListener('click', function() {
            const startDate = document.querySelectorAll('.date-input')[0].value;
            const endDate = document.querySelectorAll('.date-input')[1].value;
            showToast(`Dades actualitzades: ${startDate} - ${endDate}`, 'success');
            
            // Simular animació de les barres
            document.querySelectorAll('.chart-bar').forEach(bar => {
                const currentHeight = parseInt(bar.style.height);
                const newHeight = Math.floor(Math.random() * 100) + 20;
                bar.style.height = newHeight + 'px';
            });
        });
        
        // =====================
        // RELLOTGE EN TEMPS REAL
        // =====================
        function updateClock() {
            const now = new Date();
            const days = ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'];
            const day = days[now.getDay()];
            const date = now.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const time = now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
            document.querySelector('.header-time').textContent = `${day} ${date} · ${time}`;
        }
        
        updateClock();
        setInterval(updateClock, 1000);
        
        // =====================
        // SIMULACIÓ TEMPS REAL
        // =====================
        function simulateRealTimeUpdates() {
            // Actualitzar aleatòriament algunes mètriques
            document.querySelectorAll('.metric-value').forEach(metric => {
                const current = parseInt(metric.textContent);
                if (!isNaN(current) && Math.random() > 0.7) {
                    const change = Math.random() > 0.5 ? 1 : -1;
                    const newValue = Math.max(0, current + change);
                    metric.textContent = newValue;
                }
            });
        }
        
        setInterval(simulateRealTimeUpdates, 5000);
        
        // =====================
        // AFEGIR TREBALLADOR (botó +)
        // =====================
        document.querySelector('.add-btn').addEventListener('click', function() {
            showToast('Funció d\'afegir treballador (es connectaria amb el sistema de RRHH)', 'warning');
        });
        
        // =====================
        // INICIALITZACIÓ
        // =====================
        document.addEventListener('DOMContentLoaded', function() {
            // Afegir data-status a la primera targeta de personal
            const firstPersonalCard = document.querySelector('.personal-card');
            if (firstPersonalCard && !firstPersonalCard.dataset.status) {
                firstPersonalCard.dataset.status = 'active';
                firstPersonalCard.dataset.section = 'peixateria';
            }
        });
    