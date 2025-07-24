import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleRedirector = ({ authState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    switch (authState.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'tailor':
        navigate('/tailor');
        break;
      case 'user':
      case 'customer':
        navigate('/user');
        break;
      default:
        navigate('/');
    }
  }, [authState, navigate]);

  return null;
};

export default RoleRedirector;
