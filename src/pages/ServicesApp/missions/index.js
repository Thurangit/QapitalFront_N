import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, X, Star, Search } from 'lucide-react';
import TopBar from '../../../modules/Components/topBar';
import AuthUser from '../../../modules/AuthUser';
import { urlApi, urlServerImage } from '../../../modules/urlApp';
import { OptimizedImage } from '../../../components/OptimizedImage';
import { Skeleton } from '../../../components/SkeletonLoader';
import { useDebounce } from '../../../hooks/useDebounce';
import cacheManager from '../../../utils/cacheManager';

export default function MissionsPage() {
    const [tab, setTab] = useState('commandes'); // 'commandes' | 'effectuees'
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', client: '', date: '', status: 'En cours' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'title' | 'status'
    const debouncedSearch = useDebounce(searchQuery, 300);

    const { http, user } = AuthUser();
    const [services_list, setservices_list] = useState([]);

    useEffect(() => {
        const loadMissions = async () => {
            const cacheKey = `missions_user_${user.id}`;

            // Vérifier le cache
            const cached = cacheManager.get(cacheKey);
            if (cached) {
                console.log('[Cache] Missions récupérées du cache');
                setservices_list(cached);
                setLoading(false);
                return;
            }

            // Charger depuis l'API
            setLoading(true);
            try {
                const res = await http.get(`${urlApi}/services/user/${user.id}`);
                const data = res.data || [];

                // Stocker en cache (3 minutes)
                cacheManager.set(cacheKey, data, 3 * 60 * 1000);

                setservices_list(data);
                console.log(`[API] ${data.length} missions chargées`);
            } catch (err) {
                console.error('Erreur chargement missions:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Filtrer et trier les missions
    const filteredAndSortedMissions = useMemo(() => {
        let filtered = services_list;

        // Appliquer la recherche
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase();
            filtered = filtered.filter(m => {
                const searchableText = [
                    m.titre,
                    m.details,
                    m.ville,
                    m.quartier
                ].filter(Boolean).join(' ').toLowerCase();
                return searchableText.includes(query);
            });
        }

        // Trier
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'title') {
                return (a.titre || '').localeCompare(b.titre || '');
            } else if (sortBy === 'status') {
                return (a.status || '').localeCompare(b.status || '');
            }
            return 0;
        });

        return sorted;
    }, [services_list, debouncedSearch, sortBy]);

    const [commandes, setCommandes] = useState([]);
    const [effectuees, setEffectuees] = useState([]);

    const openAdd = () => { setEditing(null); setForm({ title: '', client: '', date: '', status: 'En cours' }); setShowModal(true); };
    const openEdit = (idx, item) => { setEditing({ idx }); setForm({ title: item.title, client: item.client, date: item.date, status: item.status }); setShowModal(true); };
    const removeItem = (idx) => {
        if (tab === 'commandes') setCommandes(list => list.filter((_, i) => i !== idx));
        else setEffectuees(list => list.filter((_, i) => i !== idx));
    };
    const saveItem = () => {
        const entry = { id: editing?.id || Date.now(), ...form };
        if (tab === 'commandes') {
            setCommandes(list => {
                const next = [...list];
                if (editing) next[editing.idx] = entry; else next.push(entry);
                return next;
            });
        } else {
            setEffectuees(list => {
                const next = [...list];
                if (editing) next[editing.idx] = entry; else next.push(entry);
                return next;
            });
        }
        setShowModal(false);
    };

    const stats = useMemo(() => {
        const totalCommandes = commandes.length;
        const totalEffectuees = effectuees.length;
        const total = totalCommandes + totalEffectuees;
        const ratings = [...commandes, ...effectuees]
            .map(m => typeof m.stars === 'number' ? m.stars : 0)
            .filter(v => v > 0);
        const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        return { total, avg, totalCommandes, totalEffectuees };
    }, [commandes, effectuees]);

    // Skeleton loader pour les missions
    const MissionSkeleton = () => (
        <div className="flex items-start bg-white p-3 rounded-lg shadow-sm animate-pulse">
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex-shrink-0" />
            <div className="ml-3 flex-1 space-y-2">
                <Skeleton width="60%" height="16px" />
                <Skeleton width="40%" height="12px" />
                <Skeleton width="30%" height="12px" />
            </div>
            <div className="flex gap-1 ml-2">
                <Skeleton width="28px" height="28px" />
                <Skeleton width="28px" height="28px" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar title={"Mes missions"} onBack={() => window.history.back()} onShare={() => { }} showShare={true} />
            <div className="max-w-2xl mx-auto p-4">
                <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">Commandées</p>
                        <p className="text-xl font-bold">{stats.totalCommandes}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Note moyenne</p>
                            <p className="text-xl font-bold">{stats.avg.toFixed(1)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(stats.avg) ? 'fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">Effectuées</p>
                        <p className="text-xl font-bold">{stats.totalEffectuees}</p>
                    </div>
                </div>
                {/* Barre de recherche */}
                <div className="mb-4">
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-2 flex items-center">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Rechercher une mission..."
                                className="flex-1 outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="ml-1 p-1 hover:bg-gray-100 rounded">
                                    <X className="w-3 h-3 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                            <option value="date">Date</option>
                            <option value="title">Titre</option>
                            <option value="status">Statut</option>
                        </select>
                    </div>
                    {debouncedSearch && (
                        <p className="text-xs text-blue-600 mt-2">
                            {filteredAndSortedMissions.length} résultat{filteredAndSortedMissions.length > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 mb-4">
                    <button className={`flex-1 px-3 py-1.5 rounded ${tab === 'commandes' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('commandes')}>Mes offres</button>
                    <button className={`flex-1 px-3 py-1.5 rounded ${tab === 'effectuees' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('effectuees')}>Historique</button>
                </div>

                <div className="flex justify-end mb-3">
                    <button className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition-colors" onClick={openAdd}>
                        <Plus size={14} /> Ajouter
                    </button>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <>
                            <MissionSkeleton />
                            <MissionSkeleton />
                            <MissionSkeleton />
                        </>
                    ) : filteredAndSortedMissions.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-gray-500 mb-2">
                                {searchQuery ? 'Aucun résultat trouvé' : 'Aucune mission'}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Réinitialiser la recherche
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredAndSortedMissions.map((m, idx) => (
                            <div key={m.id || idx} className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <OptimizedImage
                                    src={`${urlServerImage}/${m.image}`}
                                    alt={m.titre || "Mission"}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                                    placeholder="/api/placeholder/80/80"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                        <h3 className="text-sm sm:text-base font-medium leading-snug break-words">{m.titre}</h3>
                                        <span className={`self-start sm:self-auto text-xs px-2 py-0.5 rounded-full ${m.status === 'Terminé' ? 'bg-green-100 text-green-800' : m.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{m.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1 break-words">{m.client}</p>
                                    <div className="flex items-center text-xs text-gray-500"><Calendar size={12} className="mr-1" />{m.created_at}</div>
                                    {m.stars > 0 && (
                                        <div className="mt-1 flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < Math.round(m.stars) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                            <span className="text-[10px] text-gray-500">{Number(m.stars).toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1 ml-2 flex-shrink-0">
                                    <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => openEdit(idx, m)} aria-label="Modifier"><Edit2 size={14} /></button>
                                    <button className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => removeItem(idx)} aria-label="Supprimer"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold">{editing ? 'Modifier la mission' : 'Ajouter une mission'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Titre</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Client</label>
                                <input type="text" className="mt-1 w-full border rounded-md p-2 text-sm" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Date</label>
                                <input type="date" className="mt-1 w-full border rounded-md p-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Statut</label>
                                <select className="mt-1 w-full border rounded-md p-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option>En cours</option>
                                    <option>Terminé</option>
                                    <option>Planifié</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t flex justify-end gap-2">
                            <button onClick={() => setShowModal(false)} className="px-3 py-2 text-sm rounded-md bg-gray-100">Annuler</button>
                            <button onClick={saveItem} className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


