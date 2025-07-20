import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type NoteCardProps = {
  title: string;
  body: string;
  onDelete: () => void;
  onPress?: () => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ title, body, onDelete, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
      <Text
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
        <Text style={styles.body} numberOfLines={4}>{body}</Text>
      </View>
      <TouchableOpacity style={styles.xButton} onPress={onDelete}>
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Path
            d="M18 6L6 18M6 6l12 12"
            stroke="red"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 12,
    padding: 20,
    width: 320,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#19361e',
    fontFamily: 'Roboto-Bold',
    paddingRight: 36,
  },
  body: {
    fontSize: 16,
    color: '#587458',
    fontFamily: 'Roboto-Light'
  },
  xButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    zIndex: 10,
  },
});
