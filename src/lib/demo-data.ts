
import { supabase } from '@/integrations/supabase/client';

export const createDemoData = async () => {
  try {
    console.log('Creating demo data...');

    // First, insert vendors (no foreign key dependencies)
    const { data: vendorsData, error: vendorsError } = await supabase
      .from('vendors')
      .upsert([
        {
          name: 'ABC Construction Ltd',
          email: 'contact@abcconstruction.com',
          phone: '+91-9876543210',
          gst_number: '07ABCCS1234F1Z5',
          pan_number: 'ABCCS1234F',
          address_line1: '123 Industrial Area',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          bank_name: 'HDFC Bank',
          account_number: '12345678901234',
          ifsc_code: 'HDFC0001234',
          is_active: true
        },
        {
          name: 'XYZ Materials Pvt Ltd',
          email: 'sales@xyzmaterials.com',
          phone: '+91-9876543211',
          gst_number: '27XYZMT5678G2Y6',
          pan_number: 'XYZMT5678G',
          address_line1: '456 Trade Center',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          bank_name: 'ICICI Bank',
          account_number: '56789012345678',
          ifsc_code: 'ICIC0005678',
          is_active: true
        },
        {
          name: 'PQR Engineering Services',
          email: 'info@pqreng.com',
          phone: '+91-9876543212',
          gst_number: '19PQRES9012H3X7',
          pan_number: 'PQRES9012H',
          address_line1: '789 Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          bank_name: 'SBI Bank',
          account_number: '90123456789012',
          ifsc_code: 'SBIN0009012',
          is_active: true
        }
      ], { onConflict: 'name' })
      .select();

    if (vendorsError) {
      console.error('Error creating vendors:', vendorsError);
    } else {
      console.log('Vendors created:', vendorsData);
    }

    // Create projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('billing_projects')
      .upsert([
        {
          name: 'Village Water Pipeline Project',
          description: 'Installation of water pipeline infrastructure for rural village',
          total_cost: 500000.00,
          project_owner: 'PHED',
          status: 'active',
          departments: ['phed'],
          start_date: '2024-01-01',
          expected_end_date: '2024-08-31',
          total_received: 350000.00,
          total_pending: 150000.00,
          overall_progress: 65,
          project_manager: 'Mike Project Manager',
          project_team: ['Mike Project Manager', 'PHED Team']
        },
        {
          name: 'District Road Construction',
          description: 'Construction of new district road connecting villages',
          total_cost: 750000.00,
          project_owner: 'PWD',
          status: 'active',
          departments: ['pwd'],
          start_date: '2024-01-15',
          expected_end_date: '2024-09-30',
          total_received: 450000.00,
          total_pending: 300000.00,
          overall_progress: 45,
          project_manager: 'Emma PWD Manager',
          project_team: ['Emma PWD Manager', 'PWD Team']
        }
      ], { onConflict: 'name' })
      .select();

    if (projectsError) {
      console.error('Error creating projects:', projectsError);
    } else {
      console.log('Projects created:', projectsData);
    }

    return true;
  } catch (error) {
    console.error('Error creating demo data:', error);
    return false;
  }
};
