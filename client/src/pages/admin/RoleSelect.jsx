import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './RoleSelect.module.css';

export default function RoleSelect() {
  const { staffUser, studentUser } = useAuth();
  const navigate = useNavigate();

  if (staffUser) { navigate('/admin/app'); return null; }
  if (studentUser) { navigate('/student'); return null; }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#1e3a5f"/>
              <circle cx="24" cy="18" r="6" stroke="white" strokeWidth="2.5"/>
              <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M32 10l2 2 4-4" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.logoTitle}>CASHIER-Q</h1>
            <p className={styles.logoSub}>RESERVE</p>
          </div>
        </div>

        <h2 className={styles.welcome}>Welcome!</h2>
        <p className={styles.sub}>Please select your role to continue.</p>

        <div className={styles.roles}>
          {/* Student */}
          <div className={styles.roleCard} onClick={() => navigate('/login')}>
            <div className={styles.roleIcon + ' ' + styles.studentIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M6 10.5v5c0 2 2.686 3.5 6 3.5s6-1.5 6-3.5v-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="8" x2="22" y2="13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.roleTitle}>Student</h3>
            <p className={styles.roleDesc}>Reserve a queue slot and track your transaction.</p>
            <button className={styles.studentBtn}>Continue as Student</button>
          </div>

          {/* Admin */}
          <div className={styles.roleCard} onClick={() => navigate('/admin/login?role=admin')}>
            <div className={styles.roleIcon + ' ' + styles.adminIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="#10b981" strokeWidth="2"/>
                <path d="M12 8v4l3 3" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="2" fill="#10b981"/>
              </svg>
            </div>
            <h3 className={styles.roleTitle}>Admin</h3>
            <p className={styles.roleDesc}>Manage system settings, users and reports.</p>
            <button className={styles.adminBtn}>Continue as Admin</button>
          </div>
        </div>

        <p className={styles.footer}>© 2025 Cashier-Q Reserve. All rights reserved.</p>
      </div>
    </div>
  );
}
