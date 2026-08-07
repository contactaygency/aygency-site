// Toggle pills (platforms, oui/non) — visual selection only
document.querySelectorAll('[data-toggle-group]').forEach(function (group) {
  group.querySelectorAll('.pill-toggle').forEach(function (pill) {
    pill.addEventListener('click', function () {
      pill.classList.toggle('selected');
    });
  });
});

var DESTINATION_EMAIL = 'contact.aygency@gmail.com';

function fieldLabel(name) {
  var labels = {
    nom: 'Nom complet',
    prenom: 'Prénom',
    email: 'Email',
    telephone: 'Téléphone',
    age: 'Âge',
    ville: 'Ville / Pays',
    pseudo: 'Pseudonyme',
    audience: 'Audience estimée',
    lien: 'Lien du compte',
    niche: 'Niche / catégorie',
    disponibilite: 'Disponibilité',
    collaborations: 'Collaborations',
    pourquoi: 'Pourquoi rejoindre Aygency',
    objectifs: 'Objectifs',
    presentation: 'Présentation',
    message: 'Message'
  };
  return labels[name] || name;
}

function collectPlainBody(form) {
  var formData = new FormData(form);
  var lines = [];
  formData.forEach(function (value, key) {
    if (value) lines.push(fieldLabel(key) + ' : ' + value);
  });
  var selectedPlatforms = form.querySelectorAll('.pill-toggle-group .pill-toggle.selected');
  if (selectedPlatforms.length) {
    var platforms = [];
    selectedPlatforms.forEach(function (p) { platforms.push(p.textContent.trim()); });
    lines.push('Plateformes actives : ' + platforms.join(', '));
  }
  return lines.join('\n');
}

function showFallback(success, plainBody, formId) {
  success.classList.add('visible');
  success.innerHTML =
    '<div style="margin-bottom:10px;">L\'envoi automatique a échoué. Copiez le message ci-dessous et envoyez-le manuellement à <strong>' + DESTINATION_EMAIL + '</strong>.</div>' +
    '<textarea readonly style="width:100%;min-height:140px;font-family:inherit;font-size:0.85rem;border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:10px;background:#fff;">' + plainBody + '</textarea>' +
    '<button type="button" id="' + formId + '-copy-btn" class="btn btn-outline" style="width:100%;">Copier le message</button>';
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });

  var copyBtn = document.getElementById(formId + '-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var textarea = success.querySelector('textarea');
      textarea.select();
      navigator.clipboard.writeText(textarea.value).then(function () {
        copyBtn.textContent = 'Copié ✓';
        setTimeout(function () { copyBtn.textContent = 'Copier le message'; }, 2000);
      }).catch(function () {
        document.execCommand('copy');
      });
    });
  }
}

function showSuccess(success) {
  success.classList.add('visible');
  success.innerHTML = 'Merci ! Votre message a bien été envoyé.';
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function wireForm(formId, successId) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  if (!form) return;

  var endpoint = form.getAttribute('data-formspree');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    var plainBody = collectPlainBody(form);
    var formData = new FormData(form);

    fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          showSuccess(success);
          form.reset();
          form.querySelectorAll('.pill-toggle.selected').forEach(function (p) {
            p.classList.remove('selected');
          });
        } else {
          showFallback(success, plainBody, formId);
        }
      })
      .catch(function () {
        showFallback(success, plainBody, formId);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
  });
}

wireForm('apply-form', 'form-success');
wireForm('contact-form', 'form-success');
