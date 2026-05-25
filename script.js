/* ==========================================================================
                  JAVASCRIPT FILE FOR CONTACT PAGE
   ========================================================================== */

const form  = document.getElementById("contactForm");
const btn   = document.getElementById("sendBtn");
const toast = document.getElementById("toast");

function showToast(msg, type = 'info') {
  toast.classList.remove('success', 'error', 'warning', 'info');
  toast.classList.add(type);
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.remove('success', 'error', 'warning', 'info');
  }, 2000);
}
// ── Chip interactions ──────────────────────────────────────────────

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function(e) {
    const action = this.dataset.action;
    const value  = this.dataset.value;

    if (action === 'copy-email') {
      e.preventDefault();                    
      navigator.clipboard.writeText(value)
        .then(() => {
          showToast('Email address copied!', 'success');
        })
        .catch(() => {
          const tempInput = document.createElement('input');
          tempInput.value = value;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast('Email address copied!', 'success');
        });
    }

    if (action === 'open-whatsapp') {
      e.preventDefault();
      showToast('Opening WhatsApp…', 'info');
      setTimeout(() => {
        window.open(this.href, '_blank');
      }, 500);
    }
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

 if (!payload.name || !payload.email || !payload.subject || !payload.message) {
   showToast('Please fill in all required fields ❗');
    return;
}

  btn.disabled = true;
  btn.classList.add('is-loading');

  try {
    const res = await fetch('https://formspree.io/f/mdajllbp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      // ✅ Redirect to your local thanks page
      window.location.href = 'thanks.html';   
    } else {
      const data = await res.json();
      showToast(data.error || 'Something went wrong ❌');
    }
  } catch (err) {
    showToast('Network error ❌');
  } finally {
    btn.classList.remove('is-loading');
    btn.disabled = false;
  }
});

document.getElementById("year").textContent = new Date().getFullYear();