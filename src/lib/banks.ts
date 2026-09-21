export interface BankOption {
  id: string;
  name: string;
  code: string;
  region: 'USA' | 'CANADA' | 'EUROPE' | 'OTHER';
  logoColor: string;
}

export const SUPPORTED_BANKS: BankOption[] = [
  // USA
  { id: 'jpmorgan', name: 'JPMorgan Chase', code: 'CHASUS33', region: 'USA', logoColor: '#005ea6' },
  { id: 'bofa', name: 'Bank of America', code: 'BOFAUS3N', region: 'USA', logoColor: '#e31837' },
  { id: 'wells', name: 'Wells Fargo', code: 'WFBIUS6S', region: 'USA', logoColor: '#d71e28' },
  { id: 'citi', name: 'Citibank', code: 'CITIUS33', region: 'USA', logoColor: '#003b70' },
  { id: 'capone', name: 'Capital One', code: 'NFBKUS33', region: 'USA', logoColor: '#004879' },
  { id: 'usbank', name: 'U.S. Bank', code: 'USBKUS44', region: 'USA', logoColor: '#0c2340' },
  { id: 'pnc', name: 'PNC Bank', code: 'PNCCUS33', region: 'USA', logoColor: '#f47920' },
  { id: 'truist', name: 'Truist Bank', code: 'TRUIUS33', region: 'USA', logoColor: '#240046' },
  { id: 'td_usa', name: 'TD Bank USA', code: 'TRTOUS33', region: 'USA', logoColor: '#509e2f' },
  { id: 'discover', name: 'Discover Bank', code: 'DISCUS33', region: 'USA', logoColor: '#ff6600' },
  { id: 'schwab', name: 'Charles Schwab', code: 'CHAWUS33', region: 'USA', logoColor: '#00a0df' },
  { id: 'ally', name: 'Ally Bank', code: 'ALLYUS33', region: 'USA', logoColor: '#7b2cbf' },
  { id: 'chime', name: 'Chime', code: 'CHMEUS33', region: 'USA', logoColor: '#25c974' },
  { id: 'fidelity', name: 'Fidelity', code: 'FIDLUS33', region: 'USA', logoColor: '#7a7a7a' },
  { id: 'greendot', name: 'Greendot Bank (Internal Transfer)', code: 'GRDTUS01', region: 'USA', logoColor: '#1db954' },

  // CANADA
  { id: 'rbc', name: 'Royal Bank of Canada (RBC)', code: 'ROYCCAT2', region: 'CANADA', logoColor: '#003366' },
  { id: 'td_canada', name: 'TD Canada Trust', code: 'TDOMCAT2', region: 'CANADA', logoColor: '#00873e' },
  { id: 'scotia', name: 'Scotiabank', code: 'NOSCCAT2', region: 'CANADA', logoColor: '#ec111a' },
  { id: 'bmo', name: 'Bank of Montreal (BMO)', code: 'BOFMCAT2', region: 'CANADA', logoColor: '#0075be' },
  { id: 'cibc', name: 'CIBC', code: 'CIBCOR22', region: 'CANADA', logoColor: '#c41230' },
  { id: 'national_bank', name: 'National Bank of Canada', code: 'BNCACAT2', region: 'CANADA', logoColor: '#e31b23' },
  { id: 'tangerine', name: 'Tangerine', code: 'TANTCAT2', region: 'CANADA', logoColor: '#ff6600' },
  { id: 'eq_bank', name: 'EQ Bank', code: 'EQBKCAT2', region: 'CANADA', logoColor: '#0052cc' },
  { id: 'simplii', name: 'Simplii Financial', code: 'SIMPCAT2', region: 'CANADA', logoColor: '#a6192e' },

  // EUROPE
  { id: 'hsbc', name: 'HSBC', code: 'HSBCGB22', region: 'EUROPE', logoColor: '#db0011' },
  { id: 'barclays', name: 'Barclays', code: 'BARCGB22', region: 'EUROPE', logoColor: '#00aae5' },
  { id: 'lloyds', name: 'Lloyds Bank', code: 'LOYDGB22', region: 'EUROPE', logoColor: '#006a4e' },
  { id: 'natwest', name: 'NatWest', code: 'NWBKGB22', region: 'EUROPE', logoColor: '#5c0632' },
  { id: 'santander', name: 'Santander', code: 'BSCHESMM', region: 'EUROPE', logoColor: '#ec0000' },
  { id: 'bnp', name: 'BNP Paribas', code: 'BNPAFRPP', region: 'EUROPE', logoColor: '#00915a' },
  { id: 'credit_agricole', name: 'Crédit Agricole', code: 'AGRIFRPP', region: 'EUROPE', logoColor: '#009a44' },
  { id: 'deutsche', name: 'Deutsche Bank', code: 'DEUTDEFF', region: 'EUROPE', logoColor: '#0018a8' },
  { id: 'commerzbank', name: 'Commerzbank', code: 'COBADEFF', region: 'EUROPE', logoColor: '#ffbb00' },
  { id: 'ubs', name: 'UBS', code: 'UBSWCHZH', region: 'EUROPE', logoColor: '#111111' },
  { id: 'ing', name: 'ING Bank', code: 'INGBNL2A', region: 'EUROPE', logoColor: '#ff6200' },
  { id: 'bbva', name: 'BBVA', code: 'BBVAESMM', region: 'EUROPE', logoColor: '#004481' },
  { id: 'revolut', name: 'Revolut', code: 'REVOLT21', region: 'EUROPE', logoColor: '#1f2421' },
  { id: 'n26', name: 'N26', code: 'N26DEB11', region: 'EUROPE', logoColor: '#363839' },
  { id: 'wise', name: 'Wise', code: 'WISEGB22', region: 'EUROPE', logoColor: '#00b9ff' },
  { id: 'nordea', name: 'Nordea', code: 'NDEADKKK', region: 'EUROPE', logoColor: '#000066' },

  // OTHER
  { id: 'other', name: 'Other Bank (Type Manually)', code: 'OTHER00', region: 'OTHER', logoColor: '#64748b' },
];
