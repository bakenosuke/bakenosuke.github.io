// Dynamically set progress bar widths based on years of experience.
// 100% corresponds to MAX_YEARS.
(function() {
  var MAX_YEARS = 18; // Upper bound for 100%

  function updateSkillProgressBars() {
    var skills = document.querySelectorAll('.skill');
    skills.forEach(function(skill) {
      var levelEl = skill.querySelector('.skill-level');
      var progressBar = skill.querySelector('.skill-level-bar .progress-bar');
      if (!levelEl || !progressBar) return;

      var text = levelEl.textContent || '';
      var match = text.match(/(\d+(?:\.\d+)?)/); // capture integer or decimal
      if (!match) return;

      var years = parseFloat(match[1]);
      if (isNaN(years)) return;

      var percent = Math.min((years / MAX_YEARS) * 100, 100);
      // Preserve existing classes; just override width
      progressBar.style.width = percent.toFixed(3) + '%';
      progressBar.setAttribute('aria-valuenow', percent.toFixed(0));
      progressBar.dataset.years = years.toString();
      progressBar.title = years + ' Years';
    });
  }

  // Run on DOMContentLoaded (in case this script is loaded early)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSkillProgressBars);
  } else {
    updateSkillProgressBars();
  }
})();

