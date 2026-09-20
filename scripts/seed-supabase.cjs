const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ucyglwcuuabobeeomfde';

async function executeQuery(query) {
  const url = 'https://api.supabase.com/v1/projects/' + PROJECT_REF + '/database/query';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const resText = await resp.text();
  if (!resp.ok) {
    console.error('Query failed:', resp.status, resText);
  }
  return { ok: resp.ok, status: resp.status, data: resText };
}

async function seed() {
  console.log('Seeding initial data into Supabase...');

  // 1. Check if profiles already exist
  const check = await executeQuery('SELECT COUNT(*) FROM public.profiles;');
  console.log('Current profiles count:', check.data);

  // Initial profiles
  const profilesSql = `
    INSERT INTO public.profiles (id, "userId", role, "fullName", email, password, phone, "customerId", status, "twoFactorEnabled", "kycStatus", "hasVisaCard", "cardMinLoad", "transactionPinHash", "accountTier", "upgradeMinLoad", address, city, country)
    VALUES 
    ('admin-1', 'admin-1', 'admin', 'Kevin Owoeye', 'kevinowoeye@gmail.com', 'Personal@01', '+1 (800) 473-3636', 'ADMIN-0001', 'active', true, 'verified', true, 200, '1234', 'tier_3', 800, 'Greendot Headquarters', 'New York, NY 10001', 'United States'),
    ('cust-1', 'cust-1', 'customer', 'Sarah Mitchell', 'sarah.mitchell@greendot.com', 'Customer@01', '+1 (555) 234-5678', 'CUST-849201', 'active', true, 'verified', true, 200, '1234', 'tier_1', 800, '742 Evergreen Terrace', 'New York, NY 10001', 'United States'),
    ('cust-2', 'cust-2', 'customer', 'Marcus Vance', 'marcus.vance@example.com', 'Customer@01', '+1 (555) 876-5432', 'CUST-910244', 'pending_activation', false, 'pending', false, 200, '1234', 'tier_0', 800, '124 Conch Street', 'Los Angeles, CA 90001', 'United States'),
    ('cust-3', 'cust-3', 'customer', 'Elena Rostova', 'elena.rostova@example.com', 'Customer@01', '+1 (555) 345-6789', 'CUST-338291', 'active', true, 'verified', true, 200, '1234', 'tier_2', 800, '405 Lexington Ave', 'Miami, FL 33101', 'United States')
    ON CONFLICT (id) DO UPDATE SET
      "fullName" = EXCLUDED."fullName",
      email = EXCLUDED.email,
      password = EXCLUDED.password;
  `;
  await executeQuery(profilesSql);

  // 2. Initial accounts
  const accountsSql = `
    INSERT INTO public.accounts (id, "userId", "accountNumber", "accountType", balance, currency, status)
    VALUES
    ('acc-1', 'cust-1', '1092837461', 'checking', 24850.75, 'USD', 'active'),
    ('acc-2', 'cust-1', '1092837462', 'savings', 85420.00, 'USD', 'active'),
    ('acc-3', 'cust-2', '2093847561', 'checking', 0.00, 'USD', 'active'),
    ('acc-4', 'cust-3', '3094857612', 'checking', 142000.50, 'USD', 'active')
    ON CONFLICT (id) DO NOTHING;
  `;
  await executeQuery(accountsSql);

  // 3. Initial Debit Cards
  const cardsSql = `
    INSERT INTO public.debit_cards (id, "userId", "accountId", "cardNumber", "cardHolder", "expiryMonth", "expiryYear", cvv, "cardType", status, "pinSet", "dailyLimit")
    VALUES
    ('card-1', 'cust-1', 'acc-1', '4532 8912 3456 7890', 'SARAH MITCHELL', 9, 2029, '789', 'visa', 'active', true, 5000),
    ('card-2', 'cust-3', 'acc-4', '4123 5678 9012 3456', 'ELENA ROSTOVA', 11, 2028, '432', 'visa', 'active', true, 15000)
    ON CONFLICT (id) DO NOTHING;
  `;
  await executeQuery(cardsSql);

  // 4. Initial App Settings
  const settingsSql = `
    INSERT INTO public.app_settings (id, bank_name, support_email, support_phone, telegram_handle, zangi_handle, signal_handle, site_url, min_visa_card_load, gold_card_banner_enabled, transfer_approval_required, require_2fa, maintenance_mode, lockdown_mode, email_notifications_enabled, email_provider, theme_color)
    VALUES
    ('global_settings', 'Greendot Bank', 'greendot.bank.supportmail@gmail.com', '1-800-GREENDOT', '@greendotbanksupport', '10-9876-5432', '+1 (800) 473-3636', 'https://greendot.bank', 200, true, true, true, false, false, true, 'gmail', 'Emerald Green')
    ON CONFLICT (id) DO UPDATE SET
      bank_name = EXCLUDED.bank_name,
      support_email = EXCLUDED.support_email;
  `;
  await executeQuery(settingsSql);

  // 5. Initial Announcements
  const announcementsSql = `
    INSERT INTO public.announcements (id, title, category, content, "targetAudience", "sentBy")
    VALUES
    ('ann-1', 'System Upgrade & Security Maintenance Completed', 'general', 'All banking operations, instant ACH rails, and international wires are operating at 100% capacity.', 'all', 'Kevin Owoeye (Admin)'),
    ('ann-2', 'Gold Visa Debit Card Benefits Active', 'policy_update', 'All verified accounts with active Gold Visa cards enjoy zero foreign transaction fees and 2.5% cash-back rewards.', 'all', 'Greendot Treasury')
    ON CONFLICT (id) DO NOTHING;
  `;
  await executeQuery(announcementsSql);

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
