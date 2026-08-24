export const ChannelProfileType = {
  ChannelProfileCommunication: 0,
  ChannelProfileLiveBroadcasting: 1,
};

export const ClientRoleType = {
  ClientRoleBroadcaster: 1,
  ClientRoleAudience: 2,
};

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

export const createAgoraRtcEngine = () => mockEngine;

export default {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
};
