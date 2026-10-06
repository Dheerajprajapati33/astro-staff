import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

import { displayIncomingRequestNotification } from "./notifications";

setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  await displayIncomingRequestNotification(remoteMessage);
});
