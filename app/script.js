const $redValueInput = $('.red-value-input');
const $redValue = $('.red-value');

$redValueInput.on('keyup', function(e) {
  e.preventDefault();
  let r = $redValueInput.val();
  $redValue.innerText(r);
});
