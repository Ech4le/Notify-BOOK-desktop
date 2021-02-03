const { app, BrowserWindow } = require('electron');
const { is, setContentSecurityPolicy } = require('electron-util');
const config = require('./config');

// Aby uniknac mechanizmu usuwania nieuzytkow, okno nalezy zdeklarowac jako zmienna
let window;

// Okreslenie szczegolow okna przegladarki WWW.
function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Wczytanie pliku HTML-u
    if (is.development) {
        window.loadURL(config.LOCAL_WEB_URL);
    } else {
        window.loadURL(config.PRODUCTION_WEB_URL);
    }

    if (is.development) {
        window.webContents.openDevTools();
    }
    if (!is.development) {
        setContentSecurityPolicy(`
            default-src 'none';
            script-src 'self';
            img-src 'self' https://www.gravatar.com;
            style-src 'self' 'unsafe-inline';
            font-src 'self';
            connect-src 'self' $(config.PRODUCTION_API_URL);
            base-uri 'none';
            form-action 'none';
            frame-ancestors 'none';
        `);
    }
    
    // Po zamknieciu okna nalezy wyzerowac jego obiekt
    window.on('closed', () => {
        window = null;
    });
}

// Gdy framework Electron edzie gotowy, nalezy otworzyc okno aplikacji
app.on('ready', createWindow);

// Zakonczenie dzialania po zamknieciu wszystkich okien
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});
