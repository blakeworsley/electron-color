const $redValueInput = $('.red-value-input');
const $greenValueInput = $('.green-value-input');
const $blueValueInput = $('.blue-value-input');
const $alphaValueInput = $('.alpha-value-input');
const $redValue = $('.red-value');
const $greenValue = $('.green-value');
const $blueValue = $('.blue-value');
const $alphaValue = $('.alpha-value');

$redValueInput.on('keyup', function(e) {
  e.preventDefault();
  let r = $redValueInput.val();
  $redValue.html(r);
});

$greenValueInput.on('keyup', function(e) {
  e.preventDefault();
  let g = $greenValueInput.val();
  $greenValue.html(g);
});

$blueValueInput.on('keyup', function(e) {
  e.preventDefault();
  let b = $blueValueInput.val();
  $blueValue.html(b);
});

$alphaValueInput.on('keyup', function(e) {
  e.preventDefault();
  let a = $alphaValueInput.val();
  $alphaValue.html(a);
});
