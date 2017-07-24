/*
* This file is just a Prototype Firmware for pixelflow. It will only work on the
* Arduino Mega since the Arduino Uno has to little RAM (even if it compiles on
* the Uno).
* Unfortently the Performace is not the best so it's recommended to wait one
* Second between two frames.
*/


#include <stdint.h>
#include <Adafruit_NeoPixel.h>
#define PIN 6
#define MAX_BRIGHTNESS 50
Adafruit_NeoPixel strip = Adafruit_NeoPixel(256, PIN, NEO_GRB + NEO_KHZ800);


void setup()
{
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  Serial.begin(250000);
  //Serial.println("Started Pixelflow Firmware\n");

  //strip.setPixelColor(2, 255, 0, 0);
  //strip.setPixelColor(1, 255, 255, 0);
  //strip.setPixelColor(0, 0, 255, 0);
  strip.setBrightness(MAX_BRIGHTNESS);
  strip.show();
}


#define cmdBrightness '0'
#define cmdFrame '1'
#define cmdRow '2'
#define cmdColum '3'
#define cmdPixel '4'
#define cmdSave '5'
#define cmdBrightnessLength 3
#define cmdFrameLength 1536
#define cmdRowLength
#define cmdColumLength
#define cmdPixelLength 8
#define cmdSaveLength


String buffer = "";

void setBrightness()
{
  // Checking if the command has the right length
  if (buffer.length() != cmdBrightnessLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: updateBrightness wrong length.");
    return;
  }

  uint16_t brightness = buffer.toInt();

  //check if the value is too big
  if (brightness < 1 || brightness > MAX_BRIGHTNESS)
  {
    // The command was too long or too short
    Serial.println("ERROR: updateBrightness too big value");
    return;
  }

  // The command was correct so set the brightness of the strip
  strip.setBrightness(brightness);
  strip.show();
}


void drawFrame()
{
  // Checking if the command has the right length
  if (buffer.length() != cmdFrameLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: drawFrame wrong length.");
    Serial.println(buffer.length());
    return;
  }

  uint8_t curPixel = 0;
  uint8_t curColum = 0;
  uint8_t curRow = 0;
  uint8_t red = 0;
  uint8_t green = 0;
  uint8_t blue = 0;
  char strRed[3] = "";
  char strGreen[3] = "";
  char strBlue[3] = "";

  for (uint8_t r = 0; r < 16; r++)
  {
    for (uint8_t c = 0; c < 16; c++)
    {
      curColum = c;
      if (r % 2 == 1) curColum = 15 - curColum;
      curPixel = (r * 16) + curColum;

      strRed[0] = buffer.charAt(0);
      strRed[1] = buffer.charAt(1);
      strGreen[0] = buffer.charAt(2);
      strGreen[1] = buffer.charAt(3);
      strBlue[0] = buffer.charAt(4);
      strBlue[1] = buffer.charAt(5);
      buffer.remove(0, 6);

      red = (int)strtol(strRed, NULL, 16);
      green = (int)strtol(strGreen, NULL, 16);
      blue = (int)strtol(strBlue, NULL, 16);

      strip.setPixelColor(curPixel, red, green, blue);
    }
  }

  strip.show();
}


void drawPixel()
{
  // Checking if the command has the right length
  if (buffer.length() != cmdPixelLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: drawPixel wrong length.");
    return;
  }

  uint8_t stripPixel = 0;
  uint8_t red = 0;
  uint8_t green = 0;
  uint8_t blue = 0;
  uint8_t row = 0;
  uint8_t colum = 0;
  char strRed[3] = "";
  char strGreen[3] = "";
  char strBlue[3] = "";
  char strRow[2] = "";
  char strColum[2] = "";

  //char strPixel[3] = {buffer.charAt(0), buffer.charAt(1), 0};
  //stripPixel = (int)strtol(strPixel, NULL, 16);
  //buffer.remove(0, 2);
  strRow[0] =  buffer.charAt(0);
  strColum[0] =  buffer.charAt(1);

  row = (int)strtol(strRow, NULL, 16);
  colum = (int)strtol(strColum, NULL, 16);
  buffer.remove(0, 2);

  // fix the snake pattern of the leds on the matrix
  if (row % 2 == 1)
  {
    colum = 15 - colum;
  }

  stripPixel = row * 16 + colum;

  strRed[0] = buffer.charAt(0);
  strRed[1] = buffer.charAt(1);
  strGreen[0] = buffer.charAt(2);
  strGreen[1] = buffer.charAt(3);
  strBlue[0] = buffer.charAt(4);
  strBlue[1] = buffer.charAt(5);

  red = (int)strtol(strRed, NULL, 16);
  green = (int)strtol(strGreen, NULL, 16);
  blue = (int)strtol(strBlue, NULL, 16);

  strip.setPixelColor(stripPixel, red, green, blue);
  strip.show();
}


void analyseBuffer()
{
  char curCmd = buffer.charAt(0);
  buffer.remove(0, 1);
  //Serial.print("Command: ");
  //Serial.println(curCmd);

  switch (curCmd)
  {
    case cmdBrightness:  Serial.println("setBrightness"); setBrightness(); break;
    case cmdFrame: Serial.println("drawFrame"); drawFrame(); break;
    case cmdRow: Serial.println("UpdateRow not implemented in Firmware."); break;
    case cmdColum: Serial.println("UpdateColum not implemented in Firmware."); break;
    case cmdPixel: Serial.println("drawPixel"); drawPixel(); break;
    case cmdSave: Serial.println("SaveFrame not implemented in Firmware."); break;
    default: Serial.println("Error: Unknown Command!"); break;
  }
}


void loop()
{
  if (Serial.available() > 0)
  {
    char newByte = Serial.read();
    if (newByte != '\n')
    {
      buffer += (char)newByte;
      x++;
    }
    else
    {
      Serial.println("The buffer: " + buffer);
      analyseBuffer();
      buffer = "";
    }

  }
}
