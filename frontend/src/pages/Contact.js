import React, { useState } from 'react';

const Contact = () => {
  const [showCopied, setShowCopied] = useState('');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(''), 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      name: 'Email',
      value: 'nanciah05@gmail.com',
      link: 'https://mail.google.com/mail/?view=cm&fs=1&to=nanciah05@gmail.com&su=Contact%20CISCO%20-%20Demande%20d%27information&body=Bonjour%20CISCO,%0D%0A%0D%0AJe%20vous%20contacte%20au%20sujet%20de%20:%0D%0A%0D%0A%0D%0A%0D%0ACordialement,',
      description: 'Ouvrir Gmail pour nous envoyer un email'
    },
    {
      icon: '📱',
      name: 'WhatsApp',
      value: '+261 38 59 257 74',
      link: 'https://wa.me/385925774?text=Bonjour%20CISCO,%20je%20vous%20contacte%20au%20sujet%20de...',
      description: 'Nous contacter sur WhatsApp'
    },
    {
      icon: '📞',
      name: 'Téléphone',
      value: '+261 38 59 257 74',
      link: 'tel:+385925774',
      description: 'Appelez-nous directement'
    },
    {
      icon: '🏢',
      name: 'Adresse',
      value: 'CISCO, BP 1234 Antananarivo',
      link: 'https://www.google.com/maps/search/?api=1&query=CISCO+Antananarivo+Madagascar',
      description: 'Visitez nos bureaux'
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>📞 Contactez CISCO</h1>
          <p>Notre équipe est à votre disposition pour toute question</p>
        </div>

        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon">{method.icon}</div>
              <h3>{method.name}</h3>
              <p className="contact-description">{method.description}</p>
              <div className="contact-value">
                <span>{method.value}</span>
                <button
                  onClick={() => copyToClipboard(method.value, method.name)}
                  className="copy-btn"
                  title="Copier"
                >
                  {showCopied === method.name ? '✓' : '📋'}
                </button>
              </div>
              <a 
                href={method.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                {method.name === 'Email' ? '📧 Ouvrir Gmail' : 
                 method.name === 'WhatsApp' ? '💬 Ouvrir WhatsApp' :
                 method.name === 'Téléphone' ? '📞 Appeler' : '🗺️ Voir sur Maps'}
              </a>
            </div>
          ))}
        </div>

        <div className="contact-info">
          <h3>🕒 Horaires d'ouverture</h3>
          <div className="schedule">
            <p><strong>Lundi - Vendredi:</strong> 8h00 - 17h00</p>
            <p><strong>Samedi:</strong> 8h00 - 12h00</p>
            <p><strong>Dimanche:</strong> Fermé</p>
          </div>
          
          <div className="email-help" style={{marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px'}}>
            <p style={{margin: 0, fontSize: '0.9rem', color: '#666'}}>
              <strong>💡 Astuce :</strong> Si Gmail ne s'ouvre pas, copiez l'adresse email et collez-la dans votre application email préférée.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 80vh;
        }

        .contact-container {
          text-align: center;
        }

        .contact-header {
          margin-bottom: 3rem;
        }

        .contact-header h1 {
          color: #1e3c72;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .contact-header p {
          color: #666;
          font-size: 1.2rem;
        }

        .contact-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .contact-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          border: 1px solid #e1e5e9;
          transition: transform 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .contact-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .contact-card h3 {
          color: #1e3c72;
          margin-bottom: 0.5rem;
        }

        .contact-description {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .contact-value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #e9ecef;
        }

        .contact-link {
          display: inline-block;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30, 60, 114, 0.3);
        }

        .contact-info {
          background: #e8f4fd;
          padding: 2rem;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .contact-info h3 {
          color: #1e3c72;
          margin-bottom: 1rem;
        }

        .schedule p {
          margin: 0.5rem 0;
          color: #333;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 1rem;
          }

          .contact-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;