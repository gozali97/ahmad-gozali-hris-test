<?php

namespace Database\Seeders;

use App\Enums\Gender;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Leave;
use App\Models\Position;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Positions
        $positions = [
            ['name' => 'Manager', 'description' => 'Manajer departemen'],
            ['name' => 'Staff', 'description' => 'Staf reguler'],
            ['name' => 'Senior Staff', 'description' => 'Staf senior'],
            ['name' => 'Supervisor', 'description' => 'Supervisor tim'],
            ['name' => 'Director', 'description' => 'Direktur'],
        ];
        foreach ($positions as $p) {
            Position::create(array_merge($p, ['status' => 'active']));
        }

        // Departments
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR', 'description' => 'Departemen SDM'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'Departemen Teknologi Informasi'],
            ['name' => 'Finance', 'code' => 'FIN', 'description' => 'Departemen Keuangan'],
            ['name' => 'Marketing', 'code' => 'MKT', 'description' => 'Departemen Pemasaran'],
            ['name' => 'Operations', 'code' => 'OPS', 'description' => 'Departemen Operasional'],
        ];
        foreach ($departments as $d) {
            Department::create(array_merge($d, ['status' => 'active']));
        }

        // Admin HR
        $admin = User::create([
            'nip'          => 'ADM0001',
            'name'         => 'Admin HR',
            'email'        => 'admin@hrsystem.com',
            'password'     => Hash::make('password'),
            'phone'        => '081234567890',
            'address'      => 'Jl. Admin No. 1, Jakarta',
            'birth_date'   => '1990-01-15',
            'gender'       => Gender::Male,
            'position_id'  => 1, // Manager
            'department_id' => 1, // HR
            'join_date'    => '2020-01-01',
            'status'       => UserStatus::Active,
            'leave_quota'  => 12,
            'role'         => UserRole::Admin,
        ]);

        // Employees
        $employeeData = [
            ['name' => 'Budi Santoso', 'email' => 'budi@hrsystem.com', 'gender' => Gender::Male, 'position_id' => 2, 'department_id' => 2],
            ['name' => 'Siti Rahayu', 'email' => 'siti@hrsystem.com', 'gender' => Gender::Female, 'position_id' => 3, 'department_id' => 2],
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad@hrsystem.com', 'gender' => Gender::Male, 'position_id' => 4, 'department_id' => 3],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@hrsystem.com', 'gender' => Gender::Female, 'position_id' => 2, 'department_id' => 4],
            ['name' => 'Rizki Pratama', 'email' => 'rizki@hrsystem.com', 'gender' => Gender::Male, 'position_id' => 3, 'department_id' => 5],
            ['name' => 'Ani Wijayanti', 'email' => 'ani@hrsystem.com', 'gender' => Gender::Female, 'position_id' => 2, 'department_id' => 3],
            ['name' => 'Eko Purnomo', 'email' => 'eko@hrsystem.com', 'gender' => Gender::Male, 'position_id' => 3, 'department_id' => 1],
            ['name' => 'Rina Susanti', 'email' => 'rina@hrsystem.com', 'gender' => Gender::Female, 'position_id' => 2, 'department_id' => 4],
            ['name' => 'Hendra Kurnia', 'email' => 'hendra@hrsystem.com', 'gender' => Gender::Male, 'position_id' => 4, 'department_id' => 5],
            ['name' => 'Maya Indah', 'email' => 'maya@hrsystem.com', 'gender' => Gender::Female, 'position_id' => 3, 'department_id' => 2],
        ];

        $employees = [];
        foreach ($employeeData as $i => $data) {
            $employees[] = User::create(array_merge($data, [
                'nip'          => 'EMP' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'password'     => Hash::make('password'),
                'phone'        => '0812345678' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'address'      => 'Jl. Karyawan No. ' . ($i + 1) . ', Jakarta',
                'birth_date'   => Carbon::now()->subYears(rand(25, 45))->subDays(rand(0, 365)),
                'join_date'    => Carbon::now()->subMonths(rand(6, 36)),
                'status'       => UserStatus::Active,
                'leave_quota'  => 12,
                'role'         => UserRole::Employee,
            ]));
        }

        // Attendance for last 7 days
        $statuses = ['present', 'present', 'present', 'present', 'sick', 'permit'];
        foreach ($employees as $emp) {
            for ($day = 6; $day >= 0; $day--) {
                $date = Carbon::now()->subDays($day)->toDateString();
                $dayOfWeek = Carbon::parse($date)->dayOfWeek;
                if ($dayOfWeek === 0 || $dayOfWeek === 6) continue; // skip weekend

                $status = $statuses[array_rand($statuses)];
                Attendance::create([
                    'user_id'   => $emp->id,
                    'date'      => $date,
                    'check_in'  => $status === 'present' ? '08:' . rand(00, 30) . ':00' : null,
                    'check_out' => $status === 'present' ? '17:' . rand(00, 30) . ':00' : null,
                    'status'    => $status,
                    'notes'     => null,
                ]);
            }
        }

        // Leave requests
        Leave::create([
            'user_id'    => $employees[0]->id,
            'type'       => 'annual',
            'start_date' => Carbon::now()->addDays(3),
            'end_date'   => Carbon::now()->addDays(5),
            'total_days' => 3,
            'reason'     => 'Liburan keluarga',
            'status'     => 'pending',
        ]);

        Leave::create([
            'user_id'      => $employees[1]->id,
            'type'         => 'sick',
            'start_date'   => Carbon::now()->subDays(5),
            'end_date'     => Carbon::now()->subDays(3),
            'total_days'   => 3,
            'reason'       => 'Sakit demam',
            'status'       => 'approved',
            'approved_by'  => $admin->id,
            'processed_at' => Carbon::now()->subDays(5),
        ]);

        Leave::create([
            'user_id'      => $employees[2]->id,
            'type'         => 'annual',
            'start_date'   => Carbon::now()->subDays(10),
            'end_date'     => Carbon::now()->subDays(8),
            'total_days'   => 3,
            'reason'       => 'Urusan pribadi',
            'status'       => 'rejected',
            'admin_notes'  => 'Tidak sesuai jadwal tim',
            'approved_by'  => $admin->id,
            'processed_at' => Carbon::now()->subDays(10),
        ]);

        // Kurangi leave_quota yang sudah approved
        $employees[1]->decrement('leave_quota', 3);
    }
}
