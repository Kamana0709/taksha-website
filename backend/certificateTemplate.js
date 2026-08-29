module.exports = function generateCertificateHtml(data) {
  const { name, role, startDate, endDate, certificateId } = data;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: 'Montserrat', sans-serif;
        background-color: #fcfcfc;
        color: #0b1c3c;
        width: 1122px; /* A4 landscape width at 96 DPI */
        height: 793px; /* A4 landscape height at 96 DPI */
        position: relative;
        overflow: hidden;
      }
      
      /* Left Navy Sidebar */
      .sidebar {
        position: absolute;
        top: 0;
        left: 0;
        width: 250px;
        height: 100%;
        background-color: #051630;
        clip-path: polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%);
        z-index: 2;
      }
      
      /* Gold accent behind sidebar */
      .sidebar-accent {
        position: absolute;
        top: 0;
        left: 0;
        width: 265px;
        height: 100%;
        background-color: #d4af37;
        clip-path: polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%);
        z-index: 1;
      }
      
      /* Right corner gold/navy accents */
      .corner-accent-gold {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 200px;
        height: 200px;
        background-color: #d4af37;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
        z-index: 1;
      }
      .corner-accent-navy {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 170px;
        height: 170px;
        background-color: #051630;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
        z-index: 2;
      }
      
      /* Top right corner */
      .top-corner-accent {
        position: absolute;
        top: 0;
        right: 0;
        width: 150px;
        height: 150px;
        background: linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.1) 50%);
        z-index: 0;
      }

      /* Main Content Container */
      .content {
        position: absolute;
        top: 0;
        left: 180px;
        width: 942px;
        height: 100%;
        padding: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10;
      }
      
      /* Top Right ID */
      .cert-id-container {
        position: absolute;
        top: 40px;
        right: 50px;
        text-align: right;
      }
      .cert-id-label {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #051630;
        margin-bottom: 5px;
      }
      .cert-id-value {
        font-size: 16px;
        font-weight: 700;
        color: #d4af37;
      }
      .cert-id-line {
        width: 100%;
        height: 1px;
        background-color: #d4af37;
        margin-top: 5px;
      }
      
      /* Udyam Badge */
      .udyam-badge {
        position: absolute;
        bottom: 50px;
        left: 50px;
        border: 1px solid #d8d2c4;
        border-radius: 4px;
        padding: 8px 12px;
        text-align: center;
      }
      .udyam-badge-label {
        font-size: 9px;
        font-weight: 800;
        color: #8B93A7;
        margin-bottom: 2px;
      }
      .udyam-badge-value {
        font-size: 10px;
        font-weight: 700;
        color: #8B93A7;
      }
      
      /* Logo Area */
      .logo-area {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
        margin-bottom: 30px;
      }
      .logo-icon {
        font-family: 'Arial', sans-serif;
        font-size: 80px;
        font-weight: 900;
        color: #051630;
        line-height: 1;
        position: relative;
      }
      .logo-icon::after {
        content: '';
        position: absolute;
        bottom: 10px;
        right: -10px;
        width: 10px;
        height: 10px;
        background-color: #d4af37;
        transform: rotate(45deg);
      }
      .logo-text {
        font-size: 50px;
        font-weight: 400;
        letter-spacing: 2px;
      }
      .tagline {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 3px;
        text-align: center;
        margin-top: -5px;
      }
      .tagline-lines {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .tagline-lines::before, .tagline-lines::after {
        content: '';
        height: 1px;
        width: 30px;
        background-color: #d4af37;
      }
      
      /* Title Area */
      .title-area {
        text-align: center;
        position: relative;
        margin: 20px 0 40px 0;
        width: 100%;
      }
      .title-background {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 70px;
        font-weight: 900;
        color: transparent;
        -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4);
        letter-spacing: 5px;
        z-index: -1;
        width: 100%;
        text-align: center;
      }
      .title-main {
        font-size: 40px;
        font-weight: 800;
        letter-spacing: 4px;
        line-height: 1.2;
      }
      .title-lines {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
      }
      .title-lines::before, .title-lines::after {
        content: '';
        height: 1px;
        width: 150px;
        background-color: #d4af37;
      }
      
      /* Certify Text */
      .certify-text {
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 20px;
      }
      
      /* Name Area */
      .name-text {
        font-family: 'Playfair Display', serif;
        font-size: 55px;
        font-weight: 600;
        color: #051630;
        text-align: center;
        width: 80%;
        border-bottom: 1px solid #d4af37;
        padding-bottom: 5px;
        margin-bottom: 25px;
      }
      
      /* Body Text */
      .body-text {
        font-size: 15px;
        line-height: 1.6;
        text-align: center;
        width: 75%;
        margin-bottom: 40px;
      }
      .highlight {
        font-weight: 700;
      }
      
      /* Verify Text */
      .verify-text {
        font-size: 13px;
        color: #051630;
        margin-top: 10px;
        text-align: center;
        background: rgba(212, 175, 55, 0.1);
        padding: 8px 15px;
        border-radius: 4px;
        border: 1px dashed #d4af37;
      }
      
      /* Footer */
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        padding: 0 40px;
        position: absolute;
        bottom: 50px;
        left: 180px;
        width: calc(100% - 180px);
      }
      
      .signature-area {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .signature-image {
        width: 120px;
        height: 60px;
        border-bottom: 1px solid #051630;
        margin-bottom: 5px;
        /* Mock signature */
        font-family: 'Playfair Display', serif;
        font-size: 40px;
        line-height: 60px;
        color: #051630;
        font-style: italic;
      }
      .signature-title {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1px;
      }
      .signature-company {
        font-size: 12px;
        font-weight: 400;
      }
      
      /* Seal */
      .seal {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 120px;
        background-color: #051630;
        border: 4px solid #d4af37;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10;
      }
      .seal::before, .seal::after {
        content: '';
        position: absolute;
        bottom: -30px;
        width: 25px;
        height: 40px;
        background-color: #051630;
        z-index: -1;
      }
      .seal::before {
        left: 20px;
        transform: rotate(30deg);
        border-right: 2px solid #d4af37;
      }
      .seal::after {
        right: 20px;
        transform: rotate(-30deg);
        border-left: 2px solid #d4af37;
      }
      .seal-stars {
        color: #d4af37;
        font-size: 14px;
        letter-spacing: 2px;
        margin-bottom: 5px;
      }
      .seal-logo {
        font-size: 30px;
        font-weight: 900;
        color: #fff;
      }
      .seal-inner {
        width: 90%;
        height: 90%;
        border: 1px dashed #d4af37;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
      }

      /* Sidebar Text */
      .sidebar-info {
        position: absolute;
        bottom: 50px;
        left: 30px;
        color: #fff;
        z-index: 10;
        font-size: 11px;
        line-height: 1.5;
        width: 150px;
      }
      .sidebar-item {
        margin-bottom: 25px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sidebar-icon {
        color: #d4af37;
        font-size: 20px;
      }
      .sidebar-line {
        width: 80%;
        height: 1px;
        background-color: #d4af37;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
    <!-- Abstract Shapes -->
    <div class="sidebar-accent"></div>
    <div class="sidebar"></div>
    <div class="top-corner-accent"></div>
    <div class="corner-accent-gold"></div>
    <div class="corner-accent-navy"></div>
    
    <!-- Sidebar Info -->
    <div class="sidebar-info">
      <div class="sidebar-item">
        <div class="sidebar-icon">🌐</div>
        <div>taksha.tech</div>
        <div class="sidebar-line"></div>
      </div>
      <div class="sidebar-item">
        <div class="sidebar-icon">✉️</div>
        <div>takshadigital@gmail.com</div>
        <div class="sidebar-line"></div>
      </div>
      <div class="sidebar-item">
        <div class="sidebar-icon">📍</div>
        <div>Bhubaneswar, Odisha, India</div>
      </div>
    </div>
    
    <div class="content">
      <div class="cert-id-container">
        <div class="cert-id-label">CERTIFICATE</div>
        <div class="cert-id-value">${certificateId}</div>
        <div class="cert-id-line"></div>
      </div>
      
      <div class="logo-area">
        <div class="logo-icon">T</div>
        <div>
          <div class="logo-text">Taksha Nexus</div>
          <div class="tagline-lines">
            <div class="tagline">CRAFTING DIGITAL<br>EXCELLENCE.</div>
          </div>
        </div>
      </div>
      
      <div class="title-area">
        <div class="title-background">CERTIFICATE</div>
        <div class="title-main">INTERNSHIP</div>
        <div class="title-lines">
          <div class="title-main">COMPLETION</div>
        </div>
      </div>
      
      <div class="certify-text">This is to certify<br>that</div>
      
      <div class="name-text">${name}</div>
      
      <div class="body-text">
        has successfully completed the internship program as a <span class="highlight">${role} Intern</span> 
        at <span class="highlight">Taksha Nexus</span> from <span class="highlight">${startDate}</span> to <span class="highlight">${endDate}</span>.<br><br>
        During the internship, they demonstrated dedication, enthusiasm, and a strong willingness to learn. 
        We truly appreciate their efforts and contributions to the projects and tasks assigned.<br><br>
        We wish them all the best for their future endeavors.
      </div>
      
      <div class="verify-text">
        Verify authenticity at: <strong>taksha.studio/verify/${encodeURIComponent(certificateId)}</strong>
      </div>
      
      <div class="udyam-badge">
        <div class="udyam-badge-label">UDYAM REGISTERED MSME</div>
        <div class="udyam-badge-value">UDYAM-OD-19-0177339</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="signature-area">
        <div class="signature-image">RA.</div>
        <div class="signature-title">FOUNDER</div>
        <div class="signature-company">Taksha Nexus</div>
      </div>
    </div>
    
    <div class="seal">
      <div class="seal-inner">
        <div class="seal-stars">★★★</div>
        <div class="seal-logo">T</div>
      </div>
    </div>
  </body>
  </html>
  `;
}
