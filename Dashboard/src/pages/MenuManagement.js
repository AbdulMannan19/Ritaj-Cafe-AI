import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const MenuManagement = ({ menuItems, categories = [], onMenuUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: categories[0] || '',
    description: '',
    price: '',
    is_available: true
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('menu')
      .insert([{
        ...newItem,
        price: parseFloat(newItem.price)
      }]);

    if (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } else {
      setNewItem({
        name: '',
        category: categories[0] || '',
        description: '',
        price: '',
        is_available: true
      });
      setShowAddForm(false);
      onMenuUpdate();
    }
  };

  const handleUpdateItem = async (id, updates) => {
    const { error } = await supabase
      .from('menu')
      .update(updates)
      .eq('item_id', id);

    if (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    } else {
      setEditingItem(null);
      onMenuUpdate();
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase
        .from('menu')
        .delete()
        .eq('item_id', id);

      if (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      } else {
        onMenuUpdate();
      }
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    await handleUpdateItem(id, { is_available: !currentStatus });
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h2>Menu Management</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add New Item
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4ade80', marginBottom: '1rem' }}>Add New Menu Item</h3>
          <form onSubmit={handleAddItem}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Price (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newItem.is_available}
                    onChange={(e) => setNewItem({...newItem, is_available: e.target.checked})}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Available
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-success">
                <Save size={16} style={{ marginRight: '0.5rem' }} />
                Add Item
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowAddForm(false)}
              >
                <X size={16} style={{ marginRight: '0.5rem' }} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.map(category => (
        <div key={category} className="card">
          <h3 style={{ color: '#4ade80', marginBottom: '1rem' }}>{category}</h3>
          {groupedItems[category].length === 0 ? (
            <p>No items in this category.</p>
          ) : (
            <div className="grid grid-3">
              {groupedItems[category].map(item => (
                <div key={item.item_id} className="card" style={{ margin: 0 }}>
                  {editingItem === item.item_id ? (
                    <EditItemForm
                      item={item}
                      categories={categories}
                      onSave={(updates) => handleUpdateItem(item.item_id, updates)}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#4ade80' }}>{item.name}</h4>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem',
                          backgroundColor: item.is_available ? 'rgba(74, 222, 128, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                          color: item.is_available ? '#4ade80' : '#dc3545',
                          border: `1px solid ${item.is_available ? '#4ade80' : '#dc3545'}`
                        }}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p style={{ marginBottom: '1rem', color: '#ccc' }}>{item.description}</p>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: '#4ade80' }}>{item.price} AED</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => setEditingItem(item.item_id)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className={`btn ${item.is_available ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleAvailability(item.item_id, item.is_available)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          {item.is_available ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteItem(item.item_id)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const EditItemForm = ({ item, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price.toString(),
    is_available: item.is_available
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="form-group">
        <label>Price ($)</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
            style={{ marginRight: '0.5rem' }}
          />
          Available
        </label>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" className="btn btn-success">
          <Save size={16} style={{ marginRight: '0.5rem' }} />
          Save
        </button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          <X size={16} style={{ marginRight: '0.5rem' }} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MenuManagement;