#include <Keyboard.h>
#include <Adafruit_NeoPixel.h>

// LEDS
#define LED_PIN 6
#define LED_COUNT 1
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// ULTRASONIC
#define TRIG_PIN 9
#define ECHO_PIN 10
long duration;
int distance;
int prevDistance;

// DETECTION
const int threshSum = 100;
int stateChangeCumSum;
bool sinnerPresent;


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  strip.begin();
  strip.show();
  strip.setBrightness(255);

  // ULTRASONIC
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);

  // DETECTION
  stateChangeCumSum = 0;
  sinnerPresent = false;
}


void loop() {
  distance = computeDistance();

  // someone is probably close but wearing a shirt that doesn't reflect sound
  // as this is the max value... but also don't count single instances of max val
  if (distance > 1180) {
    if ((prevDistance > 1180) && sinnerPresent) {
      // ...so if they were detected earlier, don't count it as a change
      stateChangeCumSum = 0;
    } else {
      // ...but if no one is present, should probably count it towards sinner detection
      stateChangeCumSum++;
    }
  }
  // someone seems to be close...
  else if (distance < 75) {
    if (sinnerPresent) {
      // ...so everything is as it should be -> clear cumsum
      stateChangeCumSum = 0;
    } else {
      // ...someone might have stepped up -> increment cumsum
      stateChangeCumSum++;
    }

  // no one seems to be close...
  } else {
    if (!sinnerPresent) {
      // ...so everything is as it should be -> clear cumsum
      stateChangeCumSum = 0;
    } else {
      // ...they might have left -> increment cumsum
      stateChangeCumSum++;
    }
  }

  Serial.print(distance);
  Serial.print("  ");
  Serial.println(stateChangeCumSum);

  // enough samples indicate that the sinner either stepped up or left
  if (stateChangeCumSum >= threshSum) {
    sinnerPresent = !sinnerPresent;
    stateChangeCumSum = 0;

    // Send keystroke
    if (sinnerPresent) {
      Keyboard.print("l");
    } else {
      Keyboard.print("s");
    }
  }

  // indicate with color what state we're in
  ledColor();

  // save current distance to compare
  prevDistance = distance;
}


void ledColor() {
  strip.clear();
  if (sinnerPresent) {
    strip.setPixelColor(0, strip.Color(0, 200, 0));  
  } else {
    strip.setPixelColor(0, strip.Color(200, 0, 0));
  }
  strip.show();
}


int computeDistance() {
  // Clears the trigPin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(ECHO_PIN, HIGH);
  // Calculating the distance
  distance = duration*0.034/2;
  return distance;
}
