import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../shared/utils/AxiosInstance';
import { toast } from 'react-toastify';

const EmailConfirmation = () => {
    const { key } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await axiosInstance.post('/api/accounts/verify-email/', { key });
                toast.success('이메일이 성공적으로 확인되었습니다!');
                navigate('/email-confirmed');
            } catch (error) {
                toast.error('이메일 확인에 실패했습니다.');
                navigate('/email-confirmation-error');
            }
        };

        if (key) {
            confirmEmail();
        }
    }, [key, navigate]);

    return (
        <div>
            <h2>이메일 확인 중...</h2>
            < p > 잠시만 기다려주세요.</p>
        </div>
    );
};

export default EmailConfirmation;