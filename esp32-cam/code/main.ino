#include "esp_camera.h"
#include "FS.h"
#include "SD_MMC.h"
#include <WiFi.h>
#include <HTTPClient.h>

// Pin Definitions
#define BLUE_LED 16       // External blue LED
#define RED_LED 33        // Internal LED (inverted logic)
#define VIB_PIN 1         // Vibration Sensor

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SYSTEM_IP/upload";  // Change this

void startCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;
  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;
  config.pin_sscb_sda = 26;
  config.pin_sscb_scl = 27;
  config.pin_pwdn = 32;
  config.pin_reset = -1;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_SVGA; // 800x600 ~ 540p
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed: 0x%x\n", err);
    return;
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(VIB_PIN, INPUT);

  digitalWrite(BLUE_LED, HIGH); // Power ON indicator
  digitalWrite(RED_LED, HIGH);  // Turn OFF internal LED (inverted logic)
  delay(2000);

  Serial.println("Initializing camera...");
  startCamera();

  Serial.println("Mounting SD card...");
  if (!SD_MMC.begin()) {
    Serial.println("SD Card Mount Failed");
    return;
  }
  Serial.println("SD Card initialized.");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected.");
}

bool isVibrationStable() {
  Serial.println("Checking vibration stability...");
  int stableCount = 0;
  for (int i = 0; i < 50; i++) {
    int val = digitalRead(VIB_PIN);
    if (val == LOW) stableCount++;
    delay(100);
  }
  bool stable = stableCount > 40;
  Serial.println(stable ? "Vibration is stable." : "Vibration is unstable.");
  return stable;
}

void recordAndSend() {
  Serial.println("Recording started.");
  digitalWrite(RED_LED, LOW); // Turn ON internal LED (inverted)
  
  File videoFile = SD_MMC.open("/video.jpg", FILE_WRITE);
  if (!videoFile) {
    Serial.println("Failed to open file.");
    return;
  }

  for (int i = 0; i < 30; i++) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      continue;
    }
    videoFile.write(fb->buf, fb->len);
    esp_camera_fb_return(fb);
    delay(1000); // 1-second interval
    Serial.printf("Captured frame %d\n", i + 1);
  }

  videoFile.close();
  digitalWrite(RED_LED, HIGH); // Turn OFF internal LED
  Serial.println("Recording complete.");

  Serial.println("Sending file to server...");
  blinkLEDs(5);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/octet-stream");

    File file = SD_MMC.open("/video.jpg");
    if (!file) {
      Serial.println("Failed to open file for sending");
      return;
    }

    int httpResponseCode = http.sendRequest("POST", &file, file.size());
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    file.close();
    http.end();
  }

  waitForDeleteRequest();
}

void waitForDeleteRequest() {
  Serial.println("Waiting for delete trigger from system...");
  // Simulate wait (replace with actual polling or server request)
  delay(10000);
  SD_MMC.remove("/video.jpg");
  Serial.println("Video deleted after confirmation.");
}

void blinkLEDs(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(RED_LED, LOW);   // ON
    digitalWrite(BLUE_LED, LOW);  // ON
    delay(300);
    digitalWrite(RED_LED, HIGH);  // OFF
    digitalWrite(BLUE_LED, HIGH); // OFF
    delay(300);
  }
}

void loop() {
  Serial.println("System idle. Checking every 2 minutes...");
  if (isVibrationStable()) {
    recordAndSend();
  } else {
    Serial.println("Skipped: Vibration not stable.");
  }
  delay(120000); // Wait 2 minutes before next cycle
}
