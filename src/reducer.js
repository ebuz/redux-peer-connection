
import { combineReducers } from 'redux'
import webrtcConstants from './constants'
import local from './local-store'

export function isInitialized (state = false, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return false
  if (action.type === webrtcConstants.INIT_WEBRTC) {
    return true
  }
  return state
}

export function _peer (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (action.type !== webrtcConstants.WEBRTC_CREATED) return state
  return action.webrtc
}

export function channel (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (action.type !== webrtcConstants.INIT_WEBRTC) return state
  return action.webRTCOptions.channelName
}

export function isConnected (state = false, action) {
  if (action.type === webrtcConstants.PEER_DESTROY || action.type === webrtcConstants.PEER_CLOSE) return false
  if (action.type !== webrtcConstants.PEER_CONNECTED) return state
  return action.isConnected
}

export function offer (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (
    action.type !== webrtcConstants.PEER_SIGNAL ||
    action.signal.type !== 'offer'
  ) return state
  return action.signal
}

export function answer (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (
    action.type !== webrtcConstants.PEER_SIGNAL ||
    action.signal.type !== 'answer'
  ) return state
  return action.signal
}

export function signal (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (action.type === webrtcConstants.PEER_SIGNAL) {
      if(state){
          return [...state, action.signal]
      }
      return [action.signal]
  }
  return state
}

export function data (state = [], action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return []
  if (action.type !== webrtcConstants.PEER_DATA) return state
  return [...state, action.data.toString()]
}

export function stream (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY || action.type === webrtcConstants.PEER_CLOSE) return null
  if (action.type !== webrtcConstants.PEER_STREAM) return state
  return action.stream
}

export function error (state = null, action) {
  if (action.type === webrtcConstants.PEER_DESTROY) return null
  if (action.type !== webrtcConstants.PEER_ERROR) return state
  return action.error
}

export const createReducer = (keyName) => {
  if (keyName !== undefined) {
    local.keyName = keyName
  }
  return combineReducers({
    _peer,
    channel,
    isConnected,
    isInitialized,
    offer,
    answer,
    signal,
    data,
    stream,
    error
  })
}
