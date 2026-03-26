import { ESPLoader } from 'https://unpkg.com/esptool-js@0.4.5/bundle.js';

const log = document.getElementById('log');
let esploader, port, connected = false;

function appendLog(msg, noTimestamp = false) {
    const timestamp = new Date().toLocaleTimeString();
    log.textContent += noTimestamp ? `${msg}\n` : `[${timestamp}] ${msg}\n`;
    log.scrollTop = log.scrollHeight;
}

function updateStatus(isConnected) {
    connected = isConnected;
    const connectBtn = document.getElementById('connect');
    const flashBtn = document.getElementById('flash');
    const tplinkBtn = document.getElementById('flash-tplink');

    flashBtn.disabled = !isConnected;
    tplinkBtn.disabled = !isConnected;

    if (isConnected) {
        connectBtn.textContent = 'Disconnect';
        connectBtn.classList.remove('connect');
        connectBtn.classList.add('disconnect');
    } else {
        connectBtn.textContent = 'Connect';
        connectBtn.classList.remove('disconnect');
        connectBtn.classList.add('connect');
    }
}

async function blobToString(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsBinaryString(blob);
    });
}

appendLog("==============================", true);
appendLog(" ESP32 Firmware Flasher Ready", true);
appendLog("==============================\n", true);

// CONNECT BUTTON
document.getElementById('connect').addEventListener('click', async () => {
    const connectBtn = document.getElementById('connect');
    connectBtn.disabled = true; // Disable immediately

    if (connected) {
        try { await port.close(); } catch {}
        esploader = port = null;
        updateStatus(false);
        appendLog("Disconnected from device.");
        connectBtn.disabled = false; // Re-enable
        return;
    }

    try {
        appendLog("Requesting serial port access...");
        port = await navigator.serial.requestPort();

        esploader = new ESPLoader({
            port,
            baudrate: 921600,
            logger: {
                log: appendLog,
                error: msg => appendLog("ERROR: " + msg),
                debug: () => {}
            }
        });

        appendLog("Connecting to ESP32...");
        appendLog("Hold BOOT button if needed...");

        const chipName = await esploader.main();
        appendLog(`✓ Connected to ${chipName}\n`);
        updateStatus(true);

    } catch (err) {
        appendLog(`✗ Connection failed: ${err.message}`);
        updateStatus(false);
        try { await esploader.disconnect(); } catch {}
    }

    connectBtn.disabled = false; // Re-enable whether success or fail
});

// FLASH BUTTON
document.getElementById('flash').addEventListener('click', async () => {
    if (!connected || !esploader) {
        appendLog("✗ Not connected!");
        return;
    }

    const flashButton = document.getElementById('flash');
    const flashTplinkButton = document.getElementById('flash-tplink');
    const connectBtn = document.getElementById('connect');

    flashButton.disabled = true;
    flashButton.textContent = 'Flashing...';
    flashTplinkButton.disabled = true;
    connectBtn.disabled = true;

    try {
        const files = [
            'bin_files/general/bootloader.bin', 
            'bin_files/general/partitions.bin', 
            'bin_files/general/boot_app0.bin', 
            'bin_files/general/firmware.bin'
        ];
        const addresses = [0x1000, 0x8000, 0xE000, 0x10000];
        const fileArray = [];

        for (let i = 0; i < files.length; i++) {
            appendLog(`Loading ${files[i]}...`);
            const resp = await fetch(files[i]);
            if (!resp.ok) throw new Error(`Failed to load ${files[i]}`);
            fileArray.push({
                data: await blobToString(await resp.blob()),
                address: addresses[i]
            });
        }

        appendLog("Flashing firmware...");

        await esploader.writeFlash({
            fileArray,
            flashSize: "keep",
            eraseAll: true,
            compress: true,
            reportProgress: (idx, written, total) => {
                const percent = ((written / total) * 100).toFixed(1);
                appendLog(`${files[idx]}: ${percent}%`);
            }
        });

        appendLog("✓ Firmware flashed successfully!\n");

    } catch (err) {
        appendLog(`✗ Flash failed: ${err.message}`);
    }

    flashButton.textContent = 'Flash Firmware';
    flashButton.disabled = false;
    flashTplinkButton.disabled = false;
    connectBtn.disabled = false;
});



// FLASH TPLINK BUTTON
document.getElementById('flash-tplink').addEventListener('click', async () => {
    if (!connected || !esploader) {
        appendLog("✗ Not connected!");
        return;
    }

    const flashTplinkButton = document.getElementById('flash-tplink');
    const flashButton = document.getElementById('flash');
    const connectBtn = document.getElementById('connect');

    flashTplinkButton.disabled = true;
    flashTplinkButton.textContent = 'Flashing Tplink...';
    flashButton.disabled = true;
    connectBtn.disabled = true;

    try {
        const files = [
            'bin_files/tplink/bootloader.bin',
            'bin_files/tplink/partitions.bin',
            'bin_files/tplink/boot_app0.bin',
            'bin_files/tplink/firmware.bin'
        ];
        const addresses = [0x1000, 0x8000, 0xE000, 0x10000];
        const fileArray = [];

        for (let i = 0; i < files.length; i++) {
            appendLog(`Loading ${files[i]}...`);
            const resp = await fetch(files[i]);
            if (!resp.ok) throw new Error(`Failed to load ${files[i]}`);
            fileArray.push({
                data: await blobToString(await resp.blob()),
                address: addresses[i]
            });
        }

        appendLog("Flashing Tplink firmware...");

        await esploader.writeFlash({
            fileArray,
            flashSize: "keep",
            eraseAll: true,
            compress: true,
            reportProgress: (idx, written, total) => {
                const percent = ((written / total) * 100).toFixed(1);
                appendLog(`${files[idx]}: ${percent}%`);
            }
        });

        appendLog("✓ Tplink firmware flashed successfully!\n");

    } catch (err) {
        appendLog(`✗ Flash Tplink failed: ${err.message}`);
    }

    flashTplinkButton.textContent = 'Flash Tplink';
    flashTplinkButton.disabled = false;
    flashButton.disabled = false;
    connectBtn.disabled = false;
});