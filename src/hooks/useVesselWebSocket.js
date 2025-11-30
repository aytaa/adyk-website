import { useState, useEffect, useRef, useCallback } from 'react';
import { getAccessToken } from '../utils/auth';

const useVesselWebSocket = () => {
  const [vessels, setVessels] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    const token = getAccessToken();

    if (!token) {
      setError('Oturum bulunamadı');
      setLoading(false);
      return;
    }

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `wss://ws.adyk.online?token=${token}`;
    console.log('[WS] Connecting...');

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('[WS] ✅ Connected');
      setConnected(true);
      setError(null);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Auth response
        if (data.type === 'auth') {
          if (data.success) {
            console.log('[WS] ✅ Authenticated');
          } else {
            console.error('[WS] ❌ Auth failed:', data.error);
            setError('Kimlik doğrulama hatası');
          }
          return;
        }

        // Vessel update - NEW FORMAT
        if (data.type === 'update') {
          const allVessels = data.data || [];
          const mappedVessels = allVessels.filter(v => v.mapped === true);

          // Transform to website format
          const vesselData = mappedVessels.map(v => ({
            id: v.id,
            imei: v.imei,
            mmsi: v.mmsi,
            name: v.name || 'İsimsiz',
            vesselType: v.vesselType || 'Bilinmiyor',
            callSign: v.callSign || '',
            flag: v.flag || 'TR',
            userId: v.userId,
            userName: v.userName || '',
            status: v.status || 'offline',
            lastUpdate: v.lastUpdate,
            mapped: v.mapped,
            // Position data - FLAT STRUCTURE
            latitude: v.position?.latitude || 0,
            longitude: v.position?.longitude || 0,
            speed: v.position?.speed || 0,
            direction: v.position?.direction || 0,
            course: v.position?.direction || 0,
            altitude: v.position?.altitude || 0,
            satellites: v.position?.satellites || 0,
            // Legacy format for compatibility
            position: {
              lat: v.position?.latitude || 0,
              lon: v.position?.longitude || 0,
              accuracy: true
            },
            // Legacy fields
            typeName: v.vesselType || 'Bilinmiyor',
            statusName: v.status || 'offline',
            callsign: v.callSign || '',
            heading: v.position?.direction || 0
          }));

          setVessels(vesselData);
          setLoading(false);
          setLastUpdate(new Date(data.timestamp));
          console.log(`[WS] Updated: ${vesselData.length} vessels`);
          return;
        }

        // Ping/pong
        if (data.type === 'ping') {
          wsRef.current?.send(JSON.stringify({ type: 'pong' }));
          return;
        }
      } catch (err) {
        console.error('[WS] Parse error:', err);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error('[WS] Error:', err);
      setError('Bağlantı hatası');
    };

    wsRef.current.onclose = (event) => {
      console.log('[WS] Closed:', event.code);
      setConnected(false);

      // Don't reconnect on auth errors
      if (event.code === 4001 || event.code === 4002) {
        setError('Oturum süresi doldu');
        setLoading(false);
        return;
      }

      // Auto reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('[WS] Reconnecting...');
        connect();
      }, 3000);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    vessels,
    connected,
    loading,
    error,
    lastUpdate,
    reconnect: connect,
    // Legacy compatibility
    isConnected: connected,
    hasReceivedData: !loading,
    vesselsCount: vessels.length,
    trackers: [],
    trackersCount: 0,
    totalCount: vessels.length
  };
};

export default useVesselWebSocket;
