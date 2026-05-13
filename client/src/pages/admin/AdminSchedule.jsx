import { useState, useEffect } from 'react';
import { scheduleAPI } from '../../services/api';
import styles from './AdminSchedule.module.css';

const EMPTY = { label: '', start_time: '', end_time: '', date: '', status: 'active' };

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [filterDate, setFilterDate] = useState(today());

  function today() { return new Date().toISOString().split('T')[0]; }

  const fetchSchedules = async () => {
    try {
      const res = await scheduleAPI.getToday();
      setSchedules(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSchedules(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY, date: filterDate });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setForm({
      label: s.label,
      start_time: s.start_time?.slice(0, 5),
      end_time: s.end_time?.slice(0, 5),
      date: s.date?.slice(0, 10),
      status: s.status,
    });
    setEditId(s.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.start_time || !form.end_time || !form.date) return;
    setSaving(true);
    try {
      if (editId) {
        await scheduleAPI.update(editId, form);
      } else {
        await scheduleAPI.create(form);
      }
      await fetchSchedules();
      setShowModal(false);
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await scheduleAPI.delete(deleteId);
      await fetchSchedules();
    } catch {}
    finally { setDeleteId(null); }
  };

  const filtered = schedules.filter(s => s.date?.slice(0, 10) === filterDate);

  const STATUS_LABEL = { active: 'Active', break: 'Break', done: 'Done' };
  const STATUS_COLOR = { active: styles.dotActive, break: styles.dotBreak, done: styles.dotDone };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Schedule Manager</h1>
          <p className={styles.pageSub}>Manage daily cashier schedules shown on the dashboard</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          <PlusIcon /> Add Schedule
        </button>
      </div>

      {/* Date filter */}
      <div className={styles.toolbar}>
        <label className={styles.dateLabel}>
          <CalIcon />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className={styles.dateInput}
          />
        </label>
        <span className={styles.count}>{filtered.length} schedule{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Schedule list */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <CalEmptyIcon />
            <p>No schedules for this date</p>
            <button className={styles.emptyAddBtn} onClick={openAdd}>Add a schedule</button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Label</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className={styles.labelCell}>{s.label}</td>
                  <td className={styles.timeCell}>{s.start_time?.slice(0, 5)}</td>
                  <td className={styles.timeCell}>{s.end_time?.slice(0, 5)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['badge_' + s.status]}`}>
                      <span className={`${styles.dot} ${STATUS_COLOR[s.status]}`} />
                      {STATUS_LABEL[s.status] || s.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(s)}><EditIcon /></button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(s.id)}><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Edit Schedule' : 'Add Schedule'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><CloseIcon /></button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label>Label</label>
                <input
                  type="text"
                  placeholder="e.g. Morning Session"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  className={styles.input}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className={styles.input}
                >
                  <option value="active">Active</option>
                  <option value="break">Break</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className={styles.overlay} onClick={() => setDeleteId(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <TrashBigIcon />
            <h3>Delete Schedule?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.confirmBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className={styles.deleteBtnConfirm} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function CalIcon()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function EditIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function TrashIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function TrashBigIcon()  { return <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M10 11v6M14 11v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>; }
function CloseIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function CalEmptyIcon()  { return <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#cbd5e1" strokeWidth="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
