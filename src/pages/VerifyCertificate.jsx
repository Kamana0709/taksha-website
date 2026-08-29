import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO/SEO';

const VerifyCertificate = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  
  const [inputNumber, setInputNumber] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [certificateData, setCertificateData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (certificateNumber) {
      verifyCertificate(certificateNumber);
    }
  }, [certificateNumber]);

  const verifyCertificate = async (id) => {
    setStatus('loading');
    try {
      const response = await fetch(`/api/certificates/verify/${encodeURIComponent(id)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No certificate found with this number.');
        }
        throw new Error('Failed to verify certificate. Please try again later.');
      }
      const data = await response.json();
      setCertificateData(data);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    
    // Instead of directly verifying, navigate so the URL updates
    navigate(`/verify/${encodeURIComponent(inputNumber.trim())}`);
  };

  return (
    <div className="verify-page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px', backgroundColor: '#f9fafb' }}>
      <SEO 
        title={certificateNumber ? `Verify Certificate - ${certificateNumber}` : "Verify Certificate"}
        description="Verify the authenticity of a Taksha Nexus internship certificate."
      />
      
      <div className="verify-container" style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '40px', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '28px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
          Certificate Verification
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Enter the unique certificate number found on the bottom right of the document to verify its authenticity.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input
            type="text"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="e.g. TK/IC/2026/0001"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none' }}
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            style={{ padding: '12px 24px', backgroundColor: '#051630', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            {status === 'loading' ? 'Checking...' : 'Verify'}
          </button>
        </form>

        {status === 'loading' && (
          <div style={{ padding: '40px 0' }}>
            <div className="loader-line" style={{ margin: '0 auto' }}></div>
            <p style={{ color: '#6b7280', marginTop: '15px' }}>Verifying records...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '24px', color: '#b91c1c' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 10px', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>Verification Failed</h3>
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' && certificateData && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', textAlign: 'left' }}>
            <div style={{ backgroundColor: '#ecfdf5', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ backgroundColor: '#10b981', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 style={{ color: '#065f46', fontSize: '18px', fontWeight: '700', margin: 0 }}>Verified Authentic</h3>
                <p style={{ color: '#047857', fontSize: '14px', margin: 0 }}>This certificate is valid and issued by Taksha Nexus.</p>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Intern Name</div>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{certificateData.internName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Role / Track</div>
                  <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{certificateData.role}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Date Range</div>
                  <div style={{ fontSize: '16px', color: '#111827' }}>{certificateData.startDate} — {certificateData.endDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Issued On</div>
                  <div style={{ fontSize: '16px', color: '#111827' }}>{new Date(certificateData.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {certificateData.projectsCompleted && certificateData.projectsCompleted.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Completed Projects</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {certificateData.projectsCompleted.map((project, idx) => (
                      <li key={idx} style={{ padding: '10px 0', borderBottom: idx !== certificateData.projectsCompleted.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                        <div style={{ fontWeight: '500', color: '#374151' }}>{project.projectName}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', display: 'flex', gap: '15px' }}>
                          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37', textDecoration: 'none' }}>View Live</a>}
                          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37', textDecoration: 'none' }}>View Source</a>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
