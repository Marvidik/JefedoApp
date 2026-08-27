import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

import { getAddresses, createAddress, deleteAddress, setDefaultAddress } from '../services/accountService';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', full_name: '', street_address: '', phone: '', city: '', state: '', country: 'Nigeria', postal_code: '' });
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAddresses = () => {
    setLoading(true);
    getAddresses()
      .then(setAddresses)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    loadAddresses();
  }, []);

  const makeDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      loadAddresses();
    } catch (err) {
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const removeAddress = (id: number) => {
    Alert.alert('Remove Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
          try {
            await deleteAddress(id);
            loadAddresses();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete address');
          }
      } }
    ]);
  };

  const addAddress = async () => {
    if (!newAddress.full_name || !newAddress.street_address || !newAddress.city) {
      Alert.alert('Error', 'Please fill required fields.'); return;
    }
    try {
      await createAddress({
        ...newAddress,
        is_default: isDefault
      });
      setNewAddress({ label: '', full_name: '', street_address: '', phone: '', city: '', state: '', country: 'Nigeria', postal_code: '' });
      setIsDefault(false);
      setShowAddModal(false);
      loadAddresses();
    } catch (err) {
      Alert.alert('Error', 'Failed to create address');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color={Colors.borderLight} />
            <Text style={styles.emptyText}>No saved addresses yet</Text>
          </View>
        )}

        {addresses.map(addr => (
          <View key={addr.id} style={[styles.addressCard, addr.is_default && styles.addressCardDefault]}>
            <View style={styles.addressCardTop}>
              <View style={styles.labelRow}>
                <Ionicons name="location" size={16} color={addr.is_default ? Colors.primary : Colors.textMuted} />
                <Text style={styles.addressLabel}>{addr.label}</Text>
                {addr.is_default && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => removeAddress(addr.id)}>
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            </View>

            <Text style={styles.addressName}>{addr.full_name}</Text>
            <Text style={styles.addressText}>{addr.street_address}</Text>
            <Text style={styles.addressText}>{addr.city}, {addr.state}, {addr.country}</Text>
            <Text style={styles.addressText}>{addr.postal_code || ''}</Text>
            <Text style={styles.addressPhone}>📞 {addr.phone}</Text>

            {!addr.is_default && (
              <TouchableOpacity style={styles.makeDefaultBtn} onPress={() => makeDefault(addr.id)}>
                <Text style={styles.makeDefaultText}>Make Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addNewBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.addNewText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Address Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.dragHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>ADDRESS LABEL</Text>
              <TextInput style={styles.input} placeholder="e.g. Office, Home 2" value={newAddress.label} onChangeText={t => setNewAddress({...newAddress, label: t})} />

              <Text style={styles.fieldLabel}>FULL NAME *</Text>
              <TextInput style={styles.input} value={newAddress.full_name} onChangeText={t => setNewAddress({...newAddress, full_name: t})} />

              <Text style={styles.fieldLabel}>STREET ADDRESS *</Text>
              <TextInput style={styles.input} placeholder="Street Address" value={newAddress.street_address} onChangeText={t => setNewAddress({...newAddress, street_address: t})} />

              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={newAddress.phone} onChangeText={t => setNewAddress({...newAddress, phone: t})} />

              <View style={styles.row}>
                <View style={styles.halfWrap}>
                  <Text style={styles.fieldLabel}>CITY *</Text>
                  <TextInput style={styles.input} value={newAddress.city} onChangeText={t => setNewAddress({...newAddress, city: t})} />
                </View>
                <View style={styles.halfWrap}>
                  <Text style={styles.fieldLabel}>STATE</Text>
                  <TextInput style={styles.input} value={newAddress.state} onChangeText={t => setNewAddress({...newAddress, state: t})} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWrap}>
                  <Text style={styles.fieldLabel}>COUNTRY</Text>
                  <TextInput style={styles.input} value={newAddress.country} onChangeText={t => setNewAddress({...newAddress, country: t})} />
                </View>
                <View style={styles.halfWrap}>
                  <Text style={styles.fieldLabel}>POSTAL CODE</Text>
                  <TextInput style={styles.input} value={newAddress.postal_code} onChangeText={t => setNewAddress({...newAddress, postal_code: t})} />
                </View>
              </View>

              <TouchableOpacity style={styles.checkRow} onPress={() => setIsDefault(!isDefault)}>
                <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                  {isDefault && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Text style={styles.checkLabel}>Set as default address</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={addAddress}>
                <Text style={styles.saveBtnText}>Add Address</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: Colors.textMuted, marginTop: 12, fontSize: 15 },
  addressCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight },
  addressCardDefault: { borderColor: Colors.primary, borderWidth: 1.5 },
  addressCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addressLabel: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  defaultBadge: { backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary },
  defaultBadgeText: { color: Colors.primary, fontSize: 11, fontWeight: 'bold' },
  addressName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  addressText: { fontSize: 13, color: Colors.textMuted, marginBottom: 2 },
  addressPhone: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  makeDefaultBtn: { marginTop: 12, borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  makeDefaultText: { color: Colors.primary, fontSize: 13, fontWeight: 'bold' },
  addNewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, backgroundColor: '#fef9f9' },
  addNewText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  dragHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  fieldLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 8, marginTop: 8 },
  input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, height: 44, paddingHorizontal: 12, color: Colors.textPrimary, backgroundColor: Colors.white, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 12 },
  halfWrap: { flex: 1 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkLabel: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  saveBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
