# Greendot Bank — Enterprise Online Banking Platform

A secure, modern, full-featured digital banking platform engineered with **React 19**, **TypeScript**, and **Tailwind CSS**. The platform provides a complete banking ecosystem including a public marketing website, a customer self-service banking dashboard, and a bank administration portal.

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Default Credentials & Access](#2-default-credentials--access)
3. [Features & Capabilities](#3-features--capabilities)
   - [Public Marketing Website & Onboarding](#public-marketing-website--onboarding)
   - [Customer Online Banking Dashboard](#customer-online-banking-dashboard)
   - [Bank Administration Operations Portal](#bank-administration-operations-portal)
4. [User & Account Lifecycle Behavior](#4-user--account-lifecycle-behavior)
   - [Customer Account States](#customer-account-states)
   - [Transaction PIN & Security Flow](#transaction-pin--security-flow)
   - [Admin Control Privileges](#admin-control-privileges)
5. [Data Persistence & State Management](#5-data-persistence--state-management)
6. [Deployment Guide](#6-deployment-guide)
   - [Prerequisites](#prerequisites)
   - [Building the Application](#building-the-application)
   - [Deploying on cPanel / Plesk (Apache)](#deploying-on-cpanel--plesk-apache)
   - [Deploying on Nginx / VPS](#deploying-on-nginx--vps)
   - [Deploying on Vercel](#deploying-on-vercel)
   - [Deploying on Netlify](#deploying-on-netlify)
   - [Deploying with Docker](#deploying-with-docker)
7. [Environment & Security Best Practices](#7-environment--security-best-practices)

---

## 1. Overview & Architecture

Greendot Bank is built as a single-page application (SPA) designed to mirror tier-1 commercial banking institutions (e.g., Chase, Ally, Green Dot, Revolut).

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom banking themes and modern typography
- **Icons**: Lucide React
- **Animations**: Motion / Canvas Confetti for interaction states
- **State & Storage**: Client-side transactional state engine with real-time `localStorage` synchronization and full JSON database export/import functionality.

---

## 2. Default Credentials & Access

### Administrator Account
The administrative portal is protected and only accessible via dedicated credentials:
- **Email**: `kevinowoeye@gmail.com`
- **Password**: `Personal@01`
- **Role**: Chief Operations Administrator (`admin`)
- **Access URL**: Click **Online Banking Sign In** or access the `/login` route, then input the credentials above. You will be redirected to the **Bank Operations Portal**.

### Primary Customer Account (Pre-configured)
- **Customer ID**: `CUST-849201`
- **Email**: `sarah.mitchell@greendot.com`
- **Password**: `password123`
- **Default Transaction PIN**: `1234`
- **Status**: Active (`active`) with High-Yield Savings and Gold Visa Debit Card.

---

## 3. Features & Capabilities

### Public Marketing Website & Onboarding

1. **Homepage (`/`)**:
   - Hero banner with Federal Reserve System routing indicators.
   - Interactive High-Yield APY calculator (up to 4.85% APY).
   - Real-time foreign exchange rate ticker.
   - Core financial service pillars: Checking, Savings, Instant Wires, Visa Debit Cards, Business Loans.
   - Security assurance highlights (256-bit AES encryption, FDIC insurance disclosure).
   - Customer reviews and verified testimonials.
   - Latest news and institutional press releases.
2. **About Us (`/about`)**:
   - Executive leadership profiles, corporate mission, and regulatory compliance disclosures.
3. **Loans & Credit (`/loans`)**:
   - Loan types: Personal Loans, Mortgages, Small Business Credit Lines, Auto Financing.
   - APR range calculators and repayment schedule previews.
4. **High-Yield APY (`/investments`)**:
   - Tiered interest rate breakdowns and wealth portfolio management overviews.
5. **Careers (`/careers`)**:
   - Open positions in Cybersecurity, Compliance, Treasury, and Software Engineering with an interactive application modal.
6. **Security & FAQ (`/faq`)**:
   - Interactive security disclosures, hardware token instructions, and account safety FAQs.
7. **Contact Us (`/contact`)**:
   - In-app inquiry form, 24/7 toll-free helpline, headquarters location, and Telegram concierge.
8. **Open Account (`/open-account`)**:
   - Multi-step customer onboarding flow: Full name, email, phone, physical address, employment status, initial deposit choice, and preferred account tier.
   - Generates a unique Customer ID (`CUST-XXXXXX`) and places the account into `pending_activation` status.
9. **Account Activation (`/activate-account`)**:
   - Verification screen where newly registered customers input the security activation code sent to their email to unlock online banking access.

---

### Customer Online Banking Dashboard

Once logged in, customers have access to a complete digital banking suite:

1. **Dashboard Overview**:
   - Total liquid balance (Primary Checking + High-Yield Savings).
   - Quick action bar: Send Money, Pay Bills, View Cards, Request Statement.
   - Recent transactional ledger with category color coding and status tags.
   - Financial breakdown graphs showing monthly inflows vs. expenditures.
2. **Fund Transfers (`Transfers`)**:
   - **Domestic ACH**: Standard 1–3 business day domestic bank-to-bank transfers.
   - **Instant Wire**: Real-time domestic Fedwire transfers.
   - **International SWIFT**: Cross-border wires supporting IBAN, SWIFT/BIC codes, and currency selection.
   - **Internal Transfer**: Instant transfer between accounts within Greendot Bank using Customer ID or email.
   - **PIN Enforcement**: All transfers require the user's 4-digit Transaction PIN.
3. **Transaction History & Ledger (`Transactions`)**:
   - Real-time search by recipient, description, or Transaction ID (`TX-XXXXXXXX`).
   - Filter by date range, transaction type (debit, credit, wire, bill, fee), or status (completed, pending, failed).
   - **Digital Receipt Generator**: View and print/export a verified formal bank receipt for any transaction.
4. **Debit & Virtual Cards (`Cards`)**:
   - Interactive card preview showing cardholder name, card number, expiry, and CVV.
   - Instant Card Lock/Unlock: Freeze the card immediately in case of loss or theft.
   - Set/Change 4-digit Card PIN.
   - Minimum card load threshold verification.
5. **Beneficiary Address Book (`Beneficiaries`)**:
   - Save frequently used bank accounts, domestic routing numbers, or international accounts for quick one-click transfers.
6. **Bill Pay (`Bill Pay`)**:
   - Pay registered utility providers (Electric, Water, Internet, Gas, Cable, Insurance).
   - Instant confirmation with automatic balance deduction and transaction logging.
7. **Mobile Airtime & Utilities Recharge (`Mobile Recharge`)**:
   - Instant cellular airtime and data bundle top-ups across global mobile carriers.
8. **Loan Application Center (`Loans`)**:
   - Submit formal loan applications (Personal, Auto, Small Business, Home).
   - Custom repayment terms (12 to 60 months).
   - Live status tracking (Pending Review, Approved & Disbursed, Under Review).
9. **Customer Support Concierge (`Support`)**:
   - Submit priority support tickets.
   - Request an official telephone callback from bank staff.
10. **Profile & Security Settings (`Settings`)**:
    - Update email, physical address, and phone number.
    - Two-Factor Authentication (2FA) toggle.
    - Change online banking password.
    - Update the 4-digit Transaction PIN.
    - Review active login sessions and authorized devices.

---

### Bank Administration Operations Portal

Accessible exclusively to `kevinowoeye@gmail.com`:

1. **Operations Overview**:
   - Total system deposits and circulating liquidity.
   - Total registered customer count, active accounts, and pending activations.
   - Real-time wire and transfer volume metrics.
2. **Customer Account Management**:
   - Master list of all customer accounts with search by name, email, or Customer ID.
   - **Balance Credit/Debit Tool**: Manually inject credit deposits or process debit deductions with custom reference memos.
   - **Status Governance**: Instantly change any user's status:
     - `active`: Full access granted.
     - `pending_activation`: Customer must verify activation token.
     - `frozen`: Customer can view balance but cannot initiate outgoing funds.
     - `suspended`: Customer is blocked from logging in.
   - **KYC Management**: Mark verification status as `verified`, `pending`, or `rejected`.
   - **Credential Management**: Reset customer passwords and review registration metadata.
3. **Transaction Auditing & Wire Underwriting**:
   - Real-time stream of all system transactions.
   - Inspect sender, recipient, routing numbers, amounts, and timestamps.
   - Manual approval or rejection of flagged wires.
4. **Loan Underwriting Desk**:
   - Review pending customer loan applications.
   - Inspect requested amount, stated purpose, applicant balance, and tenure.
   - Approve loan applications with custom APR rates or decline with formal administrative notes.
5. **System Settings & Institutional Parameters**:
   - Configure public bank contact information:
     - Support email address
     - Toll-free customer service phone number
     - Official Telegram concierge handle
     - Headquarters address
     - Routing number (ABA) and SWIFT/BIC code.
6. **Database Backup & Restoration**:
   - **Export JSON Backup**: Download the entire bank ledger, customer profiles, and transaction records as a standalone JSON file.
   - **Import JSON Backup**: Upload an existing backup JSON file to immediately restore database state on any server.
   - **Restore Factory State**: Reset system state to default baseline configuration when needed.

---

## 4. User & Account Lifecycle Behavior

### Customer Account States

| Status | Login Allowed | View Balance | Outgoing Transfers | Inbound Deposits |
| :--- | :---: | :---: | :---: | :---: |
| `active` | Yes | Yes | Yes | Yes |
| `pending_activation` | Redirected to Activation | No | No | No |
| `frozen` | Yes | Yes | No (Error Shown) | Yes |
| `suspended` | Blocked | No | No | No |

### Registration to Active Flow:
1. Customer registers via **Open Account** (`/open-account`).
2. System assigns account status: `pending_activation` and creates a 6-digit secure activation token.
3. Customer receives the token and navigates to **Activate Account** (`/activate-account`).
4. Entering the correct code transitions the account to `active`, generates a temporary security password, and unlocks the online dashboard.

### Transaction PIN & Security Flow
- Every outgoing wire, bill payment, mobile recharge, and card freeze operation requires the customer's 4-digit Transaction PIN.
- The PIN dialog features masked inputs, automatic focus advancement, and hardware security encryption assurances.

### Admin Control Privileges
- The Administrator has overarching authority to credit funds, debit fees, approve loans, suspend accounts, and manage system parameters.
- Changes made in the Admin Portal take effect immediately in the customer's dashboard.

---

## 5. Data Persistence & State Management

Greendot Bank uses an internal transaction-safe storage engine built on top of browser `localStorage`.

- **Storage Key**: `greendot_bank_state_v1`
- **Data Integrity**: State changes (transfers, balance adjustments, settings updates, user registrations) are synchronized in real-time.
- **Cross-Device / Migration Support**: Use the **Export Database Backup** tool inside the Admin Settings to export the entire state to a `.json` file, and upload it to another browser or device using **Import Database Backup**.

---

## 6. Deployment Guide

Because Greendot Bank is built as a high-performance modern Single-Page Application (SPA), it compiles into static HTML, JavaScript, and CSS assets that can be hosted on **any web server or control panel**.

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher

### Building the Application

Run the following commands in the root of the project:

```bash
# 1. Install all dependencies
npm install

# 2. Build the production bundle
npm run build
```

The compiled production files will be output to the `dist/` directory:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

---

### Deploying on cPanel / Plesk (Apache)

1. Run `npm run build` on your local computer.
2. Log into your **cPanel** or **Plesk** control panel.
3. Open **File Manager** and navigate to your web root (usually `public_html/` or your subdomain folder, e.g., `banking.yourdomain.com`).
4. Upload all files from the local `dist/` folder into the `public_html/` directory.
5. Create a file named `.htaccess` inside `public_html/` with the following contents to ensure deep links and page refreshes work properly:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable Browser Caching for Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

6. Save `.htaccess`. Your banking application is now live!

---

### Deploying on Nginx / VPS

If you are running an Ubuntu/Debian/CentOS server with Nginx:

1. Upload the contents of `dist/` to `/var/www/greendot-bank/html`.
2. Configure your Nginx server block (e.g. `/etc/nginx/sites-available/greendot.conf`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourbankdomain.com www.yourbankdomain.com;

    root /var/www/greendot-bank/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

3. Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

4. Install an SSL certificate using Let's Encrypt Certbot:
```bash
sudo certbot --nginx -d yourbankdomain.com -d www.yourbankdomain.com
```

---

### Deploying on Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. Set the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will automatically configure SPA routing.

---

### Deploying on Netlify

1. Push your repository to GitHub.
2. In [Netlify](https://netlify.com), click **Add new site** > **Import an existing project**.
3. Set the build configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add a `_redirects` file in your `public/` directory with the following rule:
   ```
   /*    /index.html   200
   ```
5. Deploy the site.

---

### Deploying with Docker

A multi-stage `Dockerfile` using Nginx Alpine can be used for containerized cloud deployment (AWS ECS, Google Cloud Run, DigitalOcean App Platform, Kubernetes):

```dockerfile
# Stage 1: Build the Vite application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration with SPA fallback
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

To build and run locally with Docker:
```bash
docker build -t greendot-bank .
docker run -d -p 8080:80 greendot-bank
```
The application will be accessible at `http://localhost:8080`.

---

## 7. Environment & Security Best Practices

1. **Always Enforce HTTPS**: Banking applications must always be served over TLS/SSL (HTTPS) in production.
2. **Keep Backups**: Regularly use the **Export Database Backup** option in the Admin Portal to download a snapshot of customer accounts and balance ledgers.
3. **Change Default Credentials in Production**: Before opening to public customers, update the admin email and password to your production security standards.
4. **Header Hardening**: Ensure strict HTTP security headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`) are enabled on your server.
