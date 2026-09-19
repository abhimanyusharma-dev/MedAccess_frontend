import fs from 'fs';
const path = 'c:\\Users\\HP\\Desktop\\MED_ACCESS 2k26\\src\\pages\\auth\\RegisterPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Rename component
content = content.replace('export const LoginPage = () => {', 'export const RegisterPage = () => {');
content = content.replace('export default LoginPage;', 'export default RegisterPage;');

// Replace the hook setup
const oldHooks = `  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const videoRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const from = location.state?.from?.pathname || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loggedUser = await login(data.email, data.password);
      if (from) { navigate(from, { replace: true }); return; }
      if (loggedUser.role === 'patient') navigate(ROUTES.PATIENT.DASHBOARD);
      else if (loggedUser.role === 'pharmacy') navigate(ROUTES.PHARMACY.DASHBOARD);
      else if (loggedUser.role === 'admin') navigate(ROUTES.ADMIN.DASHBOARD);
      else navigate(ROUTES.LANDING);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };`;

const newHooks = `  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('register'); // default to register
  const [roleSelection, setRoleSelection] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const videoRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', storeName: '', licenseNumber: '', address: '', age: '', bloodGroup: 'O+' }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, role: roleSelection };
      const loggedUser = await registerAuth(payload);
      if (loggedUser.role === 'patient') navigate(ROUTES.PATIENT.DASHBOARD);
      else if (loggedUser.role === 'pharmacy') navigate(ROUTES.PHARMACY.DASHBOARD);
      else if (loggedUser.role === 'admin') navigate(ROUTES.ADMIN.DASHBOARD);
      else navigate(ROUTES.LANDING);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };`;
content = content.replace(oldHooks, newHooks);

// Replace Tabs block to navigate instead of setting tab for Login
const oldTabs = `{/* Tabs */}
            <div className="lp-tabs">
              <button className={\`lp-tab\${activeTab === 'login' ? ' active' : ''}\`} onClick={() => setActiveTab('login')}>
                <IconUser /> Login
              </button>
              <button className={\`lp-tab\${activeTab === 'register' ? ' active' : ''}\`} onClick={() => setActiveTab('register')}>
                <IconPlus /> Register
              </button>
            </div>`;
const newTabs = `{/* Tabs */}
            <div className="lp-tabs">
              <button type="button" className={\`lp-tab\${activeTab === 'login' ? ' active' : ''}\`} onClick={() => navigate('/login')}>
                <IconUser /> Login
              </button>
              <button type="button" className={\`lp-tab\${activeTab === 'register' ? ' active' : ''}\`} onClick={() => setActiveTab('register')}>
                <IconPlus /> Register
              </button>
            </div>`;
content = content.replace(oldTabs, newTabs);

// Replace Login form block with Register form block
const loginStart = `            {/* Login Form */}`;
const loginEnd = `              </form>
            )}`;
const loginFormChunk = content.substring(content.indexOf(loginStart), content.indexOf(loginEnd) + loginEnd.length);

const registerFormChunk = `{/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  <button type="button" onClick={() => setRoleSelection('patient')} className={\`lp-tab\${roleSelection === 'patient' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem', background: roleSelection === 'patient' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'patient' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Patient</button>
                  <button type="button" onClick={() => setRoleSelection('pharmacy')} className={\`lp-tab\${roleSelection === 'pharmacy' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem', background: roleSelection === 'pharmacy' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'pharmacy' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Pharmacy</button>
                </div>
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconUser /></span>
                    <input className={\`lp-input\${errors.name ? ' error' : ''}\`} type="text" placeholder="Full Name" {...register('name', { required: 'Required' })} />
                  </div>
                  {errors.name && <p className="lp-error">{errors.name.message}</p>}
                </div>
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconMail /></span>
                    <input className={\`lp-input\${errors.email ? ' error' : ''}\`} type="email" placeholder="Email" {...register('email', { required: 'Required', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' } })} />
                  </div>
                  {errors.email && <p className="lp-error">{errors.email.message}</p>}
                </div>
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconLock /></span>
                    <input className={\`lp-input\${errors.password ? ' error' : ''}\`} type={showPass ? 'text' : 'password'} placeholder="Password (Min 6)" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6' } })} />
                    <button type="button" className="lp-input-icon-right" onClick={() => setShowPass(p => !p)}>
                      <IconEye show={showPass} />
                    </button>
                  </div>
                  {errors.password && <p className="lp-error">{errors.password.message}</p>}
                </div>
                {roleSelection === 'patient' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                    <input className="lp-input" type="number" placeholder="Age" {...register('age', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    <select className="lp-input" {...register('bloodGroup')} style={{ paddingLeft: '1rem', appearance: 'none' }}>
                      <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                    <input className="lp-input" type="text" placeholder="Store Name" {...register('storeName', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    <input className="lp-input" type="text" placeholder="License No" {...register('licenseNumber', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    <input className="lp-input" type="text" placeholder="Address" {...register('address', { required: 'Required' })} style={{ gridColumn: '1 / span 2', paddingLeft: '1rem' }} />
                  </div>
                )}
                <button type="submit" className="lp-cta-btn" disabled={submitting}>
                  {submitting ? <div className="lp-loader"><span /><span /><span /></div> : 'Create Account'}
                </button>
              </form>
            )}`;
content = content.replace(loginFormChunk, registerFormChunk);

// Replace the "Register redirect" block completely (remove it)
const redirectStart = `            {/* Register redirect */}`;
const redirectEnd = `            )}

            {activeTab === 'login' && (`;
const redirectChunk = content.substring(content.indexOf(redirectStart), content.indexOf(redirectEnd) + redirectEnd.length);
content = content.replace(redirectChunk, '');

// Replace Switch link so it goes to Login instead
const oldSwitchLink = `<div className="lp-switch-link">
              <p>
                {activeTab === 'login'
                  ? <>Don't have an account? <Link to="/register">Register</Link></>
                  : <>Already have an account? <a href="#" onClick={e => { e.preventDefault(); setActiveTab('login'); }}>Login</a></>
                }
              </p>
            </div>`;
const newSwitchLink = `<div className="lp-switch-link">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>`;
content = content.replace(oldSwitchLink, newSwitchLink);

// Replace title and sub
content = content.replace('<h2 className="lp-auth-title">Get Started</h2>', '<h2 className="lp-auth-title">Create Node</h2>');
content = content.replace('<p className="lp-auth-sub">Login to your account or create a new one to continue</p>', '<p className="lp-auth-sub">Initialize a new patient or pharmacy account</p>');

fs.writeFileSync(path, content, 'utf8');
console.log('RegisterPage updated cleanly!');
