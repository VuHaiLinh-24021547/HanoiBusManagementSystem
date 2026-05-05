import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, UserCircle2 } from 'lucide-react';
import { getAccounts, addAccount, updateAccount, deleteAccount } from '../../lib/db';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ROLES = ['passenger', 'dispatcher', 'admin'];
const STATUSES = ['Active', 'Suspended'];

const roleColors = {
  passenger:  { bg: 'rgba(139,92,246,0.12)', text: '#7c3aed', border: '#c4b5fd' },
  dispatcher: { bg: 'rgba(249,115,22,0.12)', text: '#ea580c', border: '#fdba74' },
  admin:      { bg: 'rgba(16,185,129,0.12)',  text: '#059669', border: '#6ee7b7' },
};

const statusColors = {
  Active:    { bg: 'rgba(16,185,129,0.12)',  text: '#059669', border: '#6ee7b7' },
  Suspended: { bg: 'rgba(239,68,68,0.12)',   text: '#dc2626', border: '#fca5a5' },
};

/** Generates avatar initials + background color deterministically */
function getAvatarStyle(name = '', role = '') {
  const palettes = {
    passenger:  ['#10b981', '#34d399'],
    dispatcher: ['#f97316', '#fb923c'],
    admin:      ['#8b5cf6', '#a78bfa'],
    default:    ['#6366f1', '#818cf8'],
  };
  const [bg, ring] = palettes[role] || palettes.default;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return { bg, ring, initials: initials || '?' };
}

const Badge = ({ value, map }) => {
  const style = map[value?.toLowerCase?.()] || map[value] || {};
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        borderRadius: 20,
        padding: '3px 14px',
        fontSize: 13,
        fontWeight: 600,
        display: 'inline-block',
        textTransform: 'capitalize',
      }}
    >
      {value}
    </span>
  );
};

// ── Modal ─────────────────────────────────────────────────────────────────────

function UserModal({ mode, user, onClose, onSave }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(
    isEdit
      ? { name: user.name, email: user.email, role: user.role, status: user.status || 'Active', password: '' }
      : { name: '', email: '', role: 'passenger', status: 'Active', password: '' }
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!isEdit && !form.password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: errors[key] ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          background: '#f9fafb',
          transition: 'border 0.15s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
        onBlur={(e) => (e.target.style.borderColor = errors[key] ? '#ef4444' : '#e5e7eb')}
      />
      {errors[key] && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  const select = (label, key, options) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <select
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: '1.5px solid #e5e7eb',
          fontSize: 14,
          background: '#f9fafb',
          outline: 'none',
          boxSizing: 'border-box',
          cursor: 'pointer',
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff', borderRadius: 20, width: 460, maxWidth: '90vw',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {field('Full Name', 'name', 'text', 'e.g. Nguyen Van A')}
          {field('Email Address', 'email', 'email', 'e.g. user@example.com')}
          {!isEdit && field('Password', 'password', 'password', '••••••••')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {select('Role', 'role', ROLES)}
            {select('Status', 'status', STATUSES)}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 22px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                background: '#fff', fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px', borderRadius: 10, border: 'none',
                background: 'var(--color-primary)', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Check size={16} />
              {isEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────────

function ConfirmDialog({ user, onClose, onConfirm }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: 400, padding: 32, boxShadow: '0 25px 60px rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Trash2 size={24} color="#ef4444" />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Delete User</h3>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280' }}>
          Are you sure you want to delete <strong>{user?.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', user }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const loadUsers = () => {
    const accounts = getAccounts();
    // Ensure every account has a status field
    setUsers(accounts.map(a => ({ ...a, status: a.status || 'Active' })));
  };

  useEffect(() => { loadUsers(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      addAccount({ ...form });
      showToast('User added successfully');
    } else {
      updateAccount(modal.user.id, { ...form });
      showToast('User updated successfully');
    }
    loadUsers();
    setModal(null);
  };

  const handleDelete = () => {
    deleteAccount(deleteTarget.id);
    loadUsers();
    setDeleteTarget(null);
    showToast('User deleted', 'error');
  };

  const filtered = users.filter(
    (u) =>
      !u.deleted &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
       u.email?.toLowerCase().includes(search.toLowerCase()) ||
       u.role?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed', top: 24, right: 32, zIndex: 2000,
            background: toast.type === 'error' ? '#ef4444' : '#10b981',
            color: '#fff', borderRadius: 12, padding: '12px 24px',
            fontSize: 14, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'slideInRight 0.3s ease',
          }}
        >
          <Check size={16} />
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#111827' }}>User Management</h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>
            Manage passengers, dispatchers, and administrators.
          </p>
        </div>
        <button
          id="add-user-btn"
          onClick={() => setModal({ mode: 'add' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 12, padding: '11px 22px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          border: '1px solid #f3f4f6', overflow: 'hidden',
        }}
      >
        {/* Search + count bar */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              id="user-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              style={{
                width: '100%', padding: '10px 14px 10px 40px',
                border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14,
                outline: 'none', background: '#f9fafb', boxSizing: 'border-box',
                transition: 'border 0.15s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>
            Total: <strong style={{ color: '#111827' }}>{filtered.length}</strong> users
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['USER', 'ROLE', 'STATUS', 'ACTION'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '14px 24px', textAlign: col === 'ACTION' ? 'center' : 'left',
                      fontSize: 12, fontWeight: 700, color: '#6b7280',
                      letterSpacing: '0.06em', borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>
                    <UserCircle2 size={48} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: 15 }}>No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => {
                  const av = getAvatarStyle(user.name, user.role);
                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                      {/* User cell */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div
                            style={{
                              width: 44, height: 44, borderRadius: '50%',
                              background: av.bg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 15, fontWeight: 800, color: '#fff',
                              flexShrink: 0,
                              boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${av.ring}44`,
                            }}
                          >
                            {av.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{user.name}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '16px 24px' }}>
                        <Badge value={user.role} map={roleColors} />
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 24px' }}>
                        <Badge value={user.status || 'Active'} map={statusColors} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <button
                            id={`edit-user-${user.id}`}
                            onClick={() => setModal({ mode: 'edit', user })}
                            title="Edit user"
                            style={{
                              width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e5e7eb',
                              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#6b7280', transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(16,185,129,0.06)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = '#fff'; }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            id={`delete-user-${user.id}`}
                            onClick={() => setDeleteTarget(user)}
                            title="Delete user"
                            style={{
                              width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e5e7eb',
                              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#6b7280', transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fee2e2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = '#fff'; }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
