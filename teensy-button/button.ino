#include <Adafruit_NeoPixel.h>
#include <Bounce.h>

#define BUTTON_PIN 7
Bounce button = Bounce(BUTTON_PIN, 100);

#define LED_PIN 17
#define LED_COUNT 1
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_RGB + NEO_KHZ800);

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  strip.begin();
  strip.clear();
}

byte previousButtonState = HIGH;

void loop() {
  if (button.update()) {
    if (button.fallingEdge()) {  // button down
      strip.setPixelColor(0, strip.Color(0, 200, 0));
      Keyboard.print("l");
    } else if (button.risingEdge()) {  // button up
      strip.setPixelColor(0, strip.Color(100, 0, 0));
      Keyboard.print("s");
    }
  }
  strip.show();
}
