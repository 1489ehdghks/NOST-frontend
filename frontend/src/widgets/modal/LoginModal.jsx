import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/LoginInstance';
import { signup } from '../../features/auth/SignupInstance';
import useGlobalStore from '../../shared/store/GlobalStore';
import { toast } from 'react-toastify';
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
    const { isLoading, setIsLoading, error, setError } = useGlobalStore();
    const [signupSuccess, setSignupSuccess] = useState(false);
    const navigate = useNavigate();
    const [showResendEmailModal, setShowResendEmailModal] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
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
    const [passwordConditions, setPasswordConditions] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
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
            const conditions = {
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                number: /\d/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            };

            const satisfiedCount = Object.values(conditions).filter(Boolean).length;
            isValid = conditions.length && satisfiedCount >= 3;
            setPasswordConditions(conditions);
        } else if (name === 'signupPassword2') {
            isValid = value === inputs.signupPassword1;
        }

        setInputValidities(prev => ({ ...prev, [name]: isValid }));
    };

    const handleEmailVerificationError = (email) => {
        setUnverifiedEmail(email);
        setShowResendEmailModal(true);
        toast.dismiss();
        toast.error('이메일 인증이 필요합니다. 인증 메일을 확인해주세요.', {
            position: "top-center",
            autoClose: 5000,
            toastId: 'email-verification-error',
        });
    };


    const handleSubmit = async (event, type) => {
        event.preventDefault();
        setErrors({});
        setError(null);
        setIsLoading(true);
        toast.dismiss();
        try {
            if (type === 'login') {
                const response = await login(inputs.loginEmail, inputs.loginPassword);
                console.log("Login response:", response);

                if (!response.success) {
                    const errorDetail = response.errors?.errors?.detail || '';

                    // 이메일 인증 필요
                    if (errorDetail.includes('이메일 인증이 필요합니다')) {
                        handleEmailVerificationError(inputs.loginEmail);
                        return;
                    }

                    // 등록되지 않은 이메일
                    if (errorDetail.includes('등록되지 않은 이메일')) {
                        toast.error('등록되지 않은 이메일입니다. 회원가입을 진행해주세요.', {
                            position: "top-center",
                            autoClose: 5000,
                            toastId: 'unregistered-email'
                        });
                        return;
                    }

                    // 비밀번호 불일치
                    if (errorDetail.includes('이메일 또는 비밀번호가 올바르지 않습니다')) {
                        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.', {
                            position: "top-center",
                            autoClose: 5000,
                            toastId: 'invalid-credentials'
                        });
                        return;
                    }

                    // 기본 에러 메시지
                    toast.error(errorDetail || '로그인 중 오류가 발생했습니다.', {
                        position: "top-center",
                        autoClose: 5000,
                        toastId: 'login-error'
                    });
                } else {
                    toast.success('로그인되었습니다!', {
                        toastId: 'login-success'
                    });
                    navigate('/');
                }
            } else if (type === 'signup') {
                if (inputs.signupPassword1 !== inputs.signupPassword2) {
                    toast.error('비밀번호가 일치하지 않습니다.', {
                        position: "top-center",
                        autoClose: 5000,
                        toastId: 'password-mismatch'
                    });
                    setIsLoading(false);
                    return;
                }

                const response = await signup(
                    inputs.signupEmail,
                    inputs.signupPassword1,
                    inputs.signupPassword2,
                    inputs.signupNickname
                );

                if (!response.success) {
                    // 에러 응답 구조 처리 개선
                    const errors = response.errors?.errors || response.errors || {};

                    Object.entries(errors).forEach(([field, message]) => {
                        // 메시지가 배열인 경우 처리
                        const errorMessage = Array.isArray(message) ? message[0] : message;
                        let displayMessage;

                        // field가 비어있는 경우 처리
                        if (errorMessage === "This field may not be blank.") {
                            switch (field) {
                                case 'email':
                                    displayMessage = '이메일을 입력해주세요.';
                                    break;
                                case 'nickname':
                                    displayMessage = '닉네임을 입력해주세요.';
                                    break;
                                case 'password1':
                                    displayMessage = '비밀번호를 입력해주세요.';
                                    break;
                                case 'password2':
                                    displayMessage = '비밀번호 확인을 입력해주세요.';
                                    break;
                                default:
                                    displayMessage = '필수 항목을 입력해주세요.';
                            }
                        } else {
                            switch (field) {
                                case 'email':
                                    displayMessage = `이메일: ${errorMessage.includes('already exists') ?
                                        '이미 등록된 이메일입니다.' : errorMessage
                                        }`;
                                    break;
                                case 'nickname':
                                    displayMessage = `닉네임: ${errorMessage.includes('already exists') ?
                                        '이미 사용 중인 닉네임입니다.' : errorMessage
                                        }`;
                                    break;
                                case 'password1':
                                    displayMessage = `비밀번호: ${errorMessage}`;
                                    break;
                                case 'password2':
                                    displayMessage = `비밀번호 확인: ${errorMessage}`;
                                    break;
                                default:
                                    displayMessage = errorMessage;
                            }
                        }

                        toast.error(displayMessage, {
                            position: "top-center",
                            autoClose: 5000,
                            toastId: `signup-error-${field}`
                        });
                    });
                } else {
                    setSignupSuccess(true);
                    setLoginFormActive(true);
                    toast.success('회원가입이 완료되었습니다. 이메일을 확인해주세요.', {
                        position: "top-center",
                        autoClose: 3000,
                        toastId: 'signup-success'
                    });
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        signupNickname: '',
                        signupEmail: '',
                        signupPassword1: '',
                        signupPassword2: ''
                    }));
                }
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('서버와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
                position: "top-center",
                autoClose: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="modalOverlay" >
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
                                        autoComplete="off"

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
                                        autoComplete="new-password"
                                    />

                                </div>
                            </fieldset>
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
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Tooltip
                                        title="Email"
                                        requiredCount={1}
                                        conditions={[
                                            {
                                                label: "이메일 포함",
                                                isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.signupEmail)
                                            },
                                            {
                                                label: "!메일을 받을 수 있는 이메일",
                                                notice: true
                                            }
                                        ]}
                                        isVisible={tooltip.signupEmail}
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
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <Tooltip
                                        title="Password"
                                        requiredCount={3}
                                        conditions={[
                                            {
                                                label: "최소 8자 이상",
                                                isValid: passwordConditions.length
                                            },
                                            {
                                                label: "소문자 포함",
                                                isValid: passwordConditions.lowercase
                                            },
                                            {
                                                label: "대문자 포함",
                                                isValid: passwordConditions.uppercase
                                            },
                                            {
                                                label: "숫자 포함",
                                                isValid: passwordConditions.number
                                            },
                                            {
                                                label: "특수문자 포함",
                                                isValid: passwordConditions.special
                                            },
                                            {
                                                label: "!간단한 비밀번호는 사용이 안될 수도 있습니다",
                                                notice: true
                                            }
                                        ]}
                                        isVisible={tooltip.signupPassword}
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
                                        title="Confirm Password"
                                        requiredCount={1}
                                        conditions={[
                                            {
                                                label: "비밀번호와 같음",
                                                isValid: inputs.signupPassword2 === inputs.signupPassword1
                                                    && inputs.signupPassword2.length > 0
                                            }
                                        ]}
                                        isVisible={tooltip.signupPassword2}
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
                {showResendEmailModal && (
                    <ResendEmailModal
                        onClose={() => {
                            setShowResendEmailModal(false);
                            setUnverifiedEmail('');
                        }}
                        email={unverifiedEmail}
                    />
                )}
            </div>
        </div>
    );
};

export default LoginModal;