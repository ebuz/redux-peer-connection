
import SimplePeer from 'simple-peer'
import {
  isCreatingPeer,
  createWebRTC,
  peerError,
  peerSignal,
  peerConnected,
  peerData,
  peerStream,
  closePeer,
  isAcceptingSignal,
  isSendingData,
  isDestroyPeer,
  isSetConstraints,
} from './actions'
import local from './local-store'

export function noPeerError (method) {
  return new Error(`Cannot call ${method} before a peer is created. See method action "createPeer"`)
}

export function closedPeerError (method) {
  return new Error(`Cannot call ${method} on a closed or destroyed peer`)
}

export function getPeer (store) {
  return store.getState()[local.keyName]._peer
}

export function createPeer (dispatch, webRTCOptions, Peer) {
  const peer = new Peer(webRTCOptions)
  peer.on('error', err => dispatch(peerError(err)))
  peer.on('signal', signal => dispatch(peerSignal(signal)))
  peer.on('connect', () => dispatch(peerConnected(true)))
  peer.on('data', data => dispatch(peerData(data)))
  peer.on('stream', stream => dispatch(peerStream(stream)))
  peer.on('close', () => dispatch(closePeer()))
  // peer.on('track', (track, stream) => dispatch(peerTrack(track, stream)))
  dispatch(createWebRTC(peer))
}

export function acceptOffer (offer, peer) {
  if (!peer) throw noPeerError('acceptOffer')
  peer.signal(offer)
}

export function sendData (data, peer) {
  if (!peer) throw noPeerError('sendData')
  if (!peer.connected || peer.destroyed) throw closedPeerError('sendData')
  peer.send(data)
}

export function destroyPeer (error, peer) {
  if (peer) peer.destroy(error)
}

export function setConstraints (constraints, peer) {
  if (!peer) throw noPeerError('setConstraints')
  if (!peer.connected || peer.destroyed) throw closedPeerError('setConstraints')
  peer.setConstraints(constraints)
}

export const middleware = store => next => action => {
  next(action)
  if (isCreatingPeer(action) && !getPeer(store)) {
    return createPeer(store.dispatch, action.webRTCOptions, SimplePeer)
  }
  if (isAcceptingSignal(action)) {
    return acceptOffer(action.signal, getPeer(store))
  }
  if (isSendingData(action)) {
    return sendData(action.data, getPeer(store))
  }
  if (isDestroyPeer(action)) {
    return destroyPeer(action.error, getPeer(store))
  }
  if (isSetConstraints(action)) {
    return setConstraints(action.constraints, getPeer(store))
  }
}
