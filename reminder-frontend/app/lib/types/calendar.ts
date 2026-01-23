export type Appt = { id: number; title: string; start_at: string; end_at: string | null, all_day? : boolean};
export type LoaderData = { appointments: Appt[] };