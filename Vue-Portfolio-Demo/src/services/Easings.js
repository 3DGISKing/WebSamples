import { CustomEase } from '@/services/CustomEase';

export const ease = CustomEase.create(
  'custom',
  'M0,0 C0.66,0.096 -0.032,1 1,1'
);
export const ease2 = CustomEase.create('custom', 'M0,0 C0.902,0 0.096,1 1,1');
export const ease3 = CustomEase.create(
  'custom',
  'M0,0 C0.54,0.162 -0.106,0.832 1,1'
);
