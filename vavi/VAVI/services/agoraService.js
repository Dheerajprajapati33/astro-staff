import { AGORA_APP_ID } from "../constants/AgoraConfig";

let Agora = null;
try {
  Agora = require("react-native-agora");
} catch (e) {
  console.warn("react-native-agora is not available. Using web/Expo Go stubs.");
}

const dummy = () => {};
const mockEngine = {
  initialize: dummy,
  setChannelProfile: dummy,
  setClientRole: dummy,
  enableAudio: dummy,
  joinChannel: async () => {},
  leaveChannel: async () => {},
  release: dummy,
};

const createAgoraRtcEngine = Agora?.createAgoraRtcEngine || (() => mockEngine);
export const ChannelProfileType = Agora?.ChannelProfileType || {
  ChannelProfileCommunication: 0,
  ChannelProfileLiveBroadcasting: 1,
};
export const ClientRoleType = Agora?.ClientRoleType || {
  ClientRoleBroadcaster: 1,
  ClientRoleAudience: 2,
};

let engine;

export const initAgora = async () => {
  engine = createAgoraRtcEngine();

  engine.initialize({
    appId: AGORA_APP_ID,
  });

  engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);

  engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

  engine.enableAudio();
};

export const joinAudioCall = async (channelName, token, uid) => {
  if (!engine) {
    await initAgora();
  }

  await engine.joinChannel(token, channelName, uid, {});
};

export const leaveAudioCall = async () => {
  if (engine) {
    await engine.leaveChannel();

    engine.release();

    engine = null;
  }
};
