// Supabase has been removed. This is a no-op stub so existing
// `supabase.removeChannel(...)` calls in Dashboard and Leads do not crash
// while those files are being migrated.
export const supabase = {
  removeChannel: () => {},
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
};

export default supabase;
