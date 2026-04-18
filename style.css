/* 
  iOS 26 Style Glassmorphism & Mesh Background
  Hijama Clinic Form
*/

:root {
    --glass-bg: rgba(255, 255, 255, 0.65);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    --text-main: #1d1d1f; /* Apple classic text color */
    --text-sec: #86868b;
    --primary-color: #007aff; /* iOS blue */
    --primary-hover: #0056b3;
    --danger-color: #ff3b30;
    --success-color: #34c759;
    --input-bg: rgba(255, 255, 255, 0.5);
    --input-focus: rgba(255, 255, 255, 0.8);
    --border-radius-lg: 24px;
    --border-radius-md: 16px;
    --border-radius-sm: 8px;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Cairo', sans-serif;
    color: var(--text-main);
    line-height: 1.6;
    background-color: #f2f2f7; /* fallback */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px 100px; /* padding-bottom to allow floating action button */
}

/* Beautiful Animated Mesh Gradient Background */
.bg-mesh {
    background-color: #e5e5ea;
    background-image: 
        radial-gradient(at 0% 0%, hsla(253,16%,7%,0) 0, transparent 50%), 
        radial-gradient(at 50% 0%, hsla(225,39%,30%,0) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(339,49%,30%,0) 0, transparent 50%);
    position: relative;
    z-index: 0;
}
.bg-mesh::before, .bg-mesh::after {
    content: "";
    position: fixed;
    border-radius: 50%;
    z-index: -1;
    filter: blur(100px);
    animation: floating 15s infinite alternate ease-in-out;
}
.bg-mesh::before {
    width: 60vw;
    height: 60vw;
    background: rgba(144, 202, 249, 0.5);
    top: -10vw;
    right: -10vw;
}
.bg-mesh::after {
    width: 50vw;
    height: 50vw;
    background: rgba(206, 147, 216, 0.4);
    bottom: -10vw;
    left: -10vw;
    animation-delay: 5s;
}

@keyframes floating {
    0% { transform: translateY(0) scale(1); }
    100% { transform: translateY(30px) scale(1.05); }
}

/* Main Container (Form PDF Wrapper) */
.glass-container {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: var(--border-radius-lg);
    width: 100%;
    max-width: 900px;
    padding: 40px;
    position: relative;
    z-index: 10;
}

/* Header & Typography */
.form-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.logo-wrapper img.shop-logo {
    width: 120px;
    height: auto;
    margin-bottom: 15px;
    border-radius: var(--border-radius-sm);
    /* subtle shadow for logo */
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.main-title {
    font-size: 2.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1d1d1f 0%, #434343 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 5px;
}

.hashtag-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 5px;
}

.secondary-subtitle {
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text-sec);
}

/* Form Sections */
.form-section {
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: var(--border-radius-md);
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    transition: var(--transition);
}

.form-section:hover {
    background: rgba(255, 255, 255, 0.55);
    box-shadow: 0 6px 20px rgba(0,0,0,0.04);
}

.highlight-section {
    background: rgba(242, 242, 247, 0.6);
    border-color: rgba(209, 209, 214, 0.5);
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.section-header i {
    font-size: 1.4rem;
    color: var(--primary-color);
    margin-left: 12px; /* RTL - Right margin to separate icon from text leftwards */
    background: rgba(0, 122, 255, 0.1);
    padding: 10px;
    border-radius: 50%;
}

.section-header h2 {
    font-size: 1.4rem;
    font-weight: 700;
}

.section-desc {
    font-size: 0.95rem;
    color: var(--text-sec);
    margin-bottom: 15px;
}

/* Inputs & Form Elements */
.input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 15px;
}

.input-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.inline-group {
    flex-direction: row;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

label {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-main);
}

.inline-group label {
    margin-bottom: 0;
}

input[type="text"],
input[type="number"],
input[type="tel"],
input[type="date"],
textarea {
    width: 100%;
    padding: 12px 16px;
    background: var(--input-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-sm);
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-main);
    transition: var(--transition);
    backdrop-filter: blur(10px);
}

input:focus, textarea:focus {
    outline: none;
    background: var(--input-focus);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

input::placeholder, textarea::placeholder {
    color: #aeaeb2;
}

/* Checkboxes and Radios */
.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 15px;
}

.custom-checkbox, .custom-radio {
    display: flex;
    align-items: center;
    position: relative;
    padding-right: 32px; /* Space for mark in RTL */
    cursor: pointer;
    font-size: 0.95rem;
    user-select: none;
    font-weight: 500;
}

.custom-checkbox input, .custom-radio input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark, .radio-mark {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 22px;
    width: 22px;
    background-color: var(--input-bg);
    border: 2px solid #d1d1d6;
    border-radius: 6px;
    transition: var(--transition);
}

.radio-mark {
    border-radius: 50%;
}

.custom-checkbox:hover input ~ .checkmark,
.custom-radio:hover input ~ .radio-mark {
    background-color: rgba(0,122,255,0.05);
    border-color: var(--primary-color);
}

.custom-checkbox input:checked ~ .checkmark,
.custom-radio input:checked ~ .radio-mark {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.checkmark:after, .radio-mark:after {
    content: "";
    position: absolute;
    display: none;
}

.custom-checkbox input:checked ~ .checkmark:after,
.custom-radio input:checked ~ .radio-mark:after {
    display: block;
}

/* RTL Checkmark alignment */
.custom-checkbox .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.custom-radio .radio-mark:after {
    top: 6px;
    left: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
}

.radio-options {
    display: flex;
    gap: 20px;
}

.extra-mt {
    margin-top: 20px;
}

.mt-4 {
    margin-top: 1rem;
}

/* Patient Declaration Box */
.declaration-box {
    background: rgba(0, 122, 255, 0.05);
    border-right: 4px solid var(--primary-color);
    padding: 15px;
    border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
    margin-bottom: 20px;
}
.declaration-box p {
    font-size: 0.95rem;
    font-weight: 600;
}

.signature-line {
    border-bottom: 1px dashed var(--text-sec);
    height: 30px;
    width: 100%;
}

/* Fixed Actions / Submit Button */
.actions-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex;
    justify-content: center;
    z-index: 100;
}

.ios-btn {
    background: linear-gradient(180deg, #007aff 0%, #0056b3 100%);
    color: white;
    border: none;
    border-radius: var(--border-radius-lg);
    padding: 15px 40px;
    font-size: 1.1rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 4px 14px 0 rgba(0,118,255,0.39);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
}

.ios-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,118,255,0.23);
}

.ios-btn:active {
    transform: translateY(0);
}

.spinner {
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top: 3px solid white;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Print/PDF Overrides */
@media print {
    body {
        background: white !important;
    }
    .glass-container {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
    }
    .actions-container {
        display: none !important;
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .input-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    .glass-container {
        padding: 20px;
        border-radius: var(--border-radius-md);
    }
    .main-title {
        font-size: 1.8rem;
    }
}
