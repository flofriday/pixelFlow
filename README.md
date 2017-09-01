<p align="center">
  <a>
    <img src="Images/logo.png" width=72 height=72>
  </a>

  <h3 align="center">pixelFlow</h3>

  <p align="center">
    The open source platform for 16x16 pixel displays.
    <br>
    <a href="#status">Beta-Stage</a>
    &middot;
    <a href="https://www.github.com/flofriday">flofriday</a>
  </p>
</p>


## Table of contents
- [Quick start](#quick-start)
- [Status](#status)
- [Software](#software)
- [Hardware](#hardware)
- [Communication](#communication)
- [Contribute](#contribute)
- [License](#license)

## Quick Start
Currently, there is a [release](https://github.com/flofriday/pixelFlow/releases) for Windows users. Other platforms will come soon.

**You must also download the Arduino folder from the release when you want to control the hardware!**

### For Developers
1. Open your favorite Terminal.
2. Download this repository `git https://github.com/flofriday/pixelFlow.git`.
3. Go into the folder "App" `cd App` and run `npm install`.
4. Start the Software with `npm start`.
5. Go into the folder "Arduino" and upload the Code on an Arduino Mega.

## Status
This project is almost done. There are only some binaries and documentation missing. Sure some features are missing but for now this project won't get any new features.

Feel free to write your own code and features and contribute it.

## Communication
Documentation for the communication will come soon.

## Software
!["Picture of Software"](Images/software.png)


The Software is built with Electron, therefore it runs on macOS, Windows and
Linux. Currently, it can only communicate with the Arduino over USB.

## Hardware
Documentation for the hardware will come soon.

## Contribute
Feel free to write issues and submit pull requests.

There aren't any style guides right now, please try to catch my style.
And format it with tabs.

## License
The whole platform is licensed under the [MIT License](LICENSE).

This License is also used for the Firmware(Arduino) and Software with only one exception.
The file `App/js/html5kellycolorpicker.min.js` is licensed under GPLv3 and was
written by ["NC22"](https://github.com/NC22/HTML5-Color-Picker).
