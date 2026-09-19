import fs from 'fs';
const path = 'c:\\Users\\HP\\Desktop\\MED_ACCESS 2k26\\src\\pages\\auth\\RegisterPage.jsx';
let content = fs.readFileSync(path, 'utf8');

const indianStates = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

const hookSetupStart = "export const RegisterPage = () => {";
const returnStart = "  return (";

const newComponentLogic = `export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  
  const [step, setStep] = useState(1);
  const [roleSelection, setRoleSelection] = useState('patient');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [phoneTimer, setPhoneTimer] = useState(45);
  const [emailTimer, setEmailTimer] = useState(45);
  const [passwordStrength, setPasswordStrength] = useState({ length: false, uppercase: false, number: false, special: false });

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    defaultValues: { 
      name: '', email: '', password: '', confirmPassword: '', 
      dob: '', gender: '', age: '', bloodGroup: 'O+',
      phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
      storeName: '', licenseNumber: '', gstNumber: '', pharmacistName: '', storeAddress: '', storeContact: ''
    },
    mode: 'onChange'
  });

  const dob = watch('dob');
  const password = watch('password');

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let ageCalculated = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ageCalculated--;
      setValue('age', ageCalculated > 0 ? ageCalculated : '');
    }
  }, [dob, setValue]);

  useEffect(() => {
    setPasswordStrength({
      length: password?.length >= 8,
      uppercase: /[A-Z]/.test(password || ''),
      number: /[0-9]/.test(password || ''),
      special: /[^A-Za-z0-9]/.test(password || '')
    });
  }, [password]);

  useEffect(() => {
    let interval;
    if (step === 2 && phoneTimer > 0) interval = setInterval(() => setPhoneTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [step, phoneTimer]);

  useEffect(() => {
    let interval;
    if (step === 3 && emailTimer > 0) interval = setInterval(() => setEmailTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [step, emailTimer]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && termsAccepted) setStep(2);
  };

  const handlePhoneVerify = () => {
    setStep(3);
  };

  const handleEmailVerify = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, role: roleSelection };
      const loggedUser = await registerAuth(payload);
      setStep(4);
      setTimeout(() => {
        if (loggedUser.role === 'patient') navigate(ROUTES.PATIENT.DASHBOARD);
        else if (loggedUser.role === 'pharmacy') navigate(ROUTES.PHARMACY.DASHBOARD);
        else navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepper = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '15px', left: '10%', width: \`\${(step - 1) * 33.33}%\`, height: '2px', background: 'linear-gradient(90deg, #00C853, #00B0FF)', zIndex: 1, transition: 'width 0.3s ease' }}></div>
      
      {['Your Details', 'Verify Phone', 'Verify Email', 'Complete'].map((label, i) => {
        const stepNumber = i + 1;
        const isActive = step >= stepNumber;
        return (
          <div key={stepNumber} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: isActive ? 'linear-gradient(135deg, #00C853, #00B0FF)' : '#0f172a',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? '#000' : '#888', fontWeight: 'bold', fontSize: '14px',
              boxShadow: isActive ? '0 0 10px rgba(0, 200, 83, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {stepNumber}
            </div>
            <span style={{ fontSize: '0.75rem', color: isActive ? '#fff' : '#888', fontWeight: isActive ? '600' : '400', transition: 'all 0.3s ease' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );

`;



