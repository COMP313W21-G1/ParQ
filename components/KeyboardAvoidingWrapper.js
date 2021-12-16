import React from 'react';

// keyboard avoiding view
import { KeyboardAvoidingView, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

//colors
import { Colors } from './styles';
const { primary } = Colors;

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: primary }}>
    <FlatList keyboardShouldPersistTaps='always'
          data={[]}
          ListEmptyComponent={null}
          keyExtractor={() => "dummy"}
          renderItem={null}
          ListHeaderComponent={() => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
          )}
        />
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;