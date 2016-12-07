const { clipboard } = require('electron');

const $bodyBackground = $('.body-background');
const $rgbaValue = $('.rgba-value');

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
  let r = $redValueInput;
  r = validateMaxColorValue(r, 255);
  $redValueInput.val(r);
  $redValue.html(r);
  $redValueInputSlider.val(r);
  updateColor();
});

$greenValueInput.on('change', function() {
  let g = $greenValueInput;
  g = validateMaxColorValue(g, 255); 
  $greenValueInput.val(g);   
  $greenValue.html(g);
  $greenValueInputSlider.val(g);  
  updateColor();
});

$blueValueInput.on('change', function() {
  let b = $blueValueInput;
  b = validateMaxColorValue(b, 255);
  $blueValueInput.val(b);  
  $blueValue.html(b);
  $blueValueInputSlider.val(b);  
  updateColor();
});

$alphaValueInput.on('change', function() {
  let a = $alphaValueInput;
  a = validateMaxColorValue(a, 1);  
  $alphaValueInput.val(a);  
  $alphaValue.html(a);
  $alphaValueInputSlider.val(a);
  updateColor();
});

$redValueInputSlider.on('change', function() {
  let r = $redValueInputSlider;
  r = validateMaxColorValue(r, 255);    
  $redValueInputSlider.val(r);  
  $redValue.html(r);
  $redValueInput.val(r);
  updateColor();
});

$greenValueInputSlider.on('change', function() {
  let g = $greenValueInputSlider;
  g = validateMaxColorValue(g, 255);
  $greenValueInputSlider.val(g);      
  $greenValue.html(g);
  $greenValueInput.val(g);  
  updateColor();
});

$blueValueInputSlider.on('change', function() {
  let b = $blueValueInputSlider;
  b = validateMaxColorValue(b, 255);  
  $blueValueInputSlider.val(b);    
  $blueValue.html(b);
  $blueValueInput.val(b);  
  updateColor();
});

$alphaValueInputSlider.on('change', function() {
  let a = $alphaValueInputSlider;
  a = validateMaxColorValue(a, 1);
  $alphaValueInputSlider.val(a);  
  $alphaValue.html(a);
  $alphaValueInput.val(a);
  updateColor();
});

$rgbaValue.on('click', function() {
  clipboard.writeText($rgbaValue.text().trim());
});

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
}

function updateBackgroundColor(red, green, blue) {
  $bodyBackground.css({'background-color': `rgba(${red}, ${green}, ${blue}, 0.5)`});
}
