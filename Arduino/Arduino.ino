/*
* Author: flofriday
* Date: 04.09.2017
* License: MIT
*
* This file is the code for the Arduino.
* Tested only on the Arduino Mega. Other Arduinos may work.
*/


/*
* Configure the Prameters below to fit your application.
*/
#define MATRIX_DATA_PIN 6       // The Pin where the matrix is connected to.
#define MATRIX_SNAKE_PATTERN 1  // Set 1 if the Matrix has a snake-pattern.
#define MAX_BRIGHTNESS 64       // The maximum brightness the firmware allow.
#define BAUDRATE 250000         // Set the Baudrate (higher is better)


/*
* Include all headerfiles.
*/
#include <stdint.h>
#include <string.h>
#include <Adafruit_NeoPixel.h>


/*
* Define the LED Matrix.
*/
Adafruit_NeoPixel strip = Adafruit_NeoPixel(256, MATRIX_DATA_PIN, NEO_GRB + NEO_KHZ800);
uint8_t matrixBrightness = MAX_BRIGHTNESS;

/*
* Define the pixel list.
* In this list the raw colors are saved without the brightness
*/
uint8_t pixelList[256][3];

/*
* Setup the Matrix and the serial communication.
*/
void setup()
{
  strip.begin();
  strip.setBrightness(255); // Set the strip to the max brightness possible, because we have our own brightness logic
  strip.show();
  Serial.begin(BAUDRATE);
}


/*
* Some constants wich defines the communication.
*/
#define cmdBrightness '1'
#define cmdPixel '2'
#define cmdFrame '3'
#define cmdSave '4'
#define cmdBrightnessLength 4
#define cmdFrameLength 1537
#define cmdPixelLength 9
#define cmdSaveLength // not implemented yet


/*
* All variables needed to work with the buffer.
* The buffer is a space where all incomming serial bytes are saved.
*/
#define BUFFER_SIZE 1600
char buffer[BUFFER_SIZE] = "";
uint16_t bufferLength = 0;



/*
* This function applys the brightness to the colors given as input
* and returns the output.
*/
uint8_t * applyBrightness(uint8_t input[], uint8_t output[]) {
  // Convert all input variables to floats so the program can claculate with floating numbers.
	float endValue = 255;
	float endResult[3];
	float result;


	// Making a loop because the whole code below has to be done with every color.
	for (uint8_t i = 0; i < 3; i++)
	{
		// Making the colors to floats
		endResult[i] = input[i];

		// Calculate the result
    result = (float)matrixBrightness * ((float) input[i] / 255.0);

		// Creating the output array
		output[i] = (uint8_t) result;
	}
}


/*
* This function is a wrapper for strip.show()
* However, it also adds the brightness because the standart brightness function
* of the neopixel libary interpolates soo poorly.
*/
void matrixShow() {

  // copy the pixelList into the strip and apply the brightness
  for (uint16_t i = 0; i < 256; i++)
  {
    uint8_t result[3];
    applyBrightness(pixelList[i], result);
    strip.setPixelColor(i, result[0], result[1], result[2]);
  }

  // show the strip
  strip.show();
}


/*
* This function sets the brightness of the whole Matrix.
*/
void setBrightness()
{
  // Checking if the command has the right length
  if (bufferLength != cmdBrightnessLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: Command \"setBrightness\" had the wrong length!");
    return;
  }

  // convert the buffer to an int.
  uint16_t brightness = (buffer[1] - '0') * 100;
  brightness += (buffer[2] - '0') * 10;
  brightness += buffer[3] - '0';

  //check if the value is too big
  if (brightness < 1 || brightness > MAX_BRIGHTNESS)
  {
    // The command was too long or too short
    Serial.println("ERROR: Command \"setBrightness\" had the wrong length!");
    return;
  }

  // The command was correct so set the brightness of the strip
  matrixBrightness = brightness;
  matrixShow();
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
    Serial.println("ERROR: Command \"drawPixel\" had the wrong length!");
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

  // Create the strings for the row & colum
  strRow[0] =  buffer[1];
  strColum[0] =  buffer[2];

  // Convert the strings to ints
  row = (uint8_t)strtol(strRow, NULL, 16);
  colum = (uint8_t)strtol(strColum, NULL, 16);

  // Fix the snake pattern of the leds on the matrix if needed
  #if MATRIX_SNAKE_PATTERN == 1
  if (row % 2 == 1)
  {
    colum = 15 - colum;
  }
  #endif

  // Calculate the current pixel
  stripPixel = (row << 4) + colum;  // shift by 4 is like multiply by 16 but faster

  // Create the strings for the color
  strRed[0] = buffer[3];
  strRed[1] = buffer[4];
  strGreen[0] = buffer[5];
  strGreen[1] = buffer[6];
  strBlue[0] = buffer[7];
  strBlue[1] = buffer[8];

  // Convert the strings to ints
  red = (uint8_t)strtol(strRed, NULL, 16);
  green = (uint8_t)strtol(strGreen, NULL, 16);
  blue = (uint8_t)strtol(strBlue, NULL, 16);

  // Set the pixel color and update the matrix.
  pixelList[stripPixel][0] = red;
  pixelList[stripPixel][1] = green;
  pixelList[stripPixel][2] = blue;
  matrixShow();
}


/*
* This function reads the hex color values from the buffer and writes the frame
* to the matrix.
*/
void drawFrame()
{
  // Checking if the command has the right length
  if (bufferLength != cmdFrameLength)
  {
    // The command was too long or too short
    Serial.println("ERROR: Command \"drawFrame\" had the wrong length!");
    return;
  }

  // Declare all variables needed for this function
  uint8_t curPixel = 0;
  uint8_t curColum = 0;
  uint8_t red = 0;
  uint8_t green = 0;
  uint8_t blue = 0;
  uint16_t offset = 1;
  char strRed[3] = "";
  char strGreen[3] = "";
  char strBlue[3] = "";

  // Loop through all 256 pixels (each 6 Byte)
  for (uint8_t r = 0; r < 16; r++)
  {
    for (uint8_t c = 0; c < 16; c++)
    {
      curColum = c;

      // Fix the snake pattern if needed
      #if MATRIX_SNAKE_PATTERN == 1
      if (r % 2 == 1) curColum = 15 - curColum;
      #endif

      // calculate the current pixel
      curPixel = (r << 4) + curColum; // shift by 4 is like multiply by 16 but faster

      // Set the strings for the colors
      strRed[0] = buffer[offset + 0];
      strRed[1] = buffer[offset + 1];
      strGreen[0] = buffer[offset + 2];
      strGreen[1] = buffer[offset + 3];
      strBlue[0] = buffer[offset + 4];
      strBlue[1] = buffer[offset + 5];
      offset += 6;

      // convert the strings to numbers
      red = (int)strtol(strRed, NULL, 16);
      green = (int)strtol(strGreen, NULL, 16);
      blue = (int)strtol(strBlue, NULL, 16);

      // Set the current pixel
      pixelList[curPixel][0] = red;
      pixelList[curPixel][1] = green;
      pixelList[curPixel][2] =  blue;
    }
  }

  // Update the matrix
  matrixShow();
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
    case cmdPixel: drawPixel(); break;
    //case cmdSave: break; // Not implemented yet
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
      /*
      * Check the length of the buffer. If it is longer than the buffer itself
      * we must prevent a buffer-overflow. In that case we don't add the read
      * character to the buffer.
      */
      if (bufferLength < BUFFER_SIZE)
      {
        // Add the current character to the buffer and increase the position
        buffer[bufferLength++] = newByte;
      }
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
