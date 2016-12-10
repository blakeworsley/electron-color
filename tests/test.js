const Application = require('spectron').Application;
const expect = require('chai').expect;
const assert = require('chai').assert;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

const appPath = path.join(__dirname, '..');

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe('App starts and has correct title and buttons', function () {
  var app = null
  beforeEach(function () {
      app = new Application({ path: electronPath, args: [appPath]});
      return app.start();
  });

  afterEach(function () {
      return app.stop();
  });

  it('opens a window', function () {
    return app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1);
  });

  it('tests the title', function () {
    return app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Electron Color - Kyle & Blake');
  });
});

describe('App starts and has correct title and buttons', function () {
  it.skip('should change the red input value when the red range slider value is changed', () => {
    
  });
  it.skip('should change the green input value when the green range slider value is changed', () => {
    
  });
  it.skip('should change the blue input value when the blue range slider value is changed', () => {
    
  });
  it.skip('should change the alpha input value when the alpha range slider value is changed', () => {
    
  });

  it.skip('should change the red range slider value when the red input value is changed', () => {
    
  });
  it.skip('should change the green range slider value when the green input value is changed', () => {
    
  });
  it.skip('should change the blue range slider value when the blue input value is changed', () => {
    
  });
  it.skip('should change the alpha range slider value when the alpha input value is changed', () => {
    
  });

  it.skip('should update rbga value when values are changed', () => {
    
  });
  
  it.skip('should update hex value when values are changed', () => {
    
  });

  it.skip('should update hsla value when values are changed', () => {
    
  });
});

describe('Copies values to the clipboard', function () {
  it.skip('should copy rgba value to the clipboard ', () => {
    
  });
  it.skip('should copy hex value to the clipboard ', () => {
    
  });
  it.skip('should copy hsla value to the clipboard ', () => {
    
  });
});

