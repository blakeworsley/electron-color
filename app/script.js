const { clipboard } = require('electron');

const $bodyBackground = $('.body-background');
const $rgbaValue = $('.rgba-value');
const $hexValue = $('.hex-value');
const $hexContainer = $('.hex-container');
const $rgbaContainer = $('.rgba-containter');

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

function handleIndividualColorValue( colorSelector, colorValue, alternateColorSelector ) {
  let color = colorSelector;
  color = validateMaxColorValue(color, 255);
  colorSelector.val(color);
  colorValue.html(color);
  alternateColorSelector.val(color);
  updateColor();
}

$redValueInput.on('change', () => handleIndividualColorValue($redValueInput, $redValue, $redValueInputSlider));
$greenValueInput.on('change', () => handleIndividualColorValue($greenValueInput, $greenValue, $greenValueInputSlider));
$blueValueInput.on('change', () => handleIndividualColorValue($blueValueInput, $blueValue, $blueValueInputSlider));
$alphaValueInput.on('change', () => handleIndividualColorValue($alphaValueInput, $alphaValue, $alphaValueInputSlider));

$redValueInputSlider.on('change', () => handleIndividualColorValue($redValueInputSlider, $redValue, $redValueInput));
$greenValueInputSlider.on('change', () => handleIndividualColorValue($greenValueInputSlider, $greenValue, $greenValueInput));
$blueValueInputSlider.on('change', () => handleIndividualColorValue($blueValueInputSlider, $blueValue, $blueValueInput));
$alphaValueInputSlider.on('change', () => handleIndividualColorValue($alphaValueInputSlider, $alphaValue, $alphaValueInput));

$rgbaValue.on('click', function() {
  clipboard.writeText($rgbaValue.text().trim());
  $rgbaContainer.addClass('rgba-copied');
  debugger;
});

$hexValueButton.on('click', function() {
  clipboard.writeText($hexValueButton.text().trim());
  $hexContainer.addClass('hex-copied');
  debugger;
});

function rgbToHex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function validateMaxColorValue(inputValue, max) {
  let color = inputValue.val()
  if(color >= max) { return max; }
  if(color < 0) { return 0; }
  return color;
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
