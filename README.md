# ESP32-WROOM Flasher for MavESP8266 Firmware

A web-based tool to flash the MavESP8266 firmware onto ESP32-WROOM boards directly from your browser. No platform-specific tools or installations required. Ideal for quickly flashing firmware with progress tracking and live logs.

Try it online: https://nipundharmarathne.github.io/mavesp8266_flasher_for_esp32/

<!-- If you find this tool helpful, consider supporting its development:

<p>
  <a href="https://github.com/sponsors/YOUR_USERNAME" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Sponsor-181717?logo=github&style=for-the-badge" alt="GitHub Sponsors" width="150" style="vertical-align:middle;" />
  </a>
  &nbsp;&nbsp;
  <a href="https://www.buymeacoffee.com/YOUR_USERNAME" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" width="150" style="vertical-align:middle;" />
  </a>
</p> -->


## Features

- Connect to ESP32-WROOM via the Web Serial API.
- Flash multiple firmware files in sequence:
  - bootloader.bin
  - partitions.bin
  - boot_app0.bin
  - firmware.bin
- Supports erase, compress, and keep flash size options.
- Real-time progress reporting and log output.
- Cross-platform: works on modern browsers (Chrome, Edge).


## Usage

1. Open the web page in a supported browser: https://nipundharmarathne.github.io/mavesp8266_flasher_for_esp32/
2. Click Connect and select your ESP32-WROOM serial port.
3. Once connected, click Flash Firmware to upload the firmware.
4. Monitor the log panel for progress and completion messages.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



