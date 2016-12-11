const { ipcRenderer, remote, clipboard } = require('electron');
const mainProcess = remote.require('./main');
const robot = require("robotjs");

const $electronColorApp = $('.electron-color-app');
const $gradientColor = $('.gradient-color');
const $rgbaValue = $('.rgba-value');
const $hexValue = $('.hex-value');
const $hexContainer = $('.hex-container');
const $rgbaContainer = $('.rgba-containter');
const $saveColorButton = $('.save-color-button');

const $eyedropperView = $('.eyedropper-view');
const $colorPickerFullscreen = $('.color-picker-fullscreen');

const $eyedropperButton = $('.eyedropper-button');
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

const $savedColors = $('.saved-colors');

mainProcess.retrieveDataFromStorage();
$colorPickerFullscreen.toggle();
$eyedropperView.toggle();

ipcRenderer.on('retrieved-colors', (event, data) => {
  updateInputs(data.current);
  savedColors(data);
  updateColor();
});

function updateInputs(data){
  $redValueInput.val(data.r);
  $greenValueInput.val(data.g);
  $blueValueInput.val(data.b);
  $alphaValueInput.val(data.a);
  $redValueInputSlider.val(data.r);
  $greenValueInputSlider.val(data.g);
  $blueValueInputSlider.val(data.b);
  $alphaValueInputSlider.val(data.a);
}

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

$redValueInputSlider.on('mousemove change', () => handleIndividualColorValue($redValueInputSlider, $redValue, $redValueInput));
$greenValueInputSlider.on('mousemove change', () => handleIndividualColorValue($greenValueInputSlider, $greenValue, $greenValueInput));
$blueValueInputSlider.on('mousemove change', () => handleIndividualColorValue($blueValueInputSlider, $blueValue, $blueValueInput));
$alphaValueInputSlider.on('mousemove change', () => handleIndividualColorValue($alphaValueInputSlider, $alphaValue, $alphaValueInput));

$rgbaValue.on('click', function() {
  clipboard.writeText($rgbaValue.text().trim());
  $rgbaContainer.addClass('rgba-copied');
});

$hexValueButton.on('click', function() {
  clipboard.writeText($hexValueButton.text().trim());
  $hexContainer.addClass('hex-copied');
});

$saveColorButton.on('click', function() {
  let red = $redValueInput.val();
  let green = $greenValueInput.val();
  let blue = $blueValueInput.val();
  let alpha = $alphaValueInput.val();
  mainProcess.saveCurrentColor({ r:red, g:green, b:blue, a:alpha });
});

function rgbToHex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function validateMaxColorValue(inputValue, max) {
  let color = inputValue.val();
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
  let hex = rgbToHex(rgba);
  updateGradientColor(red, green, blue, hex);
  updateBackgroundColor(red, green, blue, alpha);
  $hexValue.html(hex);
  $rgbaValue.html(rgba);
  mainProcess.persistCurrentColor({ r:red, g:green, b:blue, a:alpha });
}

function updateBackgroundColor(red, green, blue, alpha) {
  $(`<style>input[type=range]::-webkit-slider-thumb{background:rgba(${red}, ${green}, ${blue}, ${alpha})}</style>`).appendTo('html');
}

function updateGradientColor(red, green, blue, hex) {
  const gradient = `linear-gradient(-270deg, rgba(${red},${green},${blue}, 0) 0%, ${hex} 100%)`;
  $gradientColor.css({'background-image': gradient});
}

function updateEyedropperView() {
  const { position, dropperColor } = getDropperColor();
  $eyedropperView.css({
    'top': `${position.y-70}px`,
    'left': `${position.x-40}px`,
    'border': `solid 20px #${dropperColor}`,
  });
}

function getMousePosition(){
  return robot.getMousePos();
}

function getDropperColor(){
  const position = getMousePosition();
  const dropperColor = robot.getPixelColor(position.x, position.y);
  const color = {position, dropperColor};
  return color;
}

function hexToRgb(hex) {
    const large = parseInt(hex, 16);
    const r = (large >> 16) & 255;
    const g = (large >> 8) & 255;
    const b = large & 255;
    return {r:r, g:g, b:b, a:1};
}


let eyedropperToggled = false;

$eyedropperButton.on('click', () => {
  toggleEyedropper();
});

function toggleDisplays(){
  $colorPickerFullscreen.toggle();
  $eyedropperView.toggle();
  $electronColorApp.toggle();
  $savedColors.toggle();
}

function toggleEyedropper() {
  if(!eyedropperToggled){
    toggleDisplays(); 
    $colorPickerFullscreen.on('mousemove', () => {
      updateEyedropperView();
    });
    $colorPickerFullscreen.on('click', () => {
      const hex = getDropperColor();
      const rgb = hexToRgb(hex.dropperColor);
      console.log(hex, rgb, eyedropperToggled);
      updateInputs(rgb);
      updateColor();
      toggleEyedropper()
    });
  }
  if(eyedropperToggled){
    $colorPickerFullscreen.off('click');
    $colorPickerFullscreen.off('mousemove');
    toggleDisplays();
  }
  eyedropperToggled ? eyedropperToggled = false : eyedropperToggled = true;
}

function savedColors(data) {
    data.saved.map((i, count) => {
    if (count >= 20) {return};
    $savedColors.append(`
      <li class='saved-color saved-color-${count + 1}' style='background-color:${`rgba(${i.r}, ${i.g}, ${i.b}, ${i.a})`};'></li>
    `);
  });
}

$(document).keyup(function(e) {
  if (e.keyCode == 69) {$eyedropperView.toggle()};
  if (e.keyCode == 27) {toggleEyedropper();};
});
