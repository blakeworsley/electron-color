const $bodyBackground = $('.body-background');
const $redValueInput = $('.red-value-input');
const $greenValueInput = $('.green-value-input');
const $blueValueInput = $('.blue-value-input');
const $alphaValueInput = $('.alpha-value-input');
const $redValue = $('.red-value');
const $greenValue = $('.green-value');
const $blueValue = $('.blue-value');
const $alphaValue = $('.alpha-value');

$redValueInput.on('change', function(e) {
  e.preventDefault();
  let r = $redValueInput.val();
  $redValue.html(r);
  updateColor();
});

$greenValueInput.on('change', function(e) {
  e.preventDefault();
  let g = $greenValueInput.val();
  $greenValue.html(g);
  updateColor();
});

$blueValueInput.on('change', function(e) {
  e.preventDefault();
  let b = $blueValueInput.val();
  $blueValue.html(b);
  updateColor();
});

$alphaValueInput.on('change', function(e) {
  e.preventDefault();
  let a = $alphaValueInput.val();
  $alphaValue.html(a);
  updateColor();
});

function updateColor(){
  let rgba = `rgba(${$redValueInput.val()}, ${$greenValueInput.val()}, ${$blueValueInput.val()}, ${$alphaValueInput.val()})`;
  $bodyBackground.css({'background-color': `${rgba}`});
}
