// Supabase table types — مشتقة من schema.sql
export type Tables = {
  user_profiles: UserProfileRow;
  projects: ProjectRow;
  deliverables: DeliverableRow;
  subscriptions: SubscriptionRow;
};

export interface UserProfileRow {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  user_type: string;
  industry: string;
  company_name: string | null;
  team_size: number | null;
  subscription_plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  industry: string;
  client_name: string | null;
  start_date: string;
  end_date: string;
  budget: number | null;
  currency: string;
  team_size: number;
  objectives: string[];
  constraints: string | null;
  assumptions: string | null;
  status: string;
  ai_agenda: object | null;
  user_notes: string | null;
  agenda_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliverableRow {
  id: string;
  project_id: string;
  type: string;
  format: string;
  status: string;
  file_url: string | null;
  file_size: number | null;
  generated_at: string | null;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}
