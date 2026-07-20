import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const PROFILE = {
    firstName: 'Magdalena',
    lastName: 'Succrose',
    email: 'magdalena83@mail.com',
    phone: '+234 812 345 6789',
    gender: 'Prefer not to say',
    dob: '',
    bio: '',
};

export default function EditProfileScreen() {
    const [profile, setProfile] = useState(PROFILE);
    const [editForm, setEditForm] = useState(PROFILE);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const genderOptions = ['Male', 'Female', 'Prefer not to say'];

    const handleSave = () => {
        setProfile(editForm);
        setShowEditModal(false);
    };

    const openEdit = () => {
        setEditForm(profile);
        setShowEditModal(true);
    };

    const InfoRow = ({ icon, label, value }: any) => (
        <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>{label}</Text>
            <View style={styles.infoValueRow}>
                <Ionicons name={icon} size={18} color={Colors.textMuted} style={{ marginRight: 10 }} />
                <Text style={styles.infoValue}>{value || '—'}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {profile.firstName[0]}{profile.lastName[0]}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Info Display */}
                <View style={styles.card}>
                    <InfoRow icon="person-outline" label="Username" value={`${profile.firstName} ${profile.lastName}`} />
                    <View style={styles.divider} />
                    <InfoRow icon="mail-outline" label="Email or Phone Number" value={profile.email} />
                    {profile.phone ? (
                        <>
                            <View style={styles.divider} />
                            <InfoRow icon="call-outline" label="Phone" value={profile.phone} />
                        </>
                    ) : null}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={openEdit}>
                    <Text style={styles.saveBtnText}>Update Profile</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={showEditModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

                            <View style={styles.row}>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>FIRST NAME</Text>
                                    <TextInput style={styles.input} value={editForm.firstName} onChangeText={t => setEditForm({ ...editForm, firstName: t })} />
                                </View>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>LAST NAME</Text>
                                    <TextInput style={styles.input} value={editForm.lastName} onChangeText={t => setEditForm({ ...editForm, lastName: t })} />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>EMAIL (READ-ONLY)</Text>
                                    <TextInput style={[styles.input, styles.readOnly]} value={editForm.email} editable={false} />
                                </View>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>PHONE</Text>
                                    <TextInput style={styles.input} keyboardType="phone-pad" value={editForm.phone} onChangeText={t => setEditForm({ ...editForm, phone: t })} />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.halfWrap, { zIndex: 10 }]}>
                                    <Text style={styles.fieldLabel}>GENDER</Text>
                                    <TouchableOpacity style={styles.selectInput} onPress={() => setShowGenderPicker(!showGenderPicker)}>
                                        <Text style={{ color: Colors.textPrimary }}>{editForm.gender}</Text>
                                        <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
                                    </TouchableOpacity>
                                    {showGenderPicker && (
                                        <View style={styles.dropdown}>
                                            {genderOptions.map(opt => (
                                                <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setEditForm({ ...editForm, gender: opt }); setShowGenderPicker(false); }}>
                                                    <Text style={{ color: Colors.textPrimary }}>{opt}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
                                    <TextInput style={styles.input} placeholder="dd/mm/yyyy" value={editForm.dob} onChangeText={t => setEditForm({ ...editForm, dob: t })} />
                                </View>
                            </View>

                            <Text style={styles.fieldLabel}>BIO</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                multiline
                                textAlignVertical="top"
                                value={editForm.bio}
                                onChangeText={t => setEditForm({ ...editForm, bio: t })}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor={Colors.textMuted}
                            />

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEditModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
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
    scrollContent: { padding: 20, paddingBottom: 40 },
    avatarSection: { alignItems: 'center', marginBottom: 28 },
    avatarWrap: { position: 'relative' },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: Colors.white, fontSize: 32, fontWeight: 'bold' },
    avatarEditBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.textPrimary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
    card: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.borderLight },
    infoBlock: { paddingVertical: 8 },
    infoLabel: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
    infoValueRow: { flexDirection: 'row', alignItems: 'center' },
    infoValue: { fontSize: 15, color: Colors.textSecondary },
    divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },
    linkedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    googleBadge: { flexDirection: 'row', alignItems: 'center' },
    googleG: { fontSize: 18, fontWeight: 'bold', color: '#EA4335', marginRight: 10 },
    googleLabel: { fontSize: 15, color: Colors.textPrimary },
    saveBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
    dragHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20 },
    sectionLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 16, letterSpacing: 0.5 },
    row: { flexDirection: 'row', gap: 12 },
    halfWrap: { flex: 1, marginBottom: 16 },
    fieldLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, height: 44, paddingHorizontal: 12, color: Colors.textPrimary, backgroundColor: Colors.white },
    readOnly: { backgroundColor: '#f8fafc', color: Colors.textMuted },
    selectInput: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, height: 44, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dropdown: { position: 'absolute', top: 68, left: 0, right: 0, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
    bioInput: { height: 100, marginBottom: 20, paddingTop: 12 },
    cancelBtn: { backgroundColor: Colors.surface2, height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: Colors.borderLight },
    cancelBtnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
});
