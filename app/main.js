const { app, Menu, Tray, BrowserWindow } = require('electron');
const storage = require('electron-storage');

let mainWindow = null;
let tray = null;

app.on('ready', () => {
  doesStorageExist();
  mainWindow = new BrowserWindow({
    width: 3000,
    height: 3000,
    fullscreen: false,
    frame: false,
    transparent: true,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  console.log(Tray);
  
  tray = new Tray(`./app/img/eyedropper.png`);
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
  ])
  tray.setToolTip('Electron Color');
  tray.setContextMenu(contextMenu);
  // Menu.setApplicationMenu(menu);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
});

const doesStorageExist = () => {
  storage.isPathExists('saved-colors.json')
    .then(itDoes => {
      if (!itDoes) {
        storage.set('saved-colors', defaultData)
          .then(() => console.log('The file was successfully written to the storage'))
          .catch((err) => console.log(err));
      }
    });
};

// const onRefocus() = exports.onRefocus = () => {
//   return mainWindow.setIgnoreMouseEvents(false)
// }

// const clickThroughWindow = exports.clickThroughWindow = (mouseInApp) => {
//   return mainWindow.setIgnoreMouseEvents(mouseInApp)
// }

const retrieveDataFromStorage = exports.retrieveDataFromStorage = () => {
  storage.get('saved-colors')
    .then(data => {
      mainWindow.webContents.send('retrieved-colors', data);
    }).then((response) => console.log(response) )
    .catch(err => {
      console.log(err);
    });
};

const persistCurrentColor = exports.persistCurrentColor = (newCurrent) => {
  storage.get('saved-colors')
    .then(({ saved }) => {
      let updatedStorage = { current: newCurrent, saved };
      storage.set('saved-colors', updatedStorage)
        .catch((err) => console.log(err));
    })
    .catch(err => {
      console.log(err);
    });
};

const saveCurrentColor = exports.saveCurrentColor = (color) => {
  storage.get('saved-colors')
    .then((data) => {
      data.saved.unshift(color);
      let updatedColorArray = { current: data.current, saved: data.saved };
      storage.set('saved-colors', updatedColorArray)
        .then(() => retrieveDataFromStorage())
        .catch((err) => console.log(err));
    })
    .catch(err => console.log(err));
};

//data model//
const defaultData = { "current": {"r": 0, "g": 0, "b": 0, "a": 1 }, "saved": [] };

// const template = [
//   {
//     label: 'View',
//     submenu: [
//       {
//         role: 'reload'
//       },
//       {
//         role: 'toggledevtools'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'resetzoom'
//       },
//       {
//         role: 'zoomin'
//       },
//       {
//         role: 'zoomout'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'togglefullscreen'
//       }
//     ]
//   },
//   {
//     role: 'window',
//     submenu: [
//       {
//         role: 'minimize'
//       },
//       {
//         role: 'close'
//       }
//     ]
//   },
//   {
//     role: 'help',
//     submenu: [
//       {
//         label: 'Learn More',
//         click () { require('electron').shell.openExternal('http://electron.atom.io') }
//       }
//     ]
//   }
// ]

// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       {
//         role: 'about'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'services',
//         submenu: []
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'hide'
//       },
//       {
//         role: 'hideothers'
//       },
//       {
//         role: 'unhide'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         role: 'quit'
//       }
//     ]
//   })
//   // Edit menu.
//   template[1].submenu.push(
//     {
//       type: 'separator'
//     },
//     {
//       label: 'Speech',
//       submenu: [
//         {
//           role: 'startspeaking'
//         },
//         {
//           role: 'stopspeaking'
//         }
//       ]
//     }
//   )
//   // Window menu.
//   template[3].submenu = [
//     {
//       label: 'Close',
//       accelerator: 'CmdOrCtrl+W',
//       role: 'close'
//     },
//     {
//       label: 'Minimize',
//       accelerator: 'CmdOrCtrl+M',
//       role: 'minimize'
//     },
//     {
//       label: 'Zoom',
//       role: 'zoom'
//     },
//     {
//       type: 'separator'
//     },
//     {
//       label: 'Bring All to Front',
//       role: 'front'
//     }
//   ]
// }

// const menu = Menu.buildFromTemplate(template);
// console.log(menu);