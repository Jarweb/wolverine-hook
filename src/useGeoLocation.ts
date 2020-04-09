import { useEffect, useState, useRef, useCallback} from 'react'

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
  const watchRef = useRef<number>()
  const mounted = useRef(true)

  const handler = useCallback((event: any) => {
    const { coords, timestamp} = event

    if (mounted.current) {
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
  }, [])

  const handleError = useCallback((error: PositionError) => {
    if (mounted.current) {
      setState({
        ...state,
        loading: false,
        error: error
      })
    }
  }, [state])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handler, handleError, options)
    watchRef.current = navigator.geolocation.watchPosition(handler, handleError, options)

    return () => {
      mounted.current = false
      watchRef.current &&
      navigator.geolocation.clearWatch(watchRef.current)
    }
  }, [handler, handleError, options])

  return state
}