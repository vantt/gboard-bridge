import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Switch } from 'react-native';

export default function InputScreen({ route, navigation }) {
  const { serverInfo } = route.params;
  const [status, setStatus] = useState('Disconnected');
  const [text, setText] = useState('');
  const [autoSend, setAutoSend] = useState(true);
  const ws = useRef(null);

  useEffect(() => {
    connectWS();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const connectWS = () => {
    setStatus('Connecting...');
    if (ws.current) {
        ws.current.close();
    }
    const uri = `ws://${serverInfo.address}:59101`;
    ws.current = new WebSocket(uri);

    ws.current.onopen = () => {
      setStatus('Connected');
    };

    ws.current.onclose = () => {
        setStatus('Disconnected');
    };

    ws.current.onerror = (e) => {
        setStatus('Error');
        console.log('WebSocket Error', e);
    };
  };

  const lastTextRef = useRef('');

  const handleTextChange = (val) => {
    setText(val);
    
    if (autoSend) {
      const previous = lastTextRef.current;
      
      // Check if it's a simple append
      if (val.startsWith(previous)) {
        const newPart = val.substring(previous.length);
        if (newPart.length > 0) {
           sendText(newPart);
        }
      } else {
         // Complex change (delete, replace, etc.)
         // For simplistic "Voice Bridge", we might ignore deletes or implement full sync later.
         // If the user cleared the text or backspaced, we just update our ref.
      }
      lastTextRef.current = val;
    }
  };

  // Reset ref when manual send or clear happens
  useEffect(() => {
    if (!autoSend) {
        // When switching modes or manual typing, we might need to sync ref
        lastTextRef.current = text;
    }
  }, [autoSend, text]);

  const sendText = (txt) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
              type: 'text_input',
              text: txt,
              mode: 'append'
          }));
      }
  };
  
  const handleManualSend = () => {
      sendText(text);
      setText('');
      lastTextRef.current = '';
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
        <View>
          <Text style={[styles.statusLine, status === 'Connected' ? styles.connected : styles.disconnected]}>
            Status: {status}
          </Text>
          <Text style={styles.serverInfo}>({serverInfo.address})</Text>
        </View>
        {status !== 'Connected' && (
             <Button title="Reconnect" onPress={connectWS} size="small" />
        )}
      </View>
      {status === 'Error' && <Text style={styles.errorText}>Check PC Firewall (Port 59101)</Text>}
      
      <View style={styles.modeContainer}>
        <Text>Auto Send (Experimental)</Text>
        <Switch value={autoSend} onValueChange={setAutoSend} />
      </View>

      <Text style={styles.label}>Tap mic on keyboard and speak:</Text>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type or speak here..."
        value={text}
        onChangeText={handleTextChange}
      />
      
      <View style={styles.buttonContainer}>
          <Button title="Clear" onPress={() => {
              setText('');
              lastTextRef.current = '';
          }} color="#888" />
          {!autoSend && (
              <View style={{width: 20}} /> /* Spacer */
          )}
          {!autoSend && (
               <Button title="Send Text" onPress={handleManualSend} />
          )}
      </View>
      
      <View style={styles.hint}>
          <Text style={styles.hintText}>
              Note: For best results, use "Manual Send". Speak a sentence, then hit Send.
              If Auto Send is one, it sends every keystroke which might double type.
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  statusLine: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverInfo: {
    fontSize: 12,
    color: '#666',
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
      marginBottom: 10,
      fontSize: 16,
  },
  hint: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
  },
  hintText: {
      fontSize: 12,
      color: '#555',
  }
});
