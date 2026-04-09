<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\LeaveResource;
use App\Models\Attendance;
use App\Models\Leave;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function admin(): JsonResponse
    {
        $today = Carbon::today()->toDateString();
        $month = Carbon::now()->month;
        $year  = Carbon::now()->year;

        $totalEmployees    = User::where('role', UserRole::Employee)->count();
        $activeEmployees   = User::where('role', UserRole::Employee)->where('status', 'active')->count();
        $inactiveEmployees = User::where('role', UserRole::Employee)->where('status', 'inactive')->count();

        $todayAttendance = Attendance::whereDate('date', $today)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $monthlyLeave = Leave::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentEmployees = User::where('role', UserRole::Employee)
            ->with(['position', 'department'])
            ->latest()
            ->take(5)
            ->get();

        $pendingLeaves = Leave::where('status', 'pending')
            ->with('user')
            ->latest()
            ->take(10)
            ->get();

        return $this->successResponse([
            'total_employees'     => $totalEmployees,
            'active_employees'    => $activeEmployees,
            'inactive_employees'  => $inactiveEmployees,
            'today_attendance'    => [
                'present' => $todayAttendance['present'] ?? 0,
                'sick'    => $todayAttendance['sick'] ?? 0,
                'permit'  => $todayAttendance['permit'] ?? 0,
                'absent'  => $todayAttendance['absent'] ?? 0,
            ],
            'monthly_leave'       => [
                'pending'  => $monthlyLeave['pending'] ?? 0,
                'approved' => $monthlyLeave['approved'] ?? 0,
                'rejected' => $monthlyLeave['rejected'] ?? 0,
            ],
            'recent_employees'    => EmployeeResource::collection($recentEmployees),
            'pending_leaves'      => LeaveResource::collection($pendingLeaves),
        ], 'Data dashboard admin berhasil diambil.');
    }

    public function employee(Request $request): JsonResponse
    {
        $user  = $request->user();
        $today = Carbon::today()->toDateString();
        $month = Carbon::now()->month;
        $year  = Carbon::now()->year;

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        $monthlyAttendanceCount = Attendance::where('user_id', $user->id)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->where('status', 'present')
            ->count();

        $latestLeave = Leave::where('user_id', $user->id)->latest()->first();

        return $this->successResponse([
            'today_attendance'       => $todayAttendance ? [
                'status'    => $todayAttendance->status->value,
                'check_in'  => $todayAttendance->check_in,
                'check_out' => $todayAttendance->check_out,
            ] : null,
            'monthly_attendance_count' => $monthlyAttendanceCount,
            'leave_quota_remaining'    => $user->leave_quota,
            'latest_leave'             => $latestLeave ? [
                'id'         => $latestLeave->id,
                'type'       => $latestLeave->type->value,
                'type_label' => $latestLeave->type->label(),
                'status'     => $latestLeave->status->value,
                'status_label' => $latestLeave->status->label(),
                'start_date' => $latestLeave->start_date->format('Y-m-d'),
                'end_date'   => $latestLeave->end_date->format('Y-m-d'),
            ] : null,
        ], 'Data dashboard karyawan berhasil diambil.');
    }
}
