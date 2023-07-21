import { StyleSheet, View, Text, Pressable } from "react-native";
import { colors } from "../constants";

export function Button({
      text,
      onPress = () => { },
      width = '100%',
      height = 50,
      textStyle = {},
      containerStyle = {},
      disabled = false,
      primary = false,
      icon = null
}) {
      return (
            <Pressable
                  disabled={disabled}
                  onPress={onPress}
                  style={[styles.touchable]}>
                  <View style={[styles.button, {
                        width,
                        height,
                        borderRadius: 6
                  }, primary ? styles.primaryBg : styles.secondaryBg, containerStyle]}>
                        {icon ? icon : <Text style={[styles.primaryTextColor, textStyle]}>
                              {' ' + text + ' '}
                        </Text>}
                  </View>
            </Pressable>
      )
}

const styles = StyleSheet.create({
      touchable: {
            borderRadius: 8,
            marginBottom: 40
      },
      button: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            paddingHorizontal: 20, paddingVertical: 10
      },
      background: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 8
      },
      border: {
            borderWidth: 1.1,
            borderColor: 'black',
      },
      primaryBg: {
            backgroundColor: colors.primaryBackgroundColor,
      },
      secondaryBg: {
            backgroundColor: colors.secondaryBackgroundColor,
      },
      primaryTextColor: {
            color: colors.primaryTextColor,
      },
});