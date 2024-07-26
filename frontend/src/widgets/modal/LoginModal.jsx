import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../features/auth/LoginInstance';
import { signup } from '../../features/auth/SignupInstance';
import useGlobalStore from '../../shared/store/GlobalStore';
import { ToastContainer, toast } from 'react-toastify';
import Tooltip from '../tooltip/Tooltip';
import ResendEmailModal from './ResendEmailModal';
import 'react-toastify/dist/ReactToastify.css';
import './LoginModal.scss';


const LoginModal = ({ onClose }) => {
    const [isLoginFormActive, setLoginFormActive] = useState(true);
    const [inputs, setInputs] = useState({
        loginEmail: '',
        loginPassword: '',
        signupNickname: '',
        signupEmail: '',
        signupPassword1: '',
        signupPassword2: ''
    });
    const [errors, setErrors] = useState({});
    const { isLoading, setIsLoading, error, setError } = useGlobalStore(state => state);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const navigate = useNavigate();
    const [showResendEmailModal, setShowResendEmailModal] = useState(false);
    const [tooltip, setTooltip] = useState({
        loginEmail: false,
        loginPassword: false,
        signupEmail: false,
        signupPassword: false,
        signupPassword2: false,
    });
    const [inputValidities, setInputValidities] = useState({
        loginEmail: false,
        loginPassword: false,
        signupEmail: false,
        signupPassword: false,
        signupPassword2: false
    });


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (signupSuccess) {
            toast.success("An email verification has been sent to you, please check it.");
        }
    }, [signupSuccess]);

    useEffect(() => {
        if (typeof error === 'string' && error.includes('Email is not verified.')) {
            setShowResendEmailModal(true);
        }
    }, [error]);



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
        validateInput(name, value);
    };
    const validateInput = (name, value) => {
        let isValid = false;
        if (name === 'loginEmail' || name === 'signupEmail') {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (name === 'loginPassword' || name === 'signupPassword1') {
            const hasLowercase = /[a-z]/.test(value);
            const hasUppercase = /[A-Z]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const validConditions = [hasLowercase, hasUppercase, hasSpecial].filter(Boolean).length >= 2;
            isValid = value.length >= 8 && validConditions;
        } else if (name === 'signupPassword2') {
            isValid = value === inputs.signupPassword1;
        }
        setInputValidities({ ...inputValidities, [name]: isValid });
        setTooltip({ ...tooltip, [name]: true });
    };


    const handleSubmit = async (event, type) => {
        event.preventDefault();
        setErrors({});
        setError(null);
        setIsLoading(true)

        try {
            if (type === 'login') {
                await login(inputs.loginEmail, inputs.loginPassword);
                navigate('/');
            } else {
                if (inputs.signupPassword1 !== inputs.signupPassword2) {
                    setErrors({ signupPassword2: 'Passwords do not match' });
                    toast.error('Passwords do not match');
                    return;
                }
                const response = await signup(inputs.signupEmail, inputs.signupPassword1, inputs.signupPassword2, inputs.signupNickname);
                if (response.errors) {
                    setErrors(response.errors);
                    Object.values(response.errors).flat().forEach(msg => toast.error(msg));
                } else {
                    setSignupSuccess(true);
                    setLoginFormActive(true);
                }
            }
        } catch (err) {
            console.log("err:", err)
            console.error(type === 'login' ? 'Login error:' : 'Signup error:', err);
            toast.error(`${err}`);
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div className="modalOverlay">
            <ToastContainer />
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="user_options-container">
                    <div className={`user_options-text ${isLoginFormActive ? '' : 'slide-out'}`}>
                        <div className="user_options-unregistered">
                            <h2 className="user_unregistered-title">Don't have an account?</h2>
                            <p className="user_unregistered-text">Sign up to join our community!</p>
                            <button className="user_unregistered-signup" onClick={() => setLoginFormActive(false)}>SIGN UP</button>
                        </div>
                        <div className="user_options-registered">
                            <h2 className="user_registered-title">Have an account?</h2>
                            <p className="user_registered-text">Log in to continue.</p>
                            <button className="user_registered-login" onClick={() => setLoginFormActive(true)}>LOGIN</button>
                        </div>
                    </div>
                </div>
                <div className={`forms-container ${isLoginFormActive ? 'show-login' : 'show-signup'}`}>
                    <div className={`user_forms-login ${isLoginFormActive ? 'active' : 'inactive'}`}>
                        <button className="closeButton" onClick={onClose}>&times;</button>
                        <h2 className="forms_title">Login</h2>
                        <form className="forms_form" onSubmit={(e) => handleSubmit(e, 'login')}>
                            <fieldset className="forms_fieldset">
                                <div className="forms_field" style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="forms_field-input"
                                        required
                                        autoFocus
                                        name="loginEmail"
                                        value={inputs.loginEmail}
                                        onChange={handleInputChange}
                                        onFocus={() => setTooltip({ ...tooltip, loginEmail: true })}
                                        onBlur={() => setTooltip({ ...tooltip, loginEmail: false })}
                                        disabled={isLoading}
                                    />

                                </div>
                                <div className="forms_field" style={{ position: 'relative' }}>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="forms_field-input"
                                        required
                                        name="loginPassword"
                                        value={inputs.loginPassword}
                                        onChange={handleInputChange}
                                        onFocus={() => setTooltip({ ...tooltip, loginPassword: true })}
                                        onBlur={() => setTooltip({ ...tooltip, loginPassword: false })}
                                        disabled={isLoading}
                                    />

                                </div>
                            </fieldset>
                            <div>{showResendEmailModal && <ResendEmailModal onClose={() => setShowResendEmailModal(false)} />}</div>
                            <div className="forms_buttons">
                                <button type="button" className="forms_buttons-forgot" disabled={isLoading}>Forgot password?</button>
                                <input type="submit" value="Log In" className="forms_buttons-action" disabled={isLoading} />
                            </div>
                        </form>
                    </div>
                    <div className={`user_forms-signup ${!isLoginFormActive ? 'active' : 'inactive'}`}>
                        <button className="closeButton" onClick={onClose}>&times;</button>
                        <h2 className="forms_title">Sign Up</h2>
                        <form className="forms_form" onSubmit={(e) => handleSubmit(e, 'signup')}>
                            <fieldset className="forms_fieldset">
                                <div className="forms_field" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Nickname"
                                        className="forms_field-input"
                                        required
                                        name="signupNickname"
                                        value={inputs.signupNickname}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="forms_field" style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="forms_field-input"
                                        required
                                        name="signupEmail"
                                        value={inputs.signupEmail}
                                        onChange={handleInputChange}
                                        onFocus={() => setTooltip({ ...tooltip, signupEmail: true })}
                                        onBlur={() => setTooltip({ ...tooltip, signupEmail: false })}
                                        autoComplete="new-email"
                                        disabled={isLoading}
                                    />
                                    <Tooltip
                                        message="Please provide a valid email address for verification."
                                        isVisible={tooltip.signupEmail}
                                        isValid={inputValidities.signupEmail}
                                        onClose={() => setTooltip({ ...tooltip, signupEmail: false })}
                                    />
                                </div>
                                <div className="forms_field" style={{ position: 'relative' }}>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="forms_field-input"
                                        required
                                        name="signupPassword1"
                                        value={inputs.signupPassword1}
                                        onChange={handleInputChange}
                                        onFocus={() => setTooltip({ ...tooltip, signupPassword: true })}
                                        onBlur={() => setTooltip({ ...tooltip, signupPassword: false })}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    <Tooltip
                                        message="Password must be at least 8 characters long and contain a mix of letters and numbers."
                                        isVisible={tooltip.signupPassword}
                                        isValid={inputValidities.signupPassword}
                                        onClose={() => setTooltip({ ...tooltip, signupPassword: false })}
                                    />
                                </div>
                                <div className="forms_field">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="forms_field-input"
                                        required
                                        name="signupPassword2"
                                        autoComplete="new-password"
                                        value={inputs.signupPassword2}
                                        onChange={handleInputChange}
                                        onFocus={() => setTooltip({ ...tooltip, signupPassword2: true })}
                                        onBlur={() => setTooltip({ ...tooltip, signupPassword2: false })}
                                        disabled={isLoading}
                                    />
                                    <Tooltip
                                        message="Passwords must match."
                                        isVisible={tooltip.signupPassword2}
                                        isValid={inputValidities.signupPassword2}
                                        onClose={() => setTooltip({ ...tooltip, signupPassword2: false })}
                                    />
                                </div>
                            </fieldset>
                            <div className="forms_buttons">
                                <input type="submit" value="Sign Up" className="forms_buttons-action" disabled={isLoading} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;