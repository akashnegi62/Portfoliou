import React from 'react';
import { useAppContext } from '../context/AppContext';

export const NotFound: React.FC = () => {
  const { navigate } = useAppContext();

  return (
    <div className="view not-found-view" style={{ textAlign: 'center', padding: '100px 24px' }}>
      <div className="section-meta" style={{ justifyContent: 'center' }}>
        <span className="section-index">404</span>
        <span className="section-kicker">Signal Lost</span>
      </div>
      <h1 className="page-title" style={{ marginTop: '16px' }}>Coordinates Unresolved</h1>
      <p className="page-lead" style={{ margin: '16px auto 32px auto', maxWidth: '500px' }}>
        The route requested does not exist in the studio archives or project index.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('/')}
      >
        Return to Studio Home
      </button>
    </div>
  );
};
