#include "esp_camera.h"
#include <WiFi.h>

#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

const char* ssid = "anim53";
const char* password = "arivan123";

WiFiServer server(4210);
WiFiClient client;

int totalFrames = 0;

void sendFrameTCP(int index) {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Frame capture failed");
    return;
  }

  uint32_t len = fb->len;
  client.write((uint8_t*)&index, 4); // 4-byte frame index
  client.write((uint8_t*)&len, 4);   // 4-byte frame length
  client.write(fb->buf, len);        // Frame data
  esp_camera_fb_return(fb);

  Serial.printf("📤 Sent frame %d (%d bytes)\n", index, len);
}

bool waitForAck(int index) {
  unsigned long start = millis();
  String expected = "ACK:" + String(index);

  while (millis() - start < 5000) {
    if (client.available()) {
      String received = client.readStringUntil('\n');
      received.trim();
      if (received == expected) {
        Serial.printf("✅ ACK received for frame %d\n", index);
        return true;
      }
    }
    delay(10);
  }
  return false;
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");
  Serial.println("📶 IP address: " + WiFi.localIP().toString());

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000;
  config.pixel_format = PIXFORMAT_RGB565;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.grab_mode = CAMERA_GRAB_LATEST;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("❌ Camera init failed");
    return;
  }

  server.begin();
  Serial.println("🚪 TCP Server started");
}

void loop() {
  if (!client || !client.connected()) {
    client = server.accept();
    if (client) Serial.println("🔌 Client connected");
  }

  if (client.available()) {
    String cmd = client.readStringUntil('\n');
    cmd.trim();

    if (cmd.startsWith("FRAMES:")) {
      totalFrames = cmd.substring(7).toInt();
      Serial.printf("📷 Capturing %d frames...\n", totalFrames);

      for (int i = 0; i < totalFrames; i++) {
        sendFrameTCP(i);
        if (!waitForAck(i)) {
          Serial.printf("⚠️ No ACK for frame %d\n", i);
        }
      }

      client.println("DONE");
      Serial.println("✅ All frames sent");
    }
  }
}
