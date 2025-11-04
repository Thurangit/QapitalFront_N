import React, { useState } from 'react';
import AuthUser from '../../../modules/AuthUser';
import { urlPublicAPi } from '../../../modules/urlApp';
import { StaticsImages } from '../../../modules/images';
import { Edit2, X, UploadCloud, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';

export default function ProfileSimple() {
    const { user } = AuthUser();
    const [showEdit, setShowEdit] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [coverPhoto, setCoverPhoto] = useState(StaticsImages.t1);
    const [form, setForm] = useState({
        pseudo: user.pseudo || '',
        description: user.description || '',
        ville: user.ville_residence || '',
        avatarFile: null,
        avatarPreview: '',
        coverFile: null,
        coverPreview: ''
    });
    const [contacts, setContacts] = useState({
        email: user.email || '',
        phone1: user.num_tel_one || '',
        phone2: user.num_tel_two || '',
        whatsapp: user.whatsapp_tel_two || ''
    });
    const [stats] = useState({ missionsPostees: 12 });

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <div className="relative h-40 bg-gray-200">
                <img src={form.coverPreview || coverPhoto} alt="Couverture" className="w-full h-full object-cover opacity-90" />
                <button className="absolute top-2 right-2 bg-white bg-opacity-80 px-3 py-1.5 rounded-full text-xs" onClick={() => setShowEdit(true)}>Modifier</button>
            </div>
            <div className="px-4 -mt-12 relative">
                <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
                    <div className="flex items-start">
                        <div className="relative -mt-12">
                            <img
                                src={`${urlPublicAPi}/avatars/${user.avatar}`}
                                alt={user.pseudo}
                                className="w-20 h-20 rounded-full object-cover shadow"
                            />
                            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm" onClick={() => setShowEdit(true)}>
                                <Edit2 size={14} className="text-gray-700" />
                            </button>
                        </div>
                        <div className="ml-4 flex-1 pt-2">
                            <h1 className="text-lg font-bold">{user.nom} {user.prenom}</h1>
                            <p className="text-gray-600 text-sm">@{user.pseudo}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                                <MapPin size={14} className="mr-1" />
                                <span>{user.ville_residence || '—'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-700">{user.description || 'Aucune description'}</p>
                    </div>
                </div>

                {/* Stats distinctives */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-500">Missions postées</p>
                        <p className="text-2xl font-bold">{stats.missionsPostees}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"></div>
                </div>

                {/* Contacts */}
                <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold">Contacts</h2>
                        <button className="p-1 bg-gray-100 rounded-full" onClick={() => setShowContacts(true)}>
                            <Edit2 size={14} className="text-gray-700" />
                        </button>
                    </div>
                    <div className="space-y-2 text-sm">
                        {contacts.email && (
                            <div className="flex items-center text-gray-700"><Mail size={16} className="mr-2 text-gray-500" /> {contacts.email}</div>
                        )}
                        {(contacts.phone1 || contacts.phone2) && (
                            <div className="flex items-center text-gray-700"><Phone size={16} className="mr-2 text-gray-500" /> {[contacts.phone1, contacts.phone2].filter(Boolean).join(' / ')}</div>
                        )}
                        {contacts.whatsapp && (
                            <div className="flex items-center text-gray-700"><MessageCircle size={16} className="mr-2 text-green-600" /> {contacts.whatsapp}</div>
                        )}
                    </div>
                </div>
            </div>

            {showEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Modifier le profil</h3>
                            <button onClick={() => setShowEdit(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-sm text-gray-600">Photo de couverture</label>
                                <div className="mt-1 border rounded-md p-2">
                                    {form.coverPreview && (<img src={form.coverPreview} alt="Aperçu" className="w-full h-24 object-cover rounded" />)}
                                    <div className="flex gap-2 mt-2">
                                        <input id="coverUploadSimple" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (file) {
                                                const preview = URL.createObjectURL(file);
                                                setForm({ ...form, coverFile: file, coverPreview: preview });
                                            }
                                        }} />
                                        <label htmlFor="coverUploadSimple" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><UploadCloud size={14} /> Choisir</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Pseudo</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={form.pseudo} onChange={(e) => setForm({ ...form, pseudo: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Ville</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Description</label>
                                <textarea rows={3} className="mt-1 w-full border rounded-md p-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Avatar</label>
                                <div className="mt-1 border rounded-md p-2">
                                    {form.avatarPreview && (<img src={form.avatarPreview} alt="Aperçu" className="w-20 h-20 object-cover rounded-full" />)}
                                    <div className="flex gap-2 mt-2">
                                        <input id="avatarUploadSimple" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (file) {
                                                const preview = URL.createObjectURL(file);
                                                setForm({ ...form, avatarFile: file, avatarPreview: preview });
                                            }
                                        }} />
                                        <label htmlFor="avatarUploadSimple" className="px-3 py-1.5 bg-gray-100 rounded-md text-sm flex items-center gap-1 cursor-pointer"><UploadCloud size={14} /> Choisir</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowEdit(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100">Annuler</button>
                            <button onClick={() => { setCoverPhoto(form.coverPreview || coverPhoto); setShowEdit(false); }} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {showContacts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Modifier les contacts</h3>
                            <button onClick={() => setShowContacts(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <input type="email" className="mt-1 w-full border rounded-md p-2 text-sm" value={contacts.email} onChange={(e) => setContacts({ ...contacts, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Téléphone 1</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contacts.phone1} onChange={(e) => setContacts({ ...contacts, phone1: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Téléphone 2</label>
                                    <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contacts.phone2} onChange={(e) => setContacts({ ...contacts, phone2: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">WhatsApp</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={contacts.whatsapp} onChange={(e) => setContacts({ ...contacts, whatsapp: e.target.value })} />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowContacts(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100">Annuler</button>
                            <button onClick={() => setShowContacts(false)} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


