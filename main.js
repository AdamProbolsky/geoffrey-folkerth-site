// Mobile nav
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });
})();

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Lead form
(function () {
  var form = document.getElementById('lead-form');
  if (!form) return;

  var COUNTRIES = ["United States","Canada","Mexico","United Kingdom","Ireland","Poland","Germany","France","Italy","Spain","Switzerland","Netherlands","Australia","New Zealand",
    "———",
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","Gabon","Gambia","Georgia","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Israel","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Portugal","Qatar","Romania","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Sri Lanka","Sudan","Suriname","Sweden","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Other"];

  var STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Other U.S. territory"];

  var country = document.getElementById('country');
  var state = document.getElementById('state');
  var stateField = document.getElementById('state-field');

  function fill(select, items, placeholder) {
    var o = document.createElement('option');
    o.value = ''; o.textContent = placeholder; select.appendChild(o);
    items.forEach(function (name) {
      var opt = document.createElement('option');
      if (name === '———') { opt.disabled = true; opt.textContent = '──────────'; }
      else { opt.value = name; opt.textContent = name; }
      select.appendChild(opt);
    });
  }
  fill(country, COUNTRIES, 'Select a country');
  fill(state, STATES, 'Select a state');
  country.value = 'United States';

  function syncState() {
    var us = country.value === 'United States';
    stateField.classList.toggle('hidden', !us);
    state.required = us;
    if (!us) state.value = '';
  }
  country.addEventListener('change', syncState);
  syncState();

  // Fit score: helps Geoffrey decide who to call first. Shown in the email subject.
  var POINTS = {
    revenue: { 'Under $500K': 0, '$500K–$1M': 2, '$1M–$2M': 3, '$2M–$5M': 3, '$5M–$10M': 3, '$10M–$25M': 3, 'Over $25M': 2, 'Not sure': 1 },
    role: { 'Owner / co-owner': 2, 'CEO / executive (not owner)': 2, 'Employee': 0, 'Referring advisor (CPA, attorney, banker)': 2 },
    timing: { 'Urgent: deadline in 30 days': 2, 'Within 90 days': 2, 'Exploring': 0 },
    investment: { 'Yes': 3, 'Yes, if it pays for itself': 2, 'Need to talk to partners': 1, 'Not right now': 0 }
  };
  function val(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function scoreLead() {
    var total = 0;
    Object.keys(POINTS).forEach(function (k) { total += POINTS[k][val(k)] || 0; });
    var label = total >= 8 ? 'Strong fit' : total >= 5 ? 'Possible fit' : 'Low fit';
    return { total: total, label: label };
  }

  var statusEl = document.getElementById('form-status');
  var thanks = document.getElementById('thanks');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.classList.add('hidden');
    if (!form.reportValidity()) return;

    var s = scoreLead();
    var company = document.getElementById('company').value.trim();
    document.getElementById('fit_score').value = s.label + ' (' + s.total + '/10)';
    document.getElementById('subject').value =
      '[' + s.label + '] ' + company + ' | ' + (val('revenue') || 'revenue n/a') + ' | ' + (val('timing') || '');

    var data = new FormData(form);
    var situations = data.getAll('situation');
    data.delete('situation');
    data.append('situation', situations.length ? situations.join('; ') : 'None selected');

    button.disabled = true;
    button.textContent = 'Sending…';

    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        form.classList.add('hidden');
        thanks.classList.remove('hidden');
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        statusEl.textContent = 'Something went wrong sending the form. Please try again, or reach out on LinkedIn.';
        statusEl.className = 'form-status err';
        button.disabled = false;
        button.textContent = 'Send it to Geoffrey';
      });
  });
})();
