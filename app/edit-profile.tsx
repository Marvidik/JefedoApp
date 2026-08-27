import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getProfile, patchProfile } from '../services/accountService';

const GENDER_MAP: Record<string, string> = {
    'MALE': 'Male',
    'FEMALE': 'Female',
    'NON_BINARY': 'Non-Binary',
    'PREFER_NOT_TO_SAY': 'Prefer not to say',
};

const GENDER_API_MAP: Record<string, 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'> = {
    'Male': 'MALE',
    'Female': 'FEMALE',
    'Non-Binary': 'NON_BINARY',
    'Prefer not to say': 'PREFER_NOT_TO_SAY',
};

export default function EditProfileScreen() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: '', last_name: '', phone: '',
        gender: 'Prefer not to say', date_of_birth: '', bio: '',
    });

    const genderOptions = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            Alert.alert('Error', 'Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = () => {
        if (!profile) return;
        setEditForm({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            phone: profile.phone || '',
            gender: GENDER_MAP[profile.gender || ''] || 'Prefer not to say',
            date_of_birth: profile.date_of_birth || '',
            bio: profile.bio || '',
        });
        setShowEditModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await patchProfile({
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                phone: editForm.phone,
                gender: GENDER_API_MAP[editForm.gender] || 'PREFER_NOT_TO_SAY',
                date_of_birth: editForm.date_of_birth || undefined,
                bio: editForm.bio,
            });
            setProfile(updated);
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (err: any) {
            Alert.alert('Error', err.detail || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
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

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    const initials = `${(profile?.first_name || '?')[0]}${(profile?.last_name || '?')[0]}`.toUpperCase();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                    </View>
                    <Text style={styles.profileName}>{profile?.first_name} {profile?.last_name}</Text>
                    <Text style={styles.profileEmail}>{profile?.email}</Text>
                </View>

                {/* Info Display */}
                <View style={styles.card}>
                    <InfoRow icon="person-outline" label="Full Name" value={`${profile?.first_name || ''} ${profile?.last_name || ''}`} />
                    <View style={styles.divider} />
                    <InfoRow icon="mail-outline" label="Email" value={profile?.email} />
                    {profile?.phone ? (
                        <>
                            <View style={styles.divider} />
                            <InfoRow icon="call-outline" label="Phone" value={profile?.phone} />
                        </>
                    ) : null}
                    {profile?.gender ? (
                        <>
                            <View style={styles.divider} />
                            <InfoRow icon="person-circle-outline" label="Gender" value={GENDER_MAP[profile.gender] || profile.gender} />
                        </>
                    ) : null}
                    {profile?.bio ? (
                        <>
                            <View style={styles.divider} />
                            <InfoRow icon="document-text-outline" label="Bio" value={profile.bio} />
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
                                    <TextInput style={styles.input} value={editForm.first_name} onChangeText={t => setEditForm({ ...editForm, first_name: t })} />
                                </View>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>LAST NAME</Text>
                                    <TextInput style={styles.input} value={editForm.last_name} onChangeText={t => setEditForm({ ...editForm, last_name: t })} />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWrap}>
                                    <Text style={styles.fieldLabel}>EMAIL (READ-ONLY)</Text>
                                    <TextInput style={[styles.input, styles.readOnly]} value={profile?.email} editable={false} />
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
                                    <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} value={editForm.date_of_birth} onChangeText={t => setEditForm({ ...editForm, date_of_birth: t })} />
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

                            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
                                {saving ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save Changes</Text>
                                )}
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
    avatarWrap: { position: 'relative', marginBottom: 12 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: Colors.white, fontSize: 32, fontWeight: 'bold' },
    profileName: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
    profileEmail: { fontSize: 13, color: Colors.textMuted },
    card: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.borderLight },
    infoBlock: { paddingVertical: 8 },
    infoLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6, letterSpacing: 0.3 },
    infoValueRow: { flexDirection: 'row', alignItems: 'center' },
    infoValue: { fontSize: 15, color: Colors.textPrimary, flex: 1 },
    divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },
    saveBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
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
    cancelBtn: { backgroundColor: '#f1f5f9', height: 52, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 4, borderWidth: 1, borderColor: Colors.borderLight },
    cancelBtnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
});
