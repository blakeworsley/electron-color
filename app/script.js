const $ = require('jquery');

const { ipcRenderer, remote, clipboard } = require('electron');
const mainProcess = remote.require('./main');
const robot = require("robotjs");

const $electronColorApp = $('.electron-color-app');
const $gradientColor = $('.gradient-color');
const $rgbaValue = $('.rgba-value');
const $hexValue = $('.hex-value');
const $currentColor = $('.current-color');

const $saveColorButton = $('.save-color-button');
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

const $hslaValue = $('.hsla-value');

const $gradient = $('.gradient');
const $savedColors = $('.saved-colors');
const $eyedropperView = $('.eyedropper-view');
const $colorPickerFullscreen = $('.color-picker-fullscreen');

let eyedropperToggled = false;

mainProcess.retrieveDataFromStorage();
$colorPickerFullscreen.toggle();
$eyedropperView.toggle();

ipcRenderer.on('retrieved-colors', (event, data) => {
  updateInputs(data.current);
  savedColors(data);
  updateColor();
});


$(document).keyup(function(e) {
  if (e.keyCode == 68) {toggleEyedropper();};
});


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
  copied('rgba');
  });
$hexValueButton.on('click', function() {
  clipboard.writeText($hexValueButton.text().trim());
  copied('hex');
});
$hslaValue.on('click', function() {
  clipboard.writeText($hslaValue.text().trim());
  copied('hsla');
});

function copied(value) {
    $(`.copied-to-clipboard-${value}`).fadeIn('fast', () => {
       $(`.copied-to-clipboard-${value}`).delay(750).fadeOut();
    });
}

$eyedropperButton.on('click', () => { toggleEyedropper(); });
$currentColor.on('click', () => { toggleEyedropper(); });
$gradient.on('click', () => { grabAndChangeColor(); });
$savedColors.on('click', () => { grabAndChangeColor(); });

$saveColorButton.on('click', function() {
  let red = $redValueInput.val();
  let green = $greenValueInput.val();
  let blue = $blueValueInput.val();
  let alpha = $alphaValueInput.val();
  mainProcess.saveCurrentColor({ r:red, g:green, b:blue, a:alpha });
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

function rgbToHex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}


function rgbToHsla(rgbArr){
    var r1 = rgbArr[0] / 255;
    var g1 = rgbArr[1] / 255;
    var b1 = rgbArr[2] / 255;

    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);
    var L = (maxColor + minColor) / 2 ;
    var S = 0;
    var H = 0;
    if(maxColor !== minColor){
        if(L < 0.5){
            S = (maxColor - minColor) / (maxColor + minColor);
        }else{
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        if(r1 === maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 === maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }
    L = Math.round(L * 100);
    S = Math.round(S * 100);
    H = Math.round(H * 60);
    if(H<0){
        H += 360;
    }
    var result = [H, S, L, rgbArr[3]];
    return result;
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
  let hsla = rgbToHsla([red,green,blue,alpha]);
  updateGradientColor(hsla, hex);
  updateSliderColor(red, green, blue, alpha);
  $hexValue.html(hex);
  $rgbaValue.html(rgba);
  $hslaValue.html(`hsla(${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${alpha})`);
  mainProcess.persistCurrentColor({ r:red, g:green, b:blue, a:alpha });
}

function updateSliderColor(red, green, blue, alpha) {
  if($('.update-slider').length < 1) {
    $currentColor.css({'background-color': `rgba(${red}, ${green}, ${blue}, ${alpha})`});
    return $(`<style class="update-slider">input[type=range]::-webkit-slider-thumb{background:rgba(${red}, ${green}, ${blue}, ${alpha})}</style>`).appendTo('head');
  }
  $('.update-slider').html(`input[type=range]::-webkit-slider-thumb{background:rgba(${red}, ${green}, ${blue}, ${alpha})}`);
  $currentColor.css({'background-color': `rgba(${red}, ${green}, ${blue}, ${alpha})`});

}

function updateGradientColor(hsla, hex) {
  const [ h, s, l, a ] = hsla;
  const gradient = `linear-gradient(-270deg, hsla(${h},100%,50%, 0) 0%, ${hex} 100%)`;
  $gradientColor.css({'background-image': gradient});
}

function updateEyedropperView() {
  const { position, dropperColor } = getDropperColor();
  $eyedropperView.css({
    'top': `${position.y-67.5}px`,
    'left': `${position.x-45}px`,
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

function toggleDisplays(){
  $colorPickerFullscreen.toggle();
  $eyedropperView.toggle();
  $electronColorApp.toggle();
  $savedColors.toggle();
}

function grabAndChangeColor() {
  const hex = getDropperColor();
  const rgb = hexToRgb(hex.dropperColor);
  updateInputs(rgb);
  updateColor();
}

function toggleEyedropper() {
  if(!eyedropperToggled){
    toggleDisplays();
    $colorPickerFullscreen.on('mousemove', () => {
      updateEyedropperView();
    });
    $colorPickerFullscreen.on('click', () => {
      grabAndChangeColor();
      toggleEyedropper();
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
  $savedColors.empty();
  data.saved.map((i, count) => {
    if (count >= 20) {return}
   else  {
      $savedColors.append(`
        <li class='saved-color saved-color-${count + 1}' style='background-color:${`rgba(${i.r}, ${i.g}, ${i.b}, ${i.a})`};'></li>
      `);
    }
  });
}
