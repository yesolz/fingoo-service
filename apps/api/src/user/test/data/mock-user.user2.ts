import { User } from '@supabase/supabase-js';

export const mockUser2: User = {
  id: '22222222-2222-2222-2222-222222222222',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'example2@email.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  phone: '',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: { username: 'newUser' },
  identities: [
    {
      identity_id: '33333333-3333-3333-3333-333333333333',
      id: '22222222-2222-2222-2222-222222222222',
      user_id: '22222222-2222-2222-2222-222222222222',
      identity_data: {
        email: 'example@email.com',
        email_verified: false,
        phone_verified: false,
        sub: '22222222-2222-2222-2222-222222222222',
      },
      provider: 'email',
      last_sign_in_at: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockSession2 = {
  access_token: '<NEW_ACCESS_TOKEN>',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1700000000,
  refresh_token: '<NEW_REFRESH_TOKEN>',
  user: {
    id: '22222222-2222-2222-2222-222222222222',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'example2@email.com',
    email_confirmed_at: '2024-01-01T00:00:00Z',
    phone: '',
    last_sign_in_at: '2024-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      providers: ['email'],
    },
    user_metadata: {},
    identities: [
      {
        identity_id: '33333333-3333-3333-3333-333333333333',
        id: '22222222-2222-2222-2222-222222222222',
        user_id: '22222222-2222-2222-2222-222222222222',
        identity_data: {
          email: 'example2@email.com',
          email_verified: false,
          phone_verified: false,
          sub: '22222222-2222-2222-2222-222222222222',
        },
        provider: 'email',
        last_sign_in_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        email: 'example@email.com',
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};
