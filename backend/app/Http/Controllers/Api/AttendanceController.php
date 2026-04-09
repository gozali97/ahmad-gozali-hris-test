<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Attendance::with('user')
            ->when($user->isEmployee(), fn($q) => $q->where('user_id', $user->id))
            ->when($request->user_id && $user->isAdmin(), fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->date_from, fn($q) => $q->where('date', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->where('date', '<=', $request->date_to))
            ->when($request->month, fn($q) => $q->whereMonth('date', $request->month))
            ->when($request->year, fn($q) => $q->whereYear('date', $request->year))
            ->latest('date');

        $attendances = $query->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'message' => 'Data absensi berhasil diambil.',
            'data'    => AttendanceResource::collection($attendances),
            'meta'    => [
                'current_page' => $attendances->currentPage(),
                'last_page'    => $attendances->lastPage(),
                'per_page'     => $attendances->perPage(),
                'total'        => $attendances->total(),
            ],
        ]);
    }

    public function checkIn(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $existing = Attendance::where('user_id', $user->id)->where('date', $today)->first();

        if ($existing) {
            return $this->errorResponse('Anda sudah melakukan check-in hari ini.', 422);
        }

        $attendance = Attendance::create([
            'user_id'  => $user->id,
            'date'     => $today,
            'check_in' => Carbon::now()->format('H:i:s'),
            'status'   => 'present',
        ]);

        return $this->createdResponse(new AttendanceResource($attendance), 'Check-in berhasil.');
    }

    public function checkOut(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)->where('date', $today)->first();

        if (! $attendance) {
            return $this->errorResponse('Anda belum melakukan check-in hari ini.', 422);
        }

        if ($attendance->check_out) {
            return $this->errorResponse('Anda sudah melakukan check-out hari ini.', 422);
        }

        $attendance->update(['check_out' => Carbon::now()->format('H:i:s')]);

        return $this->successResponse(new AttendanceResource($attendance), 'Check-out berhasil.');
    }

    public function todayStatus(Request $request): JsonResponse
    {
        $today = Carbon::today()->toDateString();
        $attendance = Attendance::where('user_id', $request->user()->id)
            ->where('date', $today)
            ->first();

        return $this->successResponse(
            $attendance ? new AttendanceResource($attendance) : null,
            'Status absensi hari ini.'
        );
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $data = $request->validated();

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $data['user_id'], 'date' => $data['date']],
            $data
        );

        return $this->createdResponse(new AttendanceResource($attendance->load('user')), 'Absensi berhasil disimpan.');
    }

    public function recap(Request $request): JsonResponse
    {
        $month = $request->month ?? Carbon::now()->month;
        $year  = $request->year ?? Carbon::now()->year;

        $employees = User::where('role', UserRole::Employee)
            ->where('status', 'active')
            ->with(['attendances' => fn($q) => $q->whereMonth('date', $month)->whereYear('date', $year)])
            ->get();

        $recap = $employees->map(fn($emp) => [
            'employee' => ['id' => $emp->id, 'nip' => $emp->nip, 'name' => $emp->name],
            'present'  => $emp->attendances->where('status', 'present')->count(),
            'sick'     => $emp->attendances->where('status', 'sick')->count(),
            'permit'   => $emp->attendances->where('status', 'permit')->count(),
            'absent'   => $emp->attendances->where('status', 'absent')->count(),
            'total'    => $emp->attendances->count(),
        ]);

        return $this->successResponse($recap, "Rekap absensi {$month}/{$year}.");
    }
}
