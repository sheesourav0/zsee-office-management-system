export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_projects: {
        Row: {
          actual_duration: number | null
          baseline_duration: number | null
          created_at: string | null
          departments: string[] | null
          description: string | null
          expected_end_date: string | null
          id: string
          name: string
          overall_progress: number | null
          project_manager: string | null
          project_owner: string
          project_owner_details: string | null
          project_team: string[] | null
          start_date: string | null
          status: string
          total_cost: number
          total_pending: number | null
          total_received: number | null
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          baseline_duration?: number | null
          created_at?: string | null
          departments?: string[] | null
          description?: string | null
          expected_end_date?: string | null
          id?: string
          name: string
          overall_progress?: number | null
          project_manager?: string | null
          project_owner: string
          project_owner_details?: string | null
          project_team?: string[] | null
          start_date?: string | null
          status?: string
          total_cost?: number
          total_pending?: number | null
          total_received?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          baseline_duration?: number | null
          created_at?: string | null
          departments?: string[] | null
          description?: string | null
          expected_end_date?: string | null
          id?: string
          name?: string
          overall_progress?: number | null
          project_manager?: string | null
          project_owner?: string
          project_owner_details?: string | null
          project_team?: string[] | null
          start_date?: string | null
          status?: string
          total_cost?: number
          total_pending?: number | null
          total_received?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          created_by: string
          department_id: string | null
          description: string | null
          expense_date: string
          id: string
          receipt_url: string | null
          status: string | null
          subcategory: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          created_by: string
          department_id?: string | null
          description?: string | null
          expense_date: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          department_id?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_terms: {
        Row: {
          created_at: string | null
          description: string
          id: string
          milestone: string
          percentage: number
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          milestone: string
          percentage: number
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          milestone?: string
          percentage?: number
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_terms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "billing_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          name: string
          permissions: string[]
          updated_at: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id: string
          name: string
          permissions?: string[]
          updated_at?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: string[]
          updated_at?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string
          id: string
          is_active: boolean | null
          join_date: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email: string
          id: string
          is_active?: boolean | null
          join_date?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          join_date?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          actual_date: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          id: string
          is_payment_milestone: boolean | null
          name: string
          payment_term_id: string | null
          project_id: string | null
          status: string | null
          target_date: string
        }
        Insert: {
          actual_date?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_payment_milestone?: boolean | null
          name: string
          payment_term_id?: string | null
          project_id?: string | null
          status?: string | null
          target_date: string
        }
        Update: {
          actual_date?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_payment_milestone?: boolean | null
          name?: string
          payment_term_id?: string | null
          project_id?: string | null
          status?: string | null
          target_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_payment_term_id_fkey"
            columns: ["payment_term_id"]
            isOneToOne: false
            referencedRelation: "payment_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "billing_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          project_id: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_method: string
          project_id?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          project_id?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "billing_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          department: string
          email: string
          id: string
          is_active: boolean | null
          join_date: string | null
          name: string
          role: string
          team_lead_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          id?: string
          is_active?: boolean | null
          join_date?: string | null
          name: string
          role: string
          team_lead_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          id?: string
          is_active?: boolean | null
          join_date?: string | null
          name?: string
          role?: string
          team_lead_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_lead_id_fkey"
            columns: ["team_lead_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_policy_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          department_id: string | null
          id: string
          policy_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_policy_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_policy_assignments_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          account_number: string | null
          address_line1: string | null
          address_line2: string | null
          bank_name: string | null
          branch_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          ifsc_code: string | null
          is_active: boolean | null
          name: string
          pan_number: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name?: string | null
          branch_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          is_active?: boolean | null
          name: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name?: string | null
          branch_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          is_active?: boolean | null
          name?: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      work_plan_comments: {
        Row: {
          author_id: string | null
          author_name: string
          author_role: string
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          type: string | null
          work_plan_id: string | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          author_role: string
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          type?: string | null
          work_plan_id?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_role?: string
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          type?: string | null
          work_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_plan_comments_work_plan_id_fkey"
            columns: ["work_plan_id"]
            isOneToOne: false
            referencedRelation: "work_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      work_plan_steps: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string | null
          department_id: string | null
          department_name: string
          dependencies: string[] | null
          duration: number
          end_date: string
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: string | null
          progress: number | null
          project_id: string | null
          start_date: string
          status: string | null
          target_date: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: string | null
          department_name: string
          dependencies?: string[] | null
          duration?: number
          end_date: string
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          start_date: string
          status?: string | null
          target_date: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: string | null
          department_name?: string
          dependencies?: string[] | null
          duration?: number
          end_date?: string
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          start_date?: string
          status?: string | null
          target_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_plan_steps_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_plan_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "billing_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      work_plans: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          location: string | null
          member_id: string | null
          period: string | null
          priority: string | null
          progress: number | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          member_id?: string | null
          period?: string | null
          priority?: string | null
          progress?: number | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          member_id?: string | null
          period?: string | null
          priority?: string | null
          progress?: number | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
