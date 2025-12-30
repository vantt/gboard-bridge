import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import dgram from 'react-native-udp';

export default function ConnectionScreen({ navigation }) {
  const [servers, setServers] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      // stop scanning if needed
    };
  }, []);

  const scanForPCs = () => {
    setScanning(true);
    setServers([]);

    try {
      if (!dgram || !dgram.createSocket) {
        throw new Error('UDP Native Module missing');
      }

      const socket = dgram.createSocket('udp4');
      socket.bind(59100);
      
      socket.on('message', (msg, rinfo) => {
        const message = msg.toString();
        // Format: "VOICE_TYPING_BRIDGE_SERVER|<PC_NAME>|<VERSION>"
        if (message.startsWith('VOICE_TYPING_BRIDGE_SERVER')) {
          const parts = message.split('|');
          const pcName = parts[1] || 'Unknown PC';
          const address = rinfo.address;
          
          setServers(prev => {
            // Avoid duplicates
            if (prev.find(s => s.address === address)) return prev;
            return [...prev, { id: address, name: pcName, address }];
          });
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
          try {
            socket.close();
          } catch (e) {
            // ignore
          }
          setScanning(false);
      }, 10000);

    } catch (err) {
      console.warn("UDP Scan Error:", err);
      setScanning(false);
      Alert.alert(
        "UDP Discovery Error",
        "Cannot scan for devices. Using UDP requires a native build or development client.\n\n" +
        "If you are using Expo Go, this feature is not supported. Please use Manual Connect."
      );
    }
  };

  const connectToPC = (server) => {
    // For MVP Phase 1, we might skip pairing code complex logic or assume "Trusted"
    // Just navigate to InputScreen with server details
    navigation.navigate('Input', { serverInfo: server });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find your PC</Text>
      <Text style={styles.subtitle}>Make sure your PC and Phone are on the same WiFi.</Text>
      
      <Button 
        title={scanning ? "Scanning..." : "Scan for PC"} 
        onPress={scanForPCs} 
        disabled={scanning} 
      />

      <FlatList
        data={servers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serverItem} onPress={() => connectToPC(item)}>
            <Text style={styles.serverName}>{item.name}</Text>
            <Text style={styles.serverAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{scanning ? "Listening..." : "No PCs found yet"}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  serverItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
  },
  serverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serverAddress: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