const newFormContent = `            {/* Multi-Step Register Form */}
            {renderStepper()}
            
            <form onSubmit={handleSubmit(handleEmailVerify)}>
              
              {/* ──────────────── STEP 1: YOUR DETAILS ──────────────── */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }} className="lp-custom-scrollbar">
                  
                  {/* Role Tabs */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => setRoleSelection('patient')} className={\`lp-tab\${roleSelection === 'patient' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', background: roleSelection === 'patient' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'patient' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Patient Registration</button>
                    <button type="button" onClick={() => setRoleSelection('pharmacy')} className={\`lp-tab\${roleSelection === 'pharmacy' ? ' active' : ''}\`} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', background: roleSelection === 'pharmacy' ? 'linear-gradient(135deg, #00C853, #00B0FF)' : 'rgba(255,255,255,0.05)', color: roleSelection === 'pharmacy' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Pharmacy Registration</button>
                  </div>

                  {/* PERSONAL INFO */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="lp-field" style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Full Name</label>
                        <div className="lp-input-wrap">
                          <input className={\`lp-input\${errors.name ? ' error' : ''}\`} type="text" placeholder="Enter your full name" {...register('name', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        {errors.name && <p className="lp-error">{errors.name.message}</p>}
                      </div>
                      
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Date of Birth</label>
                        <input className={\`lp-input\${errors.dob ? ' error' : ''}\`} type="date" {...register('dob', { required: 'Required' })} style={{ paddingLeft: '1rem', colorScheme: 'dark' }} />
                        {errors.dob && <p className="lp-error">{errors.dob.message}</p>}
                      </div>

                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Gender (Optional)</label>
                        <select className="lp-input" {...register('gender')} style={{ paddingLeft: '1rem', appearance: 'none', background: 'rgba(255,255,255,0.05)' }}>
                          <option value="" style={{color: '#000'}}>Select Gender</option>
                          <option value="Male" style={{color: '#000'}}>Male</option>
                          <option value="Female" style={{color: '#000'}}>Female</option>
                          <option value="Other" style={{color: '#000'}}>Other</option>
                        </select>
                      </div>

                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Age</label>
                        <input className="lp-input" type="number" readOnly placeholder="Auto-calculated" {...register('age')} style={{ paddingLeft: '1rem', opacity: 0.7, background: 'rgba(0,0,0,0.2)' }} />
                      </div>

                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Blood Group</label>
                        <select className="lp-input" {...register('bloodGroup')} style={{ paddingLeft: '1rem', appearance: 'none', background: 'rgba(255,255,255,0.05)' }}>
                          <option value="A+" style={{color: '#000'}}>A+</option><option value="A-" style={{color: '#000'}}>A-</option>
                          <option value="B+" style={{color: '#000'}}>B+</option><option value="B-" style={{color: '#000'}}>B-</option>
                          <option value="AB+" style={{color: '#000'}}>AB+</option><option value="AB-" style={{color: '#000'}}>AB-</option>
                          <option value="O+" style={{color: '#000'}}>O+</option><option value="O-" style={{color: '#000'}}>O-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Email Address</label>
                        <div className="lp-input-wrap">
                          <input className={\`lp-input\${errors.email ? ' error' : ''}\`} type="email" placeholder="Enter email" {...register('email', { required: 'Required', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' } })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        {errors.email && <p className="lp-error">{errors.email.message}</p>}
                      </div>
                      
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Phone Number</label>
                        <div className="lp-input-wrap" style={{ display: 'flex' }}>
                          <select className="lp-input" style={{ width: '80px', padding: '0 0.5rem', borderRight: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px 0 0 12px', background: 'rgba(255,255,255,0.05)', appearance: 'none' }}>
                            <option value="+91" style={{color: '#000'}}>🇮🇳 +91</option>
                          </select>
                          <input className={\`lp-input\${errors.phone ? ' error' : ''}\`} type="tel" placeholder="Phone number" {...register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10 digits required' } })} style={{ borderRadius: '0 12px 12px 0', borderLeft: 'none', paddingLeft: '0.8rem', flex: 1 }} />
                        </div>
                        {errors.phone && <p className="lp-error">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS INFO */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Address Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="lp-field" style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Address Line 1</label>
                        <input className={\`lp-input\${errors.addressLine1 ? ' error' : ''}\`} type="text" placeholder="House No., Building, Street" {...register('addressLine1', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        {errors.addressLine1 && <p className="lp-error">{errors.addressLine1.message}</p>}
                      </div>
                      <div className="lp-field" style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Address Line 2 (Optional)</label>
                        <input className="lp-input" type="text" placeholder="Apartment, Area, Landmark" {...register('addressLine2')} style={{ paddingLeft: '1rem' }} />
                      </div>
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>City</label>
                        <input className={\`lp-input\${errors.city ? ' error' : ''}\`} type="text" placeholder="Enter your city" {...register('city', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        {errors.city && <p className="lp-error">{errors.city.message}</p>}
                      </div>
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>State</label>
                        <select className={\`lp-input\${errors.state ? ' error' : ''}\`} {...register('state', { required: 'Required' })} style={{ paddingLeft: '1rem', appearance: 'none', background: 'rgba(255,255,255,0.05)' }}>
                          <option value="" style={{color: '#000'}}>Select your state</option>
                          ${indianStates.map(s => `<option value="${s}" style={{color: '#000'}}>${s}</option>`).join('')}
                        </select>
                        {errors.state && <p className="lp-error">{errors.state.message}</p>}
                      </div>
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Pincode</label>
                        <input className={\`lp-input\${errors.pincode ? ' error' : ''}\`} type="text" placeholder="Enter pincode" {...register('pincode', { required: 'Required', pattern: { value: /^[0-9]{6}$/, message: 'Invalid pin' } })} style={{ paddingLeft: '1rem' }} />
                        {errors.pincode && <p className="lp-error">{errors.pincode.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* PHARMACY FIELDS */}
                  {roleSelection === 'pharmacy' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Pharmacy Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="lp-field">
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Pharmacy Name</label>
                          <input className={\`lp-input\${errors.storeName ? ' error' : ''}\`} type="text" placeholder="Store Name" {...register('storeName', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        <div className="lp-field">
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Drug License Number</label>
                          <input className={\`lp-input\${errors.licenseNumber ? ' error' : ''}\`} type="text" placeholder="License No" {...register('licenseNumber', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        <div className="lp-field">
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>GST Number</label>
                          <input className={\`lp-input\${errors.gstNumber ? ' error' : ''}\`} type="text" placeholder="GST Number" {...register('gstNumber', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        <div className="lp-field">
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Pharmacist Name</label>
                          <input className={\`lp-input\${errors.pharmacistName ? ' error' : ''}\`} type="text" placeholder="Pharmacist Name" {...register('pharmacistName', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        <div className="lp-field" style={{ gridColumn: '1 / span 2' }}>
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Store Address</label>
                          <input className={\`lp-input\${errors.storeAddress ? ' error' : ''}\`} type="text" placeholder="Store Address" {...register('storeAddress', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                        <div className="lp-field">
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Store Contact Number</label>
                          <input className={\`lp-input\${errors.storeContact ? ' error' : ''}\`} type="tel" placeholder="Contact No" {...register('storeContact', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECURITY INFO */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Security</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Create Password</label>
                        <div className="lp-input-wrap">
                          <input className={\`lp-input\${errors.password ? ' error' : ''}\`} type={showPass ? 'text' : 'password'} placeholder="Enter password" {...register('password', { required: 'Required' })} style={{ paddingLeft: '1rem' }} />
                          <button type="button" className="lp-input-icon-right" onClick={() => setShowPass(p => !p)}>
                            <IconEye show={showPass} />
                          </button>
                        </div>
                        {errors.password && <p className="lp-error">{errors.password.message}</p>}
                      </div>
                      
                      <div className="lp-field">
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px', display: 'block' }}>Confirm Password</label>
                        <div className="lp-input-wrap">
                          <input className={\`lp-input\${errors.confirmPassword ? ' error' : ''}\`} type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm your password" {...register('confirmPassword', { 
                            required: 'Required',
                            validate: val => val === watch('password') || 'Passwords do not match'
                          })} style={{ paddingLeft: '1rem' }} />
                          <button type="button" className="lp-input-icon-right" onClick={() => setShowConfirmPass(p => !p)}>
                            <IconEye show={showConfirmPass} />
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="lp-error">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>

                    {/* Password Strength */}
                    <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Password must contain:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem' }}>
                        <div style={{ color: passwordStrength.length ? '#00C853' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: \`1px solid \${passwordStrength.length ? '#00C853' : '#64748b'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {passwordStrength.length && <div style={{ width: '6px', height: '6px', background: '#00C853', borderRadius: '50%' }}></div>}
                          </div>
                          At least 8 characters
                        </div>
                        <div style={{ color: passwordStrength.uppercase ? '#00C853' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: \`1px solid \${passwordStrength.uppercase ? '#00C853' : '#64748b'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {passwordStrength.uppercase && <div style={{ width: '6px', height: '6px', background: '#00C853', borderRadius: '50%' }}></div>}
                          </div>
                          One uppercase letter
                        </div>
                        <div style={{ color: passwordStrength.number ? '#00C853' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: \`1px solid \${passwordStrength.number ? '#00C853' : '#64748b'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {passwordStrength.number && <div style={{ width: '6px', height: '6px', background: '#00C853', borderRadius: '50%' }}></div>}
                          </div>
                          One number
                        </div>
                        <div style={{ color: passwordStrength.special ? '#00C853' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: \`1px solid \${passwordStrength.special ? '#00C853' : '#64748b'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {passwordStrength.special && <div style={{ width: '6px', height: '6px', background: '#00C853', borderRadius: '50%' }}></div>}
                          </div>
                          One special character
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TERMS & CTA */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#00C853' }} />
                      <span>I agree to the <span style={{ color: '#00B0FF' }}>Terms & Conditions</span> and <span style={{ color: '#00B0FF' }}>Privacy Policy</span></span>
                    </label>
                  </div>

                  <button type="button" onClick={handleNext} className="lp-cta-btn" disabled={!termsAccepted || !passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.number || !passwordStrength.special} style={{ marginTop: '0.5rem' }}>
                    Continue
                  </button>
                </div>
              )}

              {/* ──────────────── STEP 2: VERIFY PHONE ──────────────── */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem 1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Verify with OTP</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enter OTP sent to <span style={{ color: '#00C853' }}>+91 {watch('phone')}</span></p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '1rem 0' }}>
                    {phoneOtp.map((digit, idx) => (
                      <input key={idx} type="text" maxLength={1} value={digit}
                        onChange={(e) => {
                          const newOtp = [...phoneOtp];
                          newOtp[idx] = e.target.value;
                          setPhoneOtp(newOtp);
                          if (e.target.value && idx < 5) document.getElementById(\`p-otp-\${idx+1}\`)?.focus();
                        }}
                        id={\`p-otp-\${idx}\`}
                        style={{ width: '40px', height: '45px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '1.2rem' }}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: phoneTimer > 0 ? '#94a3b8' : '#00C853', cursor: phoneTimer === 0 ? 'pointer' : 'default' }} onClick={() => phoneTimer === 0 && setPhoneTimer(45)}>
                    {phoneTimer > 0 ? \`Resend OTP in 00:\${phoneTimer.toString().padStart(2, '0')}\` : 'Resend OTP'}
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setStep(1)} className="lp-btn-ghost" style={{ flex: 1 }}>Back</button>
                    <button type="button" onClick={handlePhoneVerify} className="lp-cta-btn" style={{ flex: 2 }} disabled={phoneOtp.join('').length < 6}>
                      Verify Phone
                    </button>
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 3: VERIFY EMAIL ──────────────── */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem 1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Verify Email Address</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enter verification code sent to <span style={{ color: '#00C853' }}>{watch('email')}</span></p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '1rem 0' }}>
                    {emailOtp.map((digit, idx) => (
                      <input key={idx} type="text" maxLength={1} value={digit}
                        onChange={(e) => {
                          const newOtp = [...emailOtp];
                          newOtp[idx] = e.target.value;
                          setEmailOtp(newOtp);
                          if (e.target.value && idx < 5) document.getElementById(\`e-otp-\${idx+1}\`)?.focus();
                        }}
                        id={\`e-otp-\${idx}\`}
                        style={{ width: '40px', height: '45px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '1.2rem' }}
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: emailTimer > 0 ? '#94a3b8' : '#00C853', cursor: emailTimer === 0 ? 'pointer' : 'default' }} onClick={() => emailTimer === 0 && setEmailTimer(45)}>
                    {emailTimer > 0 ? \`Resend Code in 00:\${emailTimer.toString().padStart(2, '0')}\` : 'Resend Code'}
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setStep(2)} className="lp-btn-ghost" style={{ flex: 1 }}>Back</button>
                    <button type="submit" className="lp-cta-btn" style={{ flex: 2 }} disabled={emailOtp.join('').length < 6 || submitting}>
                      {submitting ? <div className="lp-loader"><span /><span /><span /></div> : 'Complete Registration'}
                    </button>
                  </div>
                </div>
              )}

              {/* ──────────────── STEP 4: COMPLETE ──────────────── */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', padding: '3rem 1rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C853, #00B0FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 200, 83, 0.4)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '1rem' }}>Registration Successful!</h3>
                  <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>Welcome to MedAccess. Redirecting you securely...</p>
                  <div className="lp-loader" style={{ marginTop: '1rem' }}><span /><span /><span /></div>
                </div>
              )}

            </form>
            `;

// Rename component
content = content.replace('export const LoginPage = () => {', 'export const RegisterPage = () => {');
content = content.replace('export default LoginPage;', 'export default RegisterPage;');

const startIndex = content.indexOf(hookSetupStart);
const endIndex = content.indexOf("  return (", startIndex);
const oldComponent = content.substring(startIndex, endIndex);
content = content.replace(oldComponent, newComponentLogic);

const loginFormStart = "            {/* Login Form */}";
const loginFormEnd = "              </form>\n            )}";
const formOriginalContent = content.substring(content.indexOf(loginFormStart), content.indexOf(loginFormEnd) + loginFormEnd.length);
content = content.replace(formOriginalContent, newFormContent);

let appendStyles = "/* ── Global Settings ── */\\n";
appendStyles += ".lp-custom-scrollbar::-webkit-scrollbar { width: 6px; }\\n";
appendStyles += ".lp-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }\\n";
appendStyles += ".lp-custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }\\n";
appendStyles += ".lp-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }";

if (!content.includes('.lp-custom-scrollbar')) {
  content = content.replace('/* ── Global Settings ── */', appendStyles);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Advanced RegisterPage built successfully.');
