import { User } from '@supabase/supabase-js';

export const mockUserIntegration: User = {
  id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'newExample@email.com',
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
      identity_id: '22222222-2222-2222-2222-222222222222',
      id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
      user_id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
      identity_data: {
        email: 'example@email.com',
        email_verified: false,
        phone_verified: false,
        sub: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
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

export const mockSessionIntegration = {
  access_token: '<ACCESS_TOKEN>',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1700000000,
  refresh_token: '<REFRESH_TOKEN>',
  user: {
    id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'example@email.com',
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
        identity_id: '22222222-2222-2222-2222-222222222222',
        id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
        user_id: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
        identity_data: {
          email: 'example@email.com',
          email_verified: false,
          phone_verified: false,
          sub: '9e078975-2d15-40fa-a3c9-fb7e515ea2e8',
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
