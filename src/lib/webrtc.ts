import { supabase } from './supabase';

export interface WebRTCMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'ready' | 'leave' | 'peer-joined';
  data?: any;
  from: string;
  to?: string;
  roomCode: string;
}

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private roomCode: string;
  private userId: string;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onConnectionStateChangeCallback?: (state: string) => void;
  private signalChannel: any = null;
  private isInitiator: boolean = false;

  constructor(roomCode: string, userId: string) {
    this.roomCode = roomCode;
    this.userId = userId;
  }

  async initialize() {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'ice-candidate',
          data: event.candidate,
          from: this.userId,
          roomCode: this.roomCode,
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection && this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
      }
    };

    await this.setupSignaling();
  }

  async setupSignaling() {
    const channel = supabase.channel(`room:${this.roomCode}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel.on('broadcast', { event: 'webrtc-signal' }, async (payload) => {
      const message = payload.payload as WebRTCMessage;

      if (message.from === this.userId) return;

      try {
        switch (message.type) {
          case 'peer-joined':
            if (this.isInitiator) {
              await this.createOffer();
            }
            break;
          case 'offer':
            await this.handleOffer(message.data);
            break;
          case 'answer':
            await this.handleAnswer(message.data);
            break;
          case 'ice-candidate':
            await this.handleIceCandidate(message.data);
            break;
        }
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    });

    await channel.subscribe();
    this.signalChannel = channel;

    this.sendSignal({
      type: 'peer-joined',
      from: this.userId,
      roomCode: this.roomCode,
    });
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (this.peerConnection && this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!);
        });
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  setAsInitiator(isInitiator: boolean) {
    this.isInitiator = isInitiator;
  }

  async createOffer() {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.sendSignal({
      type: 'offer',
      data: offer,
      from: this.userId,
      roomCode: this.roomCode,
    });
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.sendSignal({
      type: 'answer',
      data: answer,
      from: this.userId,
      roomCode: this.roomCode,
    });
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  sendSignal(message: WebRTCMessage) {
    if (this.signalChannel) {
      this.signalChannel.send({
        type: 'broadcast',
        event: 'webrtc-signal',
        payload: message,
      });
    }
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  onConnectionStateChange(callback: (state: string) => void) {
    this.onConnectionStateChangeCallback = callback;
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  async cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    if (this.signalChannel) {
      await supabase.removeChannel(this.signalChannel);
    }

    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
  }
}
