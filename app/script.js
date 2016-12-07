const { clipboard } = require('electron');

const $bodyBackground = $('.body-background');
const $rgbaValue = $('.rgba-value');
const $hexValue = $('.hex-value');

const $hexValueButton = $('.hex-value-button');

const $redValueInput = $('.red-value-input');
const $greenValueInput = $('.green-value-input');
const $blueValueInput = $('.blue-value-input');
const $alphaValueInput = $('.alpha-value-input');

const $redValueInputSlider = $('.red-value-input-slider');
const $greenValueInputSlider = $('.green-value-input-slider');
const $blueValueInputSlider = $('.blue-value-input-slider');
const $alphaValueInputSlider = $('.alpha-value-input-slider');

const $redValue = $('.red-value');
const $greenValue = $('.green-value');
const $blueValue = $('.blue-value');
const $alphaValue = $('.alpha-value');

$redValueInput.on('change', function() {
  let r = $redValueInput.val();
  $redValue.html(r);
  $redValueInputSlider.val(r);
  updateColor();
});

$greenValueInput.on('change', function() {
  let g = $greenValueInput.val();
  $greenValue.html(g);
  $greenValueInputSlider.val(g);
  updateColor();
});

$blueValueInput.on('change', function() {
  let b = $blueValueInput.val();
  $blueValue.html(b);
  $blueValueInputSlider.val(b);
  updateColor();
});

$alphaValueInput.on('change', function() {
  let a = $alphaValueInput.val();
  $alphaValue.html(a);
  $alphaValueInputSlider.val(a);
  updateColor();
});

$redValueInputSlider.on('change', function() {
  let r = $redValueInputSlider.val();
  $redValue.html(r);
  $redValueInput.val(r);
  updateColor();
});

$greenValueInputSlider.on('change', function() {
  let g = $greenValueInputSlider.val();
  $greenValue.html(g);
  $greenValueInput.val(g);
  updateColor();
});

$blueValueInputSlider.on('change', function() {
  let b = $blueValueInputSlider.val();
  $blueValue.html(b);
  $blueValueInput.val(b);
  updateColor();
});

$alphaValueInputSlider.on('change', function() {
  let a = $alphaValueInputSlider.val();
  $alphaValue.html(a);
  $alphaValueInput.val(a);
  updateColor();
});

$rgbaValue.on('click', function() {
  clipboard.writeText($rgbaValue.text().trim());
  alert('Value copied!');
});

// TODO: Need access to result of rgbToHex function
// $hexValueButton.on('click', function() {
//   let hex = rgbToHex('rgba(255, 80, 0, 1)');
//   clipboard.writeText(hex);
// });

function rgbToHex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function updateColor(){
  let red = $redValueInput.val();
  let green = $greenValueInput.val();
  let blue = $blueValueInput.val();
  let alpha = $alphaValueInput.val();
  let rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  updateBackgroundColor(red, green, blue);
  let hex = rgbToHex(rgba);
  $hexValue.html(hex);
}

function updateBackgroundColor(red, green, blue) {
  $bodyBackground.css({'background-color': `rgba(${red}, ${green}, ${blue}, 0.5)`});
}
