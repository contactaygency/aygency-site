// Toggle pills (platforms, oui/non) — visual selection only
document.querySelectorAll('[data-toggle-group]').forEach(function (group) {
  group.querySelectorAll('.pill-toggle').forEach(function (pill) {
    pill.addEventListener('click', function () {
      pill.classList.toggle('selected');
    });
  });
});

// Demo form handling: no backend connected yet.
// Replace this with a real endpoint (e.g. Formspree, EmailJS, or your own API) to actually receive submissions.
function wireDemoForm(formId, successId) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.classList.add('visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
    form.querySelectorAll('.pill-toggle.selected').forEach(function (p) {
      p.classList.remove('selected');
    });
  });
}

wireDemoForm('apply-form', 'form-success');
wireDemoForm('contact-form', 'form-success');
