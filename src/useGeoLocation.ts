import {useEffect, useState} from 'react'

interface GeolocationState{
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error?: Error | PositionError;
}

export default function useGeoLocation(options?: PositionOptions): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: Date.now(),
  })

  let mounted = true
  let watchId: any

  const handler = (event: any) => {
    const { coords, timestamp} = event

    if (mounted) {
      setState({
        loading: false,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
        timestamp: timestamp,
      })
    }
  }

  const handleError = (error: PositionError) => {
    if (mounted) {
      setState({
        ...state,
        loading: false,
        error: error
      })
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handler, handleError, options)
    watchId = navigator.geolocation.watchPosition(handler, handleError, options)

    return () => {
      mounted = false
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return state
}