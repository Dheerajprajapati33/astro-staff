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
  console.log('[CallScreen] react-native-agora native module not loaded; using web/mock fallback.');
}

const DEFAULT_AGORA_APP_ID = AGORA_APP_ID || 'cd9277ec7c29449d97c062a0faf09c5b';
const BACKEND_URL = SOCKET_URL || 'http://localhost:5000';

export default function CallScreen({ route, navigation, searchParams }) {
  const params = route?.params || searchParams || {};

  const {
    consultationId,
    role = 'user', // 'user' (caller) or 'astrologer' (receiver)
    agoraToken,
    channelName,
    userId,
    userName = 'Astrologer',
    maxDurationSeconds = 1800,
  } = params;

  const [callStatus, setCallStatus] = useState('Connecting...');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isCallOngoing, setIsCallOngoing] = useState(false);

  const agoraEngine = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const elapsedSecondsRef = useRef(0);
  const isJoinedRef = useRef(false);

  // 1. Android Runtime Permission Check
  const checkMicPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Microphone permission is required for voice calling.',
            buttonPositive: 'Allow',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setupCall();

    return () => {
      cleanup();
    };
  }, []);

  const setupCall = async () => {
    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required.');
      if (navigation?.goBack) navigation.goBack();
      return;
    }

    // A. Setup Socket.io
    socketRef.current = io(BACKEND_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('⚡ Socket connected:', socketRef.current.id);
      if (consultationId) {
        socketRef.current.emit('join_consultation', {
          consultationId,
          userId,
          role,
        });
      }
    });

    socketRef.current.on('call_started', (data) => {
      console.log('📞 Call started event:', data);
      setIsCallOngoing(true);
      setCallStatus('Ongoing Call');
      startTimer();
      joinAgora();
    });

    socketRef.current.on('call_ended', (data) => {
      console.log('🔴 Call ended event:', data);
      cleanup();
      const mins = data?.consultation?.duration || Math.max(1, Math.ceil(elapsedSecondsRef.current / 60));
      const amount = data?.consultation?.amount || 0;
      Alert.alert(
        'Call Ended',
        `${data?.userMessage || 'Call disconnected.'}\n\n⏱️ Duration: ${mins} min\n💰 Deducted: ₹${amount}`,
        [{ text: 'OK', onPress: () => { if (navigation?.goBack) navigation.goBack(); } }]
      );
    });

    // If caller, join Agora right away while ringing
    if (role === 'user') {
      joinAgora();
    }
  };

  // B. Setup Agora RTC Engine
  const joinAgora = async () => {
    try {
      if (createAgoraRtcEngine && !isJoinedRef.current) {
        isJoinedRef.current = true;
        agoraEngine.current = createAgoraRtcEngine();
        agoraEngine.current.initialize({ appId: DEFAULT_AGORA_APP_ID });

        if (agoraEngine.current.setChannelProfile) {
          agoraEngine.current.setChannelProfile(ChannelProfileType.ChannelProfileCommunication || 0);
        }
        if (agoraEngine.current.enableAudio) {
          agoraEngine.current.enableAudio();
        }
        if (agoraEngine.current.enableLocalAudio) {
          agoraEngine.current.enableLocalAudio(true);
        }
        if (agoraEngine.current.muteLocalAudioStream) {
          agoraEngine.current.muteLocalAudioStream(false);
        }
        if (agoraEngine.current.setEnableSpeakerphone) {
          agoraEngine.current.setEnableSpeakerphone(true);
        }

        if (agoraEngine.current.registerEventHandler) {
          agoraEngine.current.registerEventHandler({
            onJoinChannelSuccess: (connection, elapsed) => {
              console.log('✅ Joined Agora Channel:', connection.channelId);
              if (role === 'user') setCallStatus('Ringing...');
            },
            onUserJoined: (connection, uid) => {
              console.log('👤 Peer connected to voice:', uid);
              setCallStatus('Talking (Voice Active)');
            },
            onUserOffline: (connection, uid) => {
              console.log('Peer disconnected:', uid);
              setCallStatus('Peer Reconnecting...');
            },
            onError: (err, msg) => {
              console.error('❌ Agora Error:', err, msg);
            },
          });
        }

        // CRITICAL: UID must be Integer number: 1 for user, 2 for astrologer!
        const myUid = role === 'user' ? 1 : 2;

        if (agoraToken && channelName) {
          agoraEngine.current.joinChannel(agoraToken, channelName, myUid, {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster || 1,
          });
        }
      }
    } catch (err) {
      console.error('Agora join error:', err);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;
      setElapsedSeconds(elapsedSecondsRef.current);
    }, 1000);
  };

  const handleAccept = () => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('astrologer_accept_call', { consultationId });
    }
  };

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

  const toggleMute = () => {
    if (agoraEngine.current?.muteLocalAudioStream) {
      agoraEngine.current.muteLocalAudioStream(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    if (agoraEngine.current?.setEnableSpeakerphone) {
      agoraEngine.current.setEnableSpeakerphone(!isSpeaker);
    }
    setIsSpeaker(!isSpeaker);
  };

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

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.callerName}>{userName}</Text>
        <Text style={styles.statusBadge}>{callStatus}</Text>
      </View>

      {/* Call Timer Display */}
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
        <Text style={styles.remainingText}>
          ⏳ Wallet Time Left: {formatTimer(remainingSeconds)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {/* Astrologer Accept Button (Only shown to astrologer before call starts) */}
        {role === 'astrologer' && !isCallOngoing && (
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>📞 Accept Consultation</Text>
          </TouchableOpacity>
        )}

        <View style={styles.btnRow}>
          {/* Mute Button */}
          <TouchableOpacity style={[styles.btn, isMuted && styles.btnActive]} onPress={toggleMute}>
            <Text style={styles.btnIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
            <Text style={styles.btnText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity style={[styles.btn, isSpeaker && styles.btnActive]} onPress={toggleSpeaker}>
            <Text style={styles.btnIcon}>{isSpeaker ? '🔊' : '📱'}</Text>
            <Text style={styles.btnText}>{isSpeaker ? 'Speaker' : 'Ear'}</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endBtn} onPress={handleEndCall}>
            <Text style={styles.btnIcon}>🔴</Text>
            <Text style={styles.endText}>End</Text>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  statusBadge: {
    fontSize: 13,
    color: '#38bdf8',
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  timerBox: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#4ade80',
    letterSpacing: 2,
  },
  remainingText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  controls: {
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginBottom: 25,
  },
  acceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },
  btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnActive: {
    backgroundColor: '#d97706',
    borderColor: '#f59e0b',
  },
  btnIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  btnText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
  endBtn: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  endText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
