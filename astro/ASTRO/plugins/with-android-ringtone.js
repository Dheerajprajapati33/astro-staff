const fs = require("node:fs");
const path = require("node:path");
const { withDangerousMod } = require("@expo/config-plugins");

module.exports = function withAndroidRingtone(config) {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const source = path.join(
        modConfig.modRequest.projectRoot,
        "assets",
        "images",
        "ringtone.mp3",
      );
      const rawDirectory = path.join(
        modConfig.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "raw",
      );

      if (!fs.existsSync(source)) {
        throw new Error(`Android notification ringtone source is missing: ${source}`);
      }

      fs.mkdirSync(rawDirectory, { recursive: true });
      fs.copyFileSync(source, path.join(rawDirectory, "custom_ringtone.mp3"));
      return modConfig;
    },
  ]);
};
