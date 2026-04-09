<?php

namespace App\Http\Controllers\Api;

use App\Enums\LeaveStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Leave\ProcessLeaveRequest;
use App\Http\Requests\Leave\StoreLeaveRequest;
use App\Http\Resources\LeaveResource;
use App\Models\Leave;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Leave::with(['user', 'approvedBy'])
            ->when($user->isEmployee(), fn($q) => $q->where('user_id', $user->id))
            ->when($request->user_id && $user->isAdmin(), fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->date_from, fn($q) => $q->where('start_date', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->where('end_date', '<=', $request->date_to))
            ->latest();

        $leaves = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Data cuti berhasil diambil.',
            'data'    => LeaveResource::collection($leaves),
            'meta'    => [
                'current_page' => $leaves->currentPage(),
                'last_page'    => $leaves->lastPage(),
                'per_page'     => $leaves->perPage(),
                'total'        => $leaves->total(),
            ],
        ]);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $startDate  = Carbon::parse($data['start_date']);
        $endDate    = Carbon::parse($data['end_date']);
        $totalDays  = $startDate->diffInWeekdays($endDate) + 1;

        // For annual leave, check quota
        if ($data['type'] === 'annual' && $user->leave_quota < $totalDays) {
            return $this->errorResponse(
                "Jatah cuti tidak mencukupi. Sisa jatah: {$user->leave_quota} hari.",
                422
            );
        }

        // Check overlapping leaves
        $overlapping = Leave::where('user_id', $user->id)
            ->where('status', '!=', 'rejected')
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_date', [$data['start_date'], $data['end_date']])
                  ->orWhereBetween('end_date', [$data['start_date'], $data['end_date']]);
            })->exists();

        if ($overlapping) {
            return $this->errorResponse('Terdapat cuti yang tumpang tindih pada tanggal tersebut.', 422);
        }

        $leave = Leave::create([
            'user_id'    => $user->id,
            'type'       => $data['type'],
            'start_date' => $data['start_date'],
            'end_date'   => $data['end_date'],
            'total_days' => $totalDays,
            'reason'     => $data['reason'],
            'status'     => LeaveStatus::Pending,
        ]);

        return $this->createdResponse(new LeaveResource($leave->load('user')), 'Pengajuan cuti berhasil dikirim.');
    }

    public function show(Leave $leave): JsonResponse
    {
        $leave->load(['user', 'approvedBy']);

        return $this->successResponse(new LeaveResource($leave), 'Detail cuti berhasil diambil.');
    }

    public function approve(ProcessLeaveRequest $request, Leave $leave): JsonResponse
    {
        if ($leave->status !== LeaveStatus::Pending) {
            return $this->errorResponse('Cuti ini sudah diproses sebelumnya.', 422);
        }

        $leave->update([
            'status'       => LeaveStatus::Approved,
            'admin_notes'  => $request->admin_notes,
            'approved_by'  => $request->user()->id,
            'processed_at' => Carbon::now(),
        ]);

        // Deduct leave quota for annual leave
        if ($leave->type->value === 'annual') {
            $leave->user->decrement('leave_quota', $leave->total_days);
        }

        return $this->successResponse(new LeaveResource($leave->fresh()->load(['user', 'approvedBy'])), 'Cuti berhasil disetujui.');
    }

    public function reject(ProcessLeaveRequest $request, Leave $leave): JsonResponse
    {
        if ($leave->status !== LeaveStatus::Pending) {
            return $this->errorResponse('Cuti ini sudah diproses sebelumnya.', 422);
        }

        $leave->update([
            'status'       => LeaveStatus::Rejected,
            'admin_notes'  => $request->admin_notes,
            'approved_by'  => $request->user()->id,
            'processed_at' => Carbon::now(),
        ]);

        return $this->successResponse(new LeaveResource($leave->fresh()->load(['user', 'approvedBy'])), 'Cuti berhasil ditolak.');
    }
}
