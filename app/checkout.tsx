import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

export default function CheckoutScreen() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '', country: 'Nigeria',
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    setLoadingLocations(true);
    fetch('https://countriesnow.space/api/v0.1/countries/states')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCountriesData(data.data);
          const countryNames = data.data.map((c: any) => c.name);
          setCountries(countryNames);
        }
        setLoadingLocations(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingLocations(false);
        setCountries(['Nigeria', 'United States', 'United Kingdom']);
      });
  }, []);

  useEffect(() => {
    const selectedCountryData = countriesData.find(c => c.name === formData.country);
    if (selectedCountryData && selectedCountryData.states) {
      setStates(selectedCountryData.states.map((s: any) => s.name));
    } else {
      setStates([]);
    }
    setFormData(prev => ({ ...prev, state: '' })); // Reset state when country changes
  }, [formData.country, countriesData]);

  const handleCheckout = () => {
    if (!formData.firstName || !formData.email || !formData.street || !formData.country) {
      Alert.alert('Error', 'Please fill all required shipping information.');
      return;
    }

    // Proceed to Review Order step
    router.push('/review-order');
  };

  const PickerModal = ({ visible, onClose, data, onSelect, title }: any) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={Colors.textPrimary} /></TouchableOpacity>
          </View>
          {data.length === 0 ? (
             <View style={{ padding: 20 }}><ActivityIndicator color={Colors.primary} /></View>
          ) : (
            <FlatList 
              data={data}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item); onClose(); }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Progress Steps */}
        <View style={styles.progressRow}>
          <View style={styles.step}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <Text style={styles.activeStepText}>1</Text>
            </View>
            <Text style={styles.activeStepLabel}>Shipping Details</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.inactiveStepText}>2</Text>
            </View>
            <Text style={styles.inactiveStepLabel}>Review order</Text>
          </View>
        </View>

        {/* Shipping Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping Information</Text>
          <Text style={styles.cardSub}>Provide your delivery address below.</Text>

          <View style={styles.row}>
            <View style={styles.inputWrapHalf}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput style={styles.input} value={formData.firstName} onChangeText={(t) => setFormData({...formData, firstName: t})} />
            </View>
            <View style={styles.inputWrapHalf}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput style={styles.input} value={formData.lastName} onChangeText={(t) => setFormData({...formData, lastName: t})} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapHalf}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput style={styles.input} keyboardType="email-address" value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} />
            </View>
            <View style={styles.inputWrapHalf}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput style={styles.input} keyboardType="phone-pad" value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} />
            </View>
          </View>

          <Text style={styles.label}>Street Address *</Text>
          <TextInput style={styles.input} value={formData.street} onChangeText={(t) => setFormData({...formData, street: t})} />

          <View style={styles.row}>
            <View style={styles.inputWrapThird}>
              <Text style={styles.label}>City *</Text>
              <TextInput style={styles.input} value={formData.city} onChangeText={(t) => setFormData({...formData, city: t})} />
            </View>
            <View style={styles.inputWrapThird}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity style={[styles.input, styles.pickerInput]} onPress={() => setShowStatePicker(true)}>
                <Text style={{ color: formData.state ? Colors.textPrimary : Colors.textMuted }}>{formData.state || 'Select State'}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapThird}>
              <Text style={styles.label}>ZIP *</Text>
              <TextInput style={styles.input} value={formData.zip} onChangeText={(t) => setFormData({...formData, zip: t})} />
            </View>
          </View>
          
          <Text style={styles.label}>Country *</Text>
          <TouchableOpacity style={[styles.input, styles.pickerInput]} onPress={() => setShowCountryPicker(true)}>
            <Text style={{ color: formData.country ? Colors.textPrimary : Colors.textMuted }}>{formData.country || 'Select Country'}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxWrapper}>
              <View style={styles.checkboxChecked}>
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.checkboxLabel}>Save this address for future orders</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Order</Text>
          
          <View style={styles.orderItem}>
            <Image source={require('../assets/onboarding3.jpg')} style={styles.orderItemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.orderItemName} numberOfLines={2}>High Quality TCP Home Smoke Light</Text>
              <Text style={styles.orderItemBrand}>JEFEDO</Text>
            </View>
            <Text style={styles.orderItemPrice}>₦20,000</Text>
          </View>

          <View style={styles.promoWrap}>
            <TextInput style={styles.promoInput} placeholder="Coupon code" />
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₦20,000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping/Service Fee</Text>
            <Text style={styles.summaryValue}>Calculated by seller</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦20,000</Text>
          </View>

          <View style={styles.secureBox}>
            <View style={styles.secureRow}>
              <Ionicons name="lock-closed" size={12} color="#f59e0b" style={{ marginRight: 6 }} />
              <Text style={styles.secureText}>Secured by SSL encryption</Text>
            </View>
            <View style={styles.paymentMethods}>
              <Text style={styles.payMethod}>💳 Cards</Text>
              <Text style={styles.payMethod}>🏦 Bank Transfer</Text>
              <Text style={styles.payMethod}>📱 Mobile Money</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Review Order →</Text>
        </TouchableOpacity>

      </ScrollView>

      <PickerModal 
        visible={showCountryPicker} 
        onClose={() => setShowCountryPicker(false)} 
        title="Select Country" 
        data={countries} 
        onSelect={(val: string) => setFormData({...formData, country: val})} 
      />
      <PickerModal 
        visible={showStatePicker} 
        onClose={() => setShowStatePicker(false)} 
        title="Select State" 
        data={states} 
        onSelect={(val: string) => setFormData({...formData, state: val})} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  scrollContent: { padding: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: 10 },
  step: { alignItems: 'center' },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  activeStep: { backgroundColor: Colors.primary },
  activeStepText: { color: Colors.white, fontWeight: 'bold' },
  inactiveStepText: { color: Colors.textMuted, fontWeight: 'bold' },
  activeStepLabel: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },
  inactiveStepLabel: { color: Colors.textMuted, fontSize: 12 },
  line: { width: 60, height: 2, backgroundColor: Colors.borderLight, marginHorizontal: 16, marginBottom: 20 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  inputWrapHalf: { flex: 1, marginBottom: 16 },
  inputWrapThird: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, height: 44, paddingHorizontal: 12, color: Colors.textPrimary, marginBottom: 16 },
  pickerInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  checkboxWrapper: { marginRight: 10 },
  checkboxChecked: { width: 20, height: 20, borderRadius: 4, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  checkboxLabel: { fontSize: 13, color: Colors.textPrimary },
  orderItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  orderItemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  orderItemName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  orderItemBrand: { fontSize: 12, color: Colors.textMuted },
  orderItemPrice: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginLeft: 12 },
  promoWrap: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: 20, borderStyle: 'dashed' },
  promoInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderLight, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingHorizontal: 12, height: 44 },
  applyBtn: { backgroundColor: Colors.primary, borderTopRightRadius: 8, borderBottomRightRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, height: 44 },
  applyText: { color: Colors.white, fontWeight: 'bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  secureBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 20, borderWidth: 1, borderColor: Colors.borderLight },
  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  secureText: { fontSize: 12, color: Colors.textMuted },
  paymentMethods: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  payMethod: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary },
  checkoutBtn: { backgroundColor: '#e2e8f0', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 30 },
  checkoutBtnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  modalItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalItemText: { fontSize: 16, color: Colors.textPrimary },
});
