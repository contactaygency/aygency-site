// Toggle pills (platforms, oui/non) — visual selection only
document.querySelectorAll('[data-toggle-group]').forEach(function (group) {
  group.querySelectorAll('.pill-toggle').forEach(function (pill) {
    pill.addEventListener('click', function () {
      pill.classList.toggle('selected');
    });
  });
});

// Forms send via mailto: — opens the visitor's mail app pre-filled,
// addressed to contact.aygency@gmail.com. No third-party account needed.
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

function wireForm(formId, successId, subject) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

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

    var body = encodeURIComponent(lines.join('\n'));
    var mailSubject = encodeURIComponent(subject);
    var mailtoUrl = 'mailto:' + DESTINATION_EMAIL + '?subject=' + mailSubject + '&body=' + body;

    window.location.href = mailtoUrl;

    success.classList.add('visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

wireForm('apply-form', 'form-success', 'Candidature Aygency');
wireForm('contact-form', 'form-success', 'Message depuis le site Aygency');
