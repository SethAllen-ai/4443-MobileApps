import { View, TextInput, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

import { Colors } from '../constants/styles';
import ImageScreen from './ImageScreen';

function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
 
  const sendMessage = () => {
    if (input.trim()!== '') {
      setMessages([...messages, { text: input, sender: 'You' }]);
      setInput('');
    }
  };
 
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: Colors.primary100 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((message, index) => (
          <Text key={index} style={{ marginBottom: 10 }}>
            {message.sender}: {message.text}
          </Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Image')} style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 24 }}>+</Text>
        </TouchableOpacity>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={{ flex: 1, borderColor: 'white', borderWidth: 1, marginRight: 10, backgroundColor: '#4d4d4d', paddingLeft: 10, color: 'white' }}
          placeholderTextColor="white"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

export default ChatScreen;