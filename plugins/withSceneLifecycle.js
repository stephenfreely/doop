const { withInfoPlist, withAppDelegate } = require("@expo/config-plugins");

// iOS 27 traps at launch if the app only implements the legacy AppDelegate-only
// lifecycle (see expo/ios/AppDelegates/ExpoAppSceneDelegate.swift). This plugin
// wires the prebuild-generated AppDelegate.swift up to Expo's scene delegate so
// the app adopts the scene-based lifecycle UIKit now requires.
const SCENE_DELEGATE_CLASS_NAME = "EXExpoAppSceneDelegate";

const CLASS_DECL = "class AppDelegate: ExpoAppDelegate {";
const CLASS_DECL_WITH_PROVIDER =
  "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {";

const MANUAL_WINDOW_BLOCK = `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif
`;

// The scene delegate now creates the window and starts React Native once UIKit
// connects a scene, so the app delegate must only prepare the factory here.
const MANUAL_WINDOW_BLOCK_REPLACEMENT = "";

function withSceneLifecycleInfoPlist(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: SCENE_DELEGATE_CLASS_NAME,
          },
        ],
      },
    };
    return config;
  });
}

function withSceneLifecycleAppDelegate(config) {
  return withAppDelegate(config, (config) => {
    const { modResults } = config;
    if (modResults.language !== "swift") {
      throw new Error(
        "withSceneLifecycle expects a Swift AppDelegate.swift from `expo prebuild`; " +
          `found language "${modResults.language}". Update this plugin to match.`
      );
    }

    let contents = modResults.contents;

    if (contents.includes(CLASS_DECL_WITH_PROVIDER)) {
      // Already patched (e.g. re-running prebuild without --clean).
      return config;
    }

    if (!contents.includes(CLASS_DECL)) {
      throw new Error(
        "withSceneLifecycle couldn't find the expected `AppDelegate: ExpoAppDelegate` " +
          "declaration in the generated AppDelegate.swift. The prebuild template likely " +
          "changed; update plugins/withSceneLifecycle.js to match the new shape."
      );
    }
    if (!contents.includes(MANUAL_WINDOW_BLOCK)) {
      throw new Error(
        "withSceneLifecycle couldn't find the expected manual window/startReactNative " +
          "block in the generated AppDelegate.swift. The prebuild template likely changed; " +
          "update plugins/withSceneLifecycle.js to match the new shape."
      );
    }

    contents = contents.replace(CLASS_DECL, CLASS_DECL_WITH_PROVIDER);
    contents = contents.replace(
      MANUAL_WINDOW_BLOCK,
      MANUAL_WINDOW_BLOCK_REPLACEMENT
    );

    modResults.contents = contents;
    return config;
  });
}

function withSceneLifecycle(config) {
  config = withSceneLifecycleInfoPlist(config);
  config = withSceneLifecycleAppDelegate(config);
  return config;
}

module.exports = withSceneLifecycle;
