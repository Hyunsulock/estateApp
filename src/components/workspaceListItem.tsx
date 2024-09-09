import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const WorkspaceItem = ({ workspace }) => (
  <Link href={`/(workspace)/workspaces/${workspace.id}`} asChild>
    <Pressable style={styles.pressable}>
      <Text style={styles.title}>{workspace.name}</Text>
      <Text style={styles.description}>{workspace.description}</Text>
      <View style={styles.row}>
        {workspace.owner_profile.username ? (
          <View style={[styles.tag, styles.ownerTag]}>
            <Text style={styles.ownerText}>Owner: {workspace.owner_profile.username}</Text>
          </View>
        ) : (
          <View style={[styles.tag, styles.anonymousTag]}>
            <Text style={styles.anonymousText}>Anonymous</Text>
          </View>
        )}
      </View>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: '#F3F4F6', // Equivalent to bg-gray-100
    padding: 16, // Equivalent to p-4
    marginBottom: 16, // Equivalent to mb-4
    borderRadius: 8, // Equivalent to rounded-lg
    borderWidth: 1, // Equivalent to border
    borderColor: '#D1D5DB', // Equivalent to border-gray-300
  },
  title: {
    fontSize: 24, // Equivalent to text-2xl
    fontWeight: 'bold', // Equivalent to font-bold
  },
  description: {
    fontSize: 16, // Equivalent to text-base
  },
  row: {
    flexDirection: 'row', // Equivalent to flex-row
    alignItems: 'flex-start', // Equivalent to items-start
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 4, // Equivalent to px-1
    paddingVertical: 2, // Equivalent to py-1 (adjust as needed)
    borderRadius: 4, // Equivalent to rounded-md
    borderWidth: 1, // Equivalent to border
  },
  ownerTag: {
    backgroundColor: '#BFDBFE', // Equivalent to bg-blue-200
    borderColor: '#60A5FA', // Equivalent to border-blue-400
  },
  ownerText: {
    color: '#3B82F6', // Equivalent to text-blue-500
  },
  anonymousTag: {
    backgroundColor: '#FECACA', // Equivalent to bg-red-200
    borderColor: '#F87171', // Equivalent to border-red-400

  },
  anonymousText: {
    color: '#EF4444', // Equivalent to text-red-500
  },
});

export default WorkspaceItem;
