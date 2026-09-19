import fs from 'fs';

const path = 'c:\\Users\\HP\\Desktop\\MED_ACCESS 2k26\\src\\pages\\auth\\RegisterPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Rename component
content = content.replace('export const LoginPage = () => {', 'export const RegisterPage = () => {');
content = content.replace('export default LoginPage;', 'export default RegisterPage;');

// 2. Update hooks and state
const hooksRegex = /const \{ login \} = useAuth\(\);[\s\S]*?const onSubmit = async \(data\) => \{[\s\S]*?finally \{\s*setSubmitting\(false\);\s*\}\s*\};/m;
const newHooks = `const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [roleSelection, setRoleSelection] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const videoRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', storeName: '', licenseNumber: '', address: '', age: '', bloodGroup: 'O+' }
  });

  const from = location.state?.from?.pathname || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, role: roleSelection };
      const loggedUser = await registerAuth(payload);
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
content = content.replace(hooksRegex, newHooks);

// 3. Update tabs logic
content = content.replace(
  `onClick={() => setActiveTab('login')}`,
  `onClick={() => navigate('/login')}`
);

// 4. Form replace: 
// Replace {activeTab === 'login' && (...)} with {activeTab === 'register' && (...)} and the registration form logic
const loginFormRegex = /\{\/\* Login Form \*\/\}\s*\{activeTab === 'login' && \([\s\S]*?\)\}/m;
const registerFormStr = `{/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Role Tabs for Register */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                  <button type="button" onClick={() => setRoleSelection('patient')} className={\`lp-tab\${roleSelection === 'patient' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem', background: roleSelection === 'patient' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'patient' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Patient</button>
                  <button type="button" onClick={() => setRoleSelection('pharmacy')} className={\`lp-tab\${roleSelection === 'pharmacy' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem', background: roleSelection === 'pharmacy' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'pharmacy' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Pharmacy</button>
                </div>

                {/* Name */}
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconUser /></span>
                    <input className={\`lp-input\${errors.name ? ' error' : ''}\`} type="text" placeholder="Full Name" {...register('name', { required: 'Name is required' })} />
                  </div>
                  {errors.name && <p className="lp-error">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconMail /></span>
                    <input className={\`lp-input\${errors.email ? ' error' : ''}\`} type="email" placeholder="Email Address" {...register('email', { required: 'Email is required', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' } })} />
                  </div>
                  {errors.email && <p className="lp-error">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="lp-field">
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IconLock /></span>
                    <input className={\`lp-input\${errors.password ? ' error' : ''}\`} type={showPass ? 'text' : 'password'} placeholder="Password (Min 6 chars)" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} />
                    <button type="button" className="lp-input-icon-right" onClick={() => setShowPass(p => !p)}>
                      <IconEye show={showPass} />
                    </button>
                  </div>
                  {errors.password && <p className="lp-error">{errors.password.message}</p>}
                </div>

                {/* Specific Fields */}
                {roleSelection === 'patient' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="lp-field">
                      <input className={\`lp-input\${errors.age ? ' error' : ''}\`} type="number" placeholder="Age" {...register('age', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div className="lp-field">
                      <select className="lp-input" {...register('bloodGroup')} style={{ paddingLeft: '1rem', appearance: 'none' }}>
                        <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="lp-field">
                      <input className={\`lp-input\${errors.storeName ? ' error' : ''}\`} type="text" placeholder="Store Name" {...register('storeName', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div className="lp-field">
                      <input className={\`lp-input\${errors.licenseNumber ? ' error' : ''}\`} type="text" placeholder="License No" {...register('licenseNumber', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div className="lp-field" style={{ gridColumn: '1 / span 2' }}>
                      <input className={\`lp-input\${errors.address ? ' error' : ''}\`} type="text" placeholder="Address" {...register('address', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button type="submit" className="lp-cta-btn" disabled={submitting} style={{ marginTop: '0.5rem' }}>
                  {submitting ? (
                    <div className="lp-loader">
                      <span /><span /><span />
                    </div>
                  ) : 'Create Account'}
                </button>
              </form>
            )}`;
content = content.replace(loginFormRegex, registerFormStr);

// 5. Remove the Register redirect block completely
const registerRedirectRegex = /\{\/\* Register redirect \*\/\}\s*\{activeTab === 'register' && \([\s\S]*?\)\}/m;
content = content.replace(registerRedirectRegex, '');

// 6. Fix "Already have an account?" link
content = content.replace(`onClick={e => { e.preventDefault(); setActiveTab('login'); }}`, `onClick={e => { e.preventDefault(); navigate('/login'); }}`);

fs.writeFileSync(path, content, 'utf8');
console.log('RegisterPage updated successfully');
