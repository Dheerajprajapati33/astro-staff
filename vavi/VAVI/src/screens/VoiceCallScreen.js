import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { io } from 'socket.io-client';

import { AGORA_APP_ID } from '../../constants/AgoraConfig';
import { SOCKET_URL } from '../../constants/SocketConfig';

// Safe Agora loader for dev/web/Expo Go resilience
let createAgoraRtcEngine = null;
let ChannelProfileType = { ChannelProfileCommunication: 0 };
let ClientRoleType = { ClientRoleBroadcaster: 1, ClientRoleAudience: 2 };

try {
  const agoraModule = require('react-native-agora');
  createAgoraRtcEngine = agoraModule.createAgoraRtcEngine;
  if (agoraModule.ChannelProfileType) ChannelProfileType = agoraModule.ChannelProfileType;
  if (agoraModule.ClientRoleType) ClientRoleType = agoraModule.ClientRoleType;
} catch (_e) {
  console.log('[VoiceCallScreen] react-native-agora native module not loaded; using web/mock fallback.');
}

const DEFAULT_AGORA_APP_ID = AGORA_APP_ID || 'cd9277ec7c29449d97c062a0faf09c5b';
const BACKEND_URL = SOCKET_URL || 'http://localhost:5000';

export default function VoiceCallScreen({ route, navigation, searchParams }) {
  // Support both React Navigation (route.params) and Expo Router (searchParams / useLocalSearchParams)
  const params = route?.params || searchParams || {};

  const {
    consultationId,
    role = 'user', // 'user' (caller) or 'astrologer' (receiver)
    agoraToken,
    channelName,
    userId,
    astrologerName = 'Astrologer',
    maxDurationSeconds = 1800,
  } = params;

  // Component State
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [peerConnected, setPeerConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  // References
  const agoraEngine = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const elapsedSecondsRef = useRef(0);
  const isJoinedRef = useRef(false);

  // Request Android Microphone Permission
  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'VAVI needs microphone access for voice consultation calls.',
            buttonPositive: 'Allow',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    initCall();

    return () => {
      cleanup();
    };
  }, []);

  const initCall = async () => {
    const hasPerm = await checkPermissions();
    if (!hasPerm) {
      Alert.alert('Permission Denied', 'Microphone permission is required for voice calls.');
      if (navigation?.goBack) navigation.goBack();
      return;
    }

    // 1. Initialize Socket.io Connection
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('⚡ Socket connected:', socketRef.current.id);
      // Join consultation room
      if (consultationId) {
        socketRef.current.emit('join_consultation', {
          consultationId,
          userId,
          role,
        });
      }
    });

    // Listen for Call Started event
    socketRef.current.on('call_started', (data) => {
      console.log('📞 Event: call_started', data);
      setCallStatus('Ongoing Call');
      setIsCallActive(true);
      startTimer();
    });

    // Listen for Call Ended event
    socketRef.current.on('call_ended', (data) => {
      console.log('🔴 Event: call_ended', data);
      const msg = data?.userMessage || 'Call ended successfully.';
      const mins = data?.consultation?.duration || Math.max(1, Math.ceil(elapsedSecondsRef.current / 60));
      const amt = data?.consultation?.amount || 0;

      Alert.alert(
        'Call Summary',
        `${msg}\n\n⏱️ Duration: ${mins} min(s)\n💰 Total Deducted: ₹${amt}`,
        [{ text: 'OK', onPress: () => { if (navigation?.goBack) navigation.goBack(); } }]
      );
      cleanup();
    });

    socketRef.current.on('call_error', (data) => {
      Alert.alert('Call Error', data?.message || 'An error occurred during the call.');
    });

    // 2. Initialize Agora RTC Audio Engine
    try {
      if (createAgoraRtcEngine && !isJoinedRef.current) {
        isJoinedRef.current = true;
        agoraEngine.current = createAgoraRtcEngine();
        
        agoraEngine.current.initialize({
          appId: DEFAULT_AGORA_APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileCommunication || 0,
        });

        if (agoraEngine.current.setChannelProfile) {
          agoraEngine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication || 0);
        }
        if (agoraEngine.current.enableAudio) {
          agoraEngine.current.enableAudio();
        }
        if (agoraEngine.current.setDefaultAudioRouteToSpeakerphone) {
          agoraEngine.current.setDefaultAudioRouteToSpeakerphone(true);
        }
        if (agoraEngine.current.setEnableSpeakerphone) {
          agoraEngine.current.setEnableSpeakerphone(true);
        }

        // Register Agora Event Handlers
        if (agoraEngine.current.registerEventHandler) {
          agoraEngine.current.registerEventHandler({
            onUserJoined: (connection, uid) => {
              console.log(`👤 Remote peer joined voice call: UID ${uid}`);
              setPeerConnected(true);
              setCallStatus('Connected (Voice Streaming)');
            },
            onUserOffline: (connection, uid) => {
              console.log(`Peer offline: UID ${uid}`);
              setPeerConnected(false);
              setCallStatus('Peer Reconnecting...');
            },
            onTokenPrivilegeWillExpire: (connection, token) => {
              console.log('⚠️ Agora token expiring soon. Refreshing...');
            },
            onError: (err, msg) => {
              console.log('Agora RTC Error:', err, msg);
            },
          });
        }

        // Join Channel (User = UID 1, Astrologer = UID 2)
        const myUid = role === 'user' ? 1 : 2;
        if (agoraToken && channelName) {
          agoraEngine.current.joinChannel(agoraToken, channelName, myUid, {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster || 1,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
          });
        }

        setCallStatus(role === 'astrologer' ? 'Waiting for Client...' : 'Ringing...');
      }
    } catch (err) {
      console.error('Agora RTC Init Error:', err);
    }
  };

  // Call Timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;
      setElapsedSeconds(elapsedSecondsRef.current);
    }, 1000);
  };

  // Astrologer Accept Call Action
  const handleAcceptCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('astrologer_accept_call', { consultationId });
      setCallStatus('Ongoing Call');
      setIsCallActive(true);
      startTimer();
    }
  };

  // Mute / Unmute Microphone
  const toggleMute = () => {
    if (agoraEngine.current?.muteLocalAudioStream) {
      agoraEngine.current.muteLocalAudioStream(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  // Speakerphone Toggle
  const toggleSpeaker = () => {
    if (agoraEngine.current?.setEnableSpeakerphone) {
      agoraEngine.current.setEnableSpeakerphone(!isSpeaker);
    }
    setIsSpeaker(!isSpeaker);
  };

  // End Call Action
  const handleEndCall = () => {
    if (socketRef.current && consultationId) {
      const reason = role === 'astrologer' ? 'astrologer_hung_up' : 'user_hung_up';
      socketRef.current.emit('client_end_call', {
        consultationId,
        reason,
      });
    }
    cleanup();
    if (navigation?.goBack) navigation.goBack();
  };

  // Cleanup resources
  const cleanup = () => {
    isJoinedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    if (agoraEngine.current) {
      try {
        if (agoraEngine.current.leaveChannel) agoraEngine.current.leaveChannel();
        if (agoraEngine.current.release) agoraEngine.current.release();
      } catch (e) {
        console.log('Agora cleanup notice:', e);
      }
      agoraEngine.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const formatTimer = (secs) => {
    if (secs == null || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const remainingSeconds = Math.max(0, Number(maxDurationSeconds) - elapsedSeconds);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.callerName}>{astrologerName}</Text>
        <Text style={styles.callType}>VAVI High Definition Voice Consultation</Text>
        <Text style={styles.statusBadge}>{callStatus}</Text>
      </View>

      {/* Timer & Balance Indicator */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
        <Text style={styles.remainingText}>
          ⏳ Max Balance Time Remaining: {formatTimer(remainingSeconds)}
        </Text>
        {remainingSeconds <= 60 && isCallActive && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Less than 1 minute remaining! Call will auto-end when balance is exhausted.
            </Text>
          </View>
        )}
      </View>

      {/* Action Controls */}
      <View style={styles.controlsContainer}>
        {/* If Astrologer and call is not active yet, show Accept button */}
        {role === 'astrologer' && !isCallActive && (
          <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptCall}>
            <Text style={styles.acceptButtonText}>📞 Accept Consultation</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsRow}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[styles.circleButton, isMuted && styles.activeButton]}
            onPress={toggleMute}
          >
            <Text style={styles.buttonIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
            <Text style={styles.buttonLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity
            style={[styles.circleButton, isSpeaker && styles.activeButton]}
            onPress={toggleSpeaker}
          >
            <Text style={styles.buttonIcon}>{isSpeaker ? '🔊' : '📱'}</Text>
            <Text style={styles.buttonLabel}>{isSpeaker ? 'Speaker' : 'Earpiece'}</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Text style={styles.buttonIcon}>🔴</Text>
            <Text style={styles.endCallLabel}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  callerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  callType: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 14,
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38bdf8',
    backgroundColor: '#1e293b',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ade80',
    letterSpacing: 2,
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  warningBanner: {
    backgroundColor: '#7c2d12',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    marginHorizontal: 15,
  },
  warningText: {
    color: '#fdba74',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 25,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeButton: {
    backgroundColor: '#d97706',
    borderColor: '#f59e0b',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  buttonLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  endCallButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f87171',
  },
  endCallLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
