import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Edit2, Save, X, Image as ImageIcon } from 'lucide-react';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    price: 0,
    description: '',
    status: 'available',
    features: ''
  });

  // 1. Fetch Rooms from Database
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rooms').select('*').order('price', { ascending: true });
    if (!error) setRooms(data);
    setLoading(false);
  };

  // 2. Open Edit Mode
  const handleEditClick = (room) => {
    setEditingRoom(room.id);
    setFormData({
      price: room.price,
      description: room.description,
      status: room.status,
      // Convert JSON array to comma-separated string for easy editing
      features: room.features ? room.features.join(', ') : '' 
    });
  };

  // 3. Save Changes to Database
  const handleSave = async (roomId) => {
    // Convert comma-separated string back to a JSON array
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);

    const { error } = await supabase
      .from('rooms')
      .update({
        price: formData.price,
        description: formData.description,
        status: formData.status,
        features: featuresArray
      })
      .eq('id', roomId);

    if (error) {
      alert('Error updating room: ' + error.message);
    } else {
      alert('Room updated successfully!');
      setEditingRoom(null);
      fetchRooms(); // Refresh the list
    }
  };

  if (loading) return <div className="p-8 text-forest-text">Loading rooms...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-forest-primary">Manage Rooms</h1>
        <p className="text-forest-text/70">Update prices, descriptions, and statuses live.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-forest-secondary/20">
            
            {/* --- VIEW MODE --- */}
            {editingRoom !== room.id ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-forest-text">{room.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {room.status.toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleEditClick(room)}
                    className="p-2 text-forest-secondary hover:bg-forest-secondary/10 rounded-lg transition"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
                
                <p className="text-forest-text/80 mb-4 h-12 overflow-hidden">{room.description}</p>
                
                <div className="flex justify-between items-center border-t border-forest-secondary/20 pt-4">
                  <span className="text-lg font-bold text-forest-primary">${room.price.toFixed(2)} / night</span>
                  <span className="text-sm text-forest-text/60">Capacity: {room.capacity} Guests</span>
                </div>
              </>
            ) : (
              
            /* --- EDIT MODE --- */
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-forest-primary">Editing: {room.name}</h3>
                  <button onClick={() => setEditingRoom(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest-text mb-1">Price ($)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-forest-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest-text mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-forest-primary"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-text mb-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded h-20 focus:ring-2 focus:ring-forest-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-text mb-1">Features (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Free Wi-Fi, Balcony, Mini-bar"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-forest-primary"
                  />
                </div>

                {/* Placeholder for Supabase Storage Image Upload */}
                <div className="flex items-center gap-3 p-3 bg-forest-bg/50 rounded border border-dashed border-forest-secondary">
                  <ImageIcon size={20} className="text-forest-secondary" />
                  <span className="text-sm text-forest-text/80">Image upload (Connects to Supabase Storage Bucket)</span>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => handleSave(room.id)}
                    className="flex items-center gap-2 bg-forest-primary hover:bg-forest-primary/90 text-white px-4 py-2 rounded shadow transition"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}