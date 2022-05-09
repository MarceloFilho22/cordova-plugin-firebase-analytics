const path = require('path');
const fs = require('fs');
const plist = require('plist');
const { ConfigParser } = require('cordova-common');
const { config } = require('process');

module.exports = function (context) {
    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var configXML = path.join(projectRoot, 'config.xml');
    var configParser = new ConfigParser(configXML);
    var enableAppTracking = configParser.getPlatformPreference("EnableAppTrackingTransparencyPrompt", "ios");

    console.log("ENABLE_TRACKING" + enableAppTracking);

    var appNamePath = path.join(projectRoot, 'config.xml');
    var appNameParser = new ConfigParser(appNamePath);
    var appName = appNameParser.name();
    var infoPlistPath = path.join(projectRoot, 'platforms/ios/' + appName + '/'+ appName +'-info.plist');
    var obj = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));

    if(enableAppTracking == "true"){
        if(userTrackingDescription != ""){
            var userTrackingDescription = configParser.getPlatformPreference("USER_TRACKING_DESCRIPTION_IOS", "ios");
            obj['NSUserTrackingUsageDescription'] = userTrackingDescription;
        }
    }
    else{
        delete obj['NSUserTrackingUsageDescription'];
    }
    fs.writeFileSync(infoPlistPath, plist.build(obj));
};
