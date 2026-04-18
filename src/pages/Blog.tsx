import { useState } from 'react';
import { PlusCircle, Image as ImageIcon, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      imageUrl: newPost.imageUrl,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', imageUrl: '' });
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center bg-[#1A2534] p-6 rounded-xl border border-[#BDA054]/30">
        <div>
          <h2 className="text-3xl font-bold text-[#E8C468] tracking-wide">Bitácora de Crew</h2>
          <p className="text-gray-400 mt-2">Noticias, estrategias y anuncios.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#BDA054] hover:bg-[#C62828] text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(163,50,11,0.5)] transition-all border border-[#E8C468]/30"
        >
          {showForm ? <X size={20} /> : <PlusCircle size={20} />}
          {showForm ? 'Cancelar' : 'Nuevo Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-[#0A1526] p-6 rounded-xl border border-[#4EA0D8]/50 animate-fade-in space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Título de la Publicación</label>
            <input 
              type="text" 
              className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-2 outline-none focus:border-[#E8C468] transition-colors"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="Ej: Estrategia para Elemento Viento"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Cuerpo del Mensaje</label>
            <textarea 
              className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-2 outline-none focus:border-[#E8C468] transition-colors min-h-[120px]"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Escribe el contenido aquí..."
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1 flex items-center gap-2">
              <ImageIcon size={16} /> URL de Imagen (Opcional - Simula subida)
            </label>
            <input 
              type="url" 
              className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-2 outline-none focus:border-[#E8C468] transition-colors"
              value={newPost.imageUrl}
              onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <button type="submit" className="bg-[#4EA0D8] hover:bg-[#E8C468] hover:text-[#1A2534] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg">
            Publicar
          </button>
        </form>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-[#BDA054]/30 rounded-xl bg-[#1A2534]/40">
            <p className="text-gray-400">No hay entradas en la bitácora todavía...</p>
          </div>
        ) : (
          posts.map(post => (
            <article key={post.id} className="bg-[#1A2534]/80 backdrop-blur-sm border border-[#BDA054]/30 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 duration-300">
              {post.imageUrl && (
                <div className="h-64 w-full overflow-hidden border-b border-[#BDA054]/30">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs text-[#E8C468] font-semibold mb-2">{post.date} • Admin</div>
                <h3 className="text-2xl font-bold text-white mb-4">{post.title}</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
