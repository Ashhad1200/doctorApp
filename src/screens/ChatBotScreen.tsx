import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatBotScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');

    // Mock reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'I am a demo bot. I cannot answer queries yet.', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100 bg-primary">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4 text-white">AI Assistant</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className={`mb-4 flex-row ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <View
              className={`p-3 rounded-2xl max-w-[80%] ${item.sender === 'user'
                  ? 'bg-primary rounded-tr-none'
                  : 'bg-gray-100 rounded-tl-none'
                }`}
            >
              <Text className={item.sender === 'user' ? 'text-white' : 'text-text'}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="p-4 border-t border-gray-100 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 h-10 mr-2"
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage} className="bg-primary p-2 rounded-full">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotScreen;
