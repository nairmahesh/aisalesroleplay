import { BaseEntity } from '../../../core/types';

export interface PracticeRoom extends BaseEntity {
  name: string;
  room_code: string;
  created_by: string | null;
  status: 'waiting' | 'active' | 'completed';
  participants_count: number;
  rep_name: string;
  rep_type?: 'employee' | 'external';
  rep_employee_id?: string;
  client_name: string;
  client_type?: 'employee' | 'external';
  client_employee_id?: string;
  client_company: string;
  client_designation: string;
  company_description: string;
  call_objective: string;
  call_cta: string;
  allow_external: boolean;
  external_invite_token: string | null;
}

export interface CreateRoomData {
  name: string;
  rep_name: string;
  rep_type: 'employee' | 'external';
  rep_employee_id?: string;
  client_name: string;
  client_type: 'employee' | 'external';
  client_employee_id?: string;
  client_company: string;
  client_designation: string;
  company_description: string;
  call_objective: string;
  call_cta: string;
  allow_external: boolean;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {}

export interface RoomFilters {
  status?: 'waiting' | 'active' | 'completed';
  search?: string;
  created_by?: string;
}
