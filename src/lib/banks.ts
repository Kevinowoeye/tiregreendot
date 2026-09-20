export interface BankOption {
  id: string;
  name: string;
  code: string;
  logoColor: string;
}

export const POPULAR_BANKS: BankOption[] = [
  { id: 'jpmorgan', name: 'JPMorgan Chase Bank', code: 'CHASUS33', logoColor: '#005ea6' },
  { id: 'bofa', name: 'Bank of America', code: 'BOFAUS3N', logoColor: '#e31837' },
  { id: 'wells', name: 'Wells Fargo Bank', code: 'WFBIUS6S', logoColor: '#d71e28' },
  { id: 'citi', name: 'Citibank N.A.', code: 'CITIUS33', logoColor: '#003b70' },
  { id: 'capone', name: 'Capital One', code: 'NFBKUS33', logoColor: '#004879' },
  { id: 'usbank', name: 'U.S. Bank', code: 'USBKUS44', logoColor: '#0c2340' },
  { id: 'pnc', name: 'PNC Bank', code: 'PNCCUS33', logoColor: '#f47920' },
  { id: 'truist', name: 'Truist Bank', code: 'TRUIUS33', logoColor: '#240046' },
  { id: 'goldman', name: 'Goldman Sachs Bank', code: 'GSCOUS33', logoColor: '#7399c6' },
  { id: 'morgan', name: 'Morgan Stanley Private Bank', code: 'MSBIUS33', logoColor: '#1d252c' },
  { id: 'greendot_internal', name: 'Greendot Bank (Internal Transfer)', code: 'GRDTUS01', logoColor: '#1db954' },
];

export const SUPPORTED_BANKS = POPULAR_BANKS;
