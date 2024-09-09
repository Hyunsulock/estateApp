import { Pressable, StyleSheet, Text, View } from 'react-native';

import { forwardRef } from 'react';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    return (
      <Pressable ref={ref} {...pressableProps} style={styles.button} >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4299e1', // Blue-400 equivalent
    padding: 16,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // for Android shadow
  },
  buttonPressed: {
    opacity: 0.5, // Reduce opacity when pressed
  },
  text: {
    color: '#FFFFFF', // White color
    fontSize: 18,
    fontWeight: '600',
  },
});



export default Button;