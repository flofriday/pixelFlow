/*
* This file is just a Prototype Firmware for pixelflow. It will only work on the
* Arduino Mega since the Arduino Uno has to little RAM (even if it compiles on
* the Uno).
* Unfortently the Performace is not the best so it's recommended to wait one
* Second between two frames.
*/

/*
* Configure the Prameters below to fit your application.
*/
#define MATRIX_DATA_PIN 6       // The Pin where the matrix is connected to.
#define MATRIX_SNAKE_PATTERN 1  // Set 1 if the Matrix has a snake-pattern.
#define MAX_BRIGHTNESS 50       // The maximum brightness the firmware allow.



#include <stdint.h>
#include <string.h>
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel strip = Adafruit_NeoPixel(256, MATRIX_DATA_PIN, NEO_GRB + NEO_KHZ800);


void setup()
{
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  Serial.begin(250000);
  strip.setBrightness(MAX_BRIGHTNESS);
  strip.show();
}


#define cmdBrightness '0'
#define cmdFrame '1'
#define cmdRow '2'
#define cmdColum '3'
#define cmdPixel '4'
#define cmdSave '5'
#define cmdBrightnessLength 4
#define cmdFrameLength 1537
#define cmdRowLength
#define cmdColumLength
#define cmdPixelLength 9
#define cmdSaveLength


char buffer[2000] = "";
uint16_t bufferLength = 0;

void setBrightness()
{
  // Checking if the command has the right length
  if (bufferLength != cmdBrightnessLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: updateBrightness wrong length.");
    return;
  }

  uint16_t brightness = (buffer[1] - '0') * 100;
  brightness += (buffer[2] - '0') * 10;
  brightness += buffer[3] - '0';

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
  if (bufferLength != cmdFrameLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: drawFrame wrong length.");
    return;
  }

  uint8_t curPixel = 0;
  uint8_t curColum = 0;
  uint8_t curRow = 0;
  uint8_t red = 0;
  uint8_t green = 0;
  uint8_t blue = 0;
  uint16_t offset = 1;
  char strRed[3] = "";
  char strGreen[3] = "";
  char strBlue[3] = "";

  for (uint8_t r = 0; r < 16; r++)
  {
    for (uint8_t c = 0; c < 16; c++)
    {
      //#if MATRIX_SNAKE_PATTERN == 1
      curColum = c;
      if (r % 2 == 1) curColum = 15 - curColum;
      //#endif

      curPixel = (r << 4) + curColum; // shift by 4 is like multiply by 16 but faster

      strRed[0] = buffer[offset + 0];
      strRed[1] = buffer[offset + 1];
      strGreen[0] = buffer[offset + 2];
      strGreen[1] = buffer[offset + 3];
      strBlue[0] = buffer[offset + 4];
      strBlue[1] = buffer[offset + 5];
      offset += 6;

      red = (int)strtol(strRed, NULL, 16);
      green = (int)strtol(strGreen, NULL, 16);
      blue = (int)strtol(strBlue, NULL, 16);

      strip.setPixelColor(curPixel, red, green, blue);
    }
  }

  strip.show();
}


/*
* This function simply reads the buffer and writes the selected Pixel.
* The first Byte is the row the second the colum and the rest is the color in
* hex.
*/
void drawPixel()
{
  // Checking if the command has the right length
  if (bufferLength != cmdPixelLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: drawPixel wrong length.");
    return;
  }

  // Declare all variables needed for this function
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

  strRow[0] =  buffer[1];
  strColum[0] =  buffer[2];

  row = (uint8_t)strtol(strRow, NULL, 16);
  colum = (uint8_t)strtol(strColum, NULL, 16);

  #if MATRIX_SNAKE_PATTERN == 1
  // fix the snake pattern of the leds on the matrix
  if (row % 2 == 1)
  {
    colum = 15 - colum;
  }
  #endif

  stripPixel = (row << 4) + colum;  // shift by 4 is like multiply by 16 but faster

  strRed[0] = buffer[3];
  strRed[1] = buffer[4];
  strGreen[0] = buffer[5];
  strGreen[1] = buffer[6];
  strBlue[0] = buffer[7];
  strBlue[1] = buffer[8];

  red = (uint8_t)strtol(strRed, NULL, 16);
  green = (uint8_t)strtol(strGreen, NULL, 16);
  blue = (uint8_t)strtol(strBlue, NULL, 16);

  strip.setPixelColor(stripPixel, red, green, blue);
  strip.show();
}


/*
* This function reads the first byte and decides which command to execute
*/
void analyseBuffer()
{
  switch (buffer[0])
  {
    case cmdBrightness: setBrightness(); break;
    case cmdFrame: drawFrame(); break;
    //case cmdRow: break;
    //case cmdColum: break;
    case cmdPixel: drawPixel(); break;
    //case cmdSave: break;
    default: Serial.println("Error: Unknown Command!"); break;
  }
}


/*
* This is the root function of the firmware and will be called for ever.
*/
void loop()
{
  // Declare all variables needed for this function
  char newByte;

  // Check if there is serial data available
  if (Serial.available() > 0)
  {
    newByte = Serial.read();
    if (newByte != '\n')
    {
      // Add the current character to the buffer and increase the position
      buffer[bufferLength++] = newByte;
    }
    else
    {
      // Analyse the Buffer and reset it afterwards
      analyseBuffer();
      bufferLength = 0;
      memset(buffer, 0, sizeof(buffer));
    }

  }
}
