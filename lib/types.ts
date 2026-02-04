export interface UserCustomizations {
  favorites: string[];
  customPhrases: Array<{
    text: string;
    category: string;
  }>;
  customCategoryIcons: Record<string, string>;
  customCategoryNames: Record<string, { zh: string; en: string }>;
}

export interface User {
  id: string | number;
  email?: string;
  password?: string;
  loginCode?: string;
  userEmail?: string;
  role: 'admin' | 'user';
  trialType: '14days' | '30days' | 'unlimited' | 'notrial';
  trialStartDate?: string;
  lastLoginAt?: string;
  createdAt: string;
  customizations?: UserCustomizations;
}

export interface CreateUserInput {
  email?: string;
  password?: string;
  loginCode?: string;
  userEmail?: string;
  role: 'admin' | 'user';
  trialType?: '14days' | '30days' | 'unlimited';
  trialStartDate?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  userEmail?: string;
  role?: 'admin' | 'user';
  trialType?: '14days' | '30days' | 'unlimited';
  trialStartDate?: string;
  lastLoginAt?: string;
  customizations?: Partial<UserCustomizations>;
}
