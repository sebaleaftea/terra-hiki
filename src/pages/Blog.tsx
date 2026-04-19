import { useState, useEffect } from 'react';
import { PlusCircle, Image as ImageIcon, X, Loader2, AlertCircle, MessageSquare, Trash2, Tag } from 'lucide-react';
import { API_BASE } from '../config';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
}

const CATEGORIES = ['Todos', 'Oficial', 'Guías', 'Reseñas', 'Social', 'Estrategia'];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '', category: 'General' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check role
    const userData = localStorage.getItem('terra-user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') setIsAdmin(true);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'Todos') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category === activeCategory));
    }
  }, [posts, activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/blog`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
      }
    } catch (err) {
      setError('No se pudo cargar la bitácora.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    
    setSaving(true);
    setError('');
    const token = localStorage.getItem('terra-token');

    try {
      const res = await fetch(`${API_BASE}/blog`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      const data = await res.json();
      if (res.ok) {
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', imageUrl: '', category: 'General' });
        setShowForm(false);
      } else {
        setError(data.error || 'Error al publicar.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;
    const token = localStorage.getItem('terra-token');
    try {
      const res = await fetch(`${API_BASE}/blog/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1A2534] p-6 rounded-xl border border-[#BDA054]/30 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-[#E8C468] tracking-tight">Bitácora de Crew</h2>
          <p className="text-gray-400 mt-1">Comparte estrategias, reseñas y noticias con la crew.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#BDA054] hover:bg-[#C62828] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all border border-[#E8C468]/30 group"
        >
          {showForm ? <X size={20} /> : <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />}
          {showForm ? 'Cerrar' : 'Crear Publicación'}
        </button>
      </div>

      {/* --- Category Selector --- */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              activeCategory === cat 
                ? 'bg-[#E8C468] text-[#0A1526] border-[#E8C468] shadow-[0_0_15px_rgba(232,196,104,0.3)]' 
                : 'bg-[#0A1526]/50 text-gray-400 border-[#BDA054]/20 hover:border-[#BDA054]/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-[#0A1526]/80 p-8 rounded-2xl border-2 border-[#4EA0D8]/30 animate-scale-in space-y-6 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-[#4EA0D8] uppercase tracking-widest block mb-2">Título</label>
              <input 
                type="text" 
                className="w-full bg-[#1A2534] border border-[#BDA054]/30 rounded-xl text-white px-5 py-3 outline-none focus:border-[#4EA0D8] transition-all"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Título impactante..."
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4EA0D8] uppercase tracking-widest block mb-2">Sección / Categoría</label>
              <select 
                className="w-full bg-[#1A2534] border border-[#BDA054]/30 rounded-xl text-white px-5 py-3 outline-none focus:border-[#4EA0D8] transition-all appearance-none cursor-pointer"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                {CATEGORIES.slice(1).map(cat => (
                  <option key={cat} value={cat} disabled={cat === 'Oficial' && !isAdmin}>{cat} {cat === 'Oficial' ? '(Admin)' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#4EA0D8] uppercase tracking-widest block mb-2">Cuerpo del Mensaje</label>
            <textarea 
              className="w-full bg-[#1A2534] border border-[#BDA054]/30 rounded-xl text-white px-5 py-3 outline-none focus:border-[#4EA0D8] transition-all min-h-[150px] resize-none"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Comparte tu conocimiento o experiencia..."
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#4EA0D8] uppercase tracking-widest block mb-1 flex items-center gap-2">
              <ImageIcon size={16} /> URL de Imagen (Opcional)
            </label>
            <input 
              type="url" 
              className="w-full bg-[#1A2534] border border-[#BDA054]/30 rounded-xl text-white px-5 py-3 outline-none focus:border-[#4EA0D8] transition-all"
              value={newPost.imageUrl}
              onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
              placeholder="https://gbf.wiki/images/..."
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-[#4EA0D8] hover:bg-[#E8C468] hover:text-[#1A2534] text-white py-4 rounded-xl font-extrabold text-lg transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <PlusCircle size={24} />}
            {saving ? 'PROCESANDO...' : 'PUBLICAR EN LA BITÁCORA'}
          </button>
        </form>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="p-20 text-center text-[#E8C468]">
            <Loader2 className="animate-spin mx-auto mb-6" size={60} />
            <p className="font-black tracking-[0.3em] uppercase text-sm">Sincronizando Archivos...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-[#BDA054]/20 rounded-2xl bg-[#1A2534]/40">
            <p className="text-gray-500 text-lg font-medium italic">No hay entradas en esta sección todavía...</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              isAdmin={isAdmin} 
              onDelete={() => handleDeletePost(post._id)}
              isExpanded={expandedComments[post._id]}
              toggleExpanded={() => setExpandedComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({ post, isAdmin, onDelete, isExpanded, toggleExpanded }: { post: BlogPost, isAdmin: boolean, onDelete: () => void, isExpanded: boolean, toggleExpanded: () => void }) {
  return (
    <article className="bg-[#1A2534] border border-[#BDA054]/30 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#BDA054]/60 group relative">
      
      {isAdmin && (
        <button 
          onClick={onDelete}
          className="absolute top-4 right-4 p-2 bg-red-900/50 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800 hover:text-white z-10"
        >
          <Trash2 size={18} />
        </button>
      )}

      {post.imageUrl && (
        <div className="h-72 w-full overflow-hidden border-b border-[#BDA054]/20 relative">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2534] via-transparent to-transparent opacity-60"></div>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
            post.category === 'Oficial' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-[#4EA0D8]/10 text-[#4EA0D8] border-[#4EA0D8]/30'
          }`}>
            <Tag size={10} className="inline mr-1" /> {post.category}
          </span>
          <span className="text-xs text-gray-500 font-bold">{new Date(post.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {post.author}</span>
        </div>

        <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-[#E8C468] transition-colors">{post.title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg mb-8">{post.content}</p>
        
        <div className="pt-6 border-t border-[#BDA054]/10 flex justify-between items-center">
          <button 
            onClick={toggleExpanded}
            className="flex items-center gap-2 text-[#E8C468] font-bold text-sm hover:underline"
          >
            <MessageSquare size={18} />
            {isExpanded ? 'Ocultar Reseñas' : 'Ver Reseñas'}
          </button>
        </div>

        {isExpanded && <CommentSection postId={post._id} isAdmin={isAdmin} />}
      </div>
    </article>
  );
}

function CommentSection({ postId, isAdmin }: { postId: string, isAdmin: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE}/blog/${postId}/comments`);
      const data = await res.json();
      if (res.ok) setComments(data);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('terra-token');
    try {
      const res = await fetch(`${API_BASE}/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, data]);
        setNewComment('');
      }
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('¿Eliminar reseña?')) return;
    const token = localStorage.getItem('terra-token');
    try {
      const res = await fetch(`${API_BASE}/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  if (loading) return <div className="mt-4 text-xs text-gray-500 animate-pulse uppercase tracking-widest">Cargando reseñas...</div>;

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c._id} className="bg-[#0A1526]/40 p-4 rounded-xl border border-[#BDA054]/10 group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-[#E8C468] uppercase tracking-wide">{c.username}</span>
              <span className="text-[10px] text-gray-600 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-300 leading-normal">{c.content}</p>
            {isAdmin && (
              <button 
                onClick={() => handleDeleteComment(c._id)}
                className="absolute top-2 right-2 text-red-500/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handlePostComment} className="mt-6 flex gap-3">
        <input 
          type="text" 
          placeholder="Escribe una reseña o comentario..."
          className="flex-1 bg-[#0A1526] border border-[#BDA054]/20 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#4EA0D8] transition-all"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-[#4EA0D8] hover:bg-[#E8C468] hover:text-[#0A1526] text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
