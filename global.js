// global.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Floating WhatsApp Button Injection
    const fabHtml = `
      <a href="https://wa.me/22625300000?text=Bonjour%2C%20je%20veux%20d%C3%A9couvrir%20FasoSmart" 
         target="_blank" rel="noopener" 
         class="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 group"
         title="Discuter sur WhatsApp">
        <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Discuter sur WhatsApp</span>
      </a>
    `;
    if(!document.querySelector('a[title="Discuter sur WhatsApp"]')) {
      document.body.insertAdjacentHTML('beforeend', fabHtml);
    }
  
    // 2. Reference ID Generator
    function generateRefId(pillar = "PRO") {
      const year = new Date().getFullYear().toString().slice(-2);
      const seq = Math.floor(1000 + Math.random() * 9000);
      return `#DS-${pillar}-${year}-${seq}`;
    }
  
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(anchor => {
      // Find the links that are explicit CTAs, not the generic ones
      if(anchor.getAttribute('href').includes('R%C3%A9f%C3%A9rence') || anchor.hasAttribute('data-requires-ref')) {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const refId = generateRefId("PRO");
          
          // Re-write the href to contain the ref id dynamically if placeholder exists
          let url = new URL(this.href);
          let textParam = url.searchParams.get('text') || '';
          
          if(textParam.includes('%23DS-PRO-26-XXXX') || textParam.includes('#DS-PRO-26-XXXX')) {
            textParam = textParam.replace(/%23DS-PRO-26-XXXX|#DS-PRO-26-XXXX/g, refId);
          } else {
            textParam += ` R\u00e9f\u00e9rence : ${refId}`;
          }
          url.searchParams.set('text', textParam);
          
          // Optional: Show a UI popup
          const popup = document.createElement('div');
          popup.className = 'fixed top-4 right-4 bg-[#1B650C] text-white px-6 py-4 rounded-xl shadow-2xl z-[999] flex flex-col gap-2 font-body animate-[slideIn_0.3s_ease-out]';
          popup.innerHTML = `
            <div class="text-xs uppercase tracking-widest font-bold opacity-80">Reference g\u00e9n\u00e9r\u00e9e</div>
            <div class="text-xl font-bold font-display">${refId}</div>
            <div class="text-xs opacity-80">Redirection vers WhatsApp...</div>
          `;
          document.body.appendChild(popup);
          
          setTimeout(() => {
            window.open(url.toString(), '_blank');
            popup.style.opacity = '0';
            setTimeout(() => popup.remove(), 500);
          }, 1500);
        });
      }
    });
  
    // 3. Low-Data Mode
    const toggleBtn = document.getElementById('low-data-toggle');
    
    function applyLowDataMode(isActive) {
      if(isActive) {
        document.body.classList.add('low-data-mode');
        // Visual indicator chip if desired
      } else {
        document.body.classList.remove('low-data-mode');
      }
    }
  
    let lowDataActive = localStorage.getItem('fasosmart_lowdata') === 'true';
    applyLowDataMode(lowDataActive);
    
    if(toggleBtn) {
      toggleBtn.checked = lowDataActive;
      toggleBtn.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('fasosmart_lowdata', isChecked);
        applyLowDataMode(isChecked);
        window.location.reload(); // Hard reload to prevent loading big assets
      });
    }
  
    // 4. Service Worker (Disabled for local dev to avoid Safari Cache crashes)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
  });
