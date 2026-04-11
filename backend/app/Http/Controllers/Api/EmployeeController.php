<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $employees = User::with(['position', 'department'])
            ->where('role', UserRole::Employee)
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('nip', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            }))
            ->when($request->department_id, fn($q) => $q->where('department_id', $request->department_id))
            ->when($request->position_id, fn($q) => $q->where('position_id', $request->position_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Data karyawan berhasil diambil.',
            'data'    => EmployeeResource::collection($employees),
            'meta'    => [
                'current_page' => $employees->currentPage(),
                'last_page'    => $employees->lastPage(),
                'per_page'     => $employees->perPage(),
                'total'        => $employees->total(),
            ],
        ]);
    }

    public function generateNip(): JsonResponse
    {
        $lastEmployee = User::where('role', UserRole::Employee)
            ->whereNotNull('nip')
            ->orderBy('id', 'desc')
            ->first();

        if (! $lastEmployee) {
            $nextNip = 'EMP0001';
        } else {
            // Extract numeric part from last NIP (e.g., EMP0012 -> 0012)
            $lastNumber = (int) substr($lastEmployee->nip, 3);
            $nextNumber = $lastNumber + 1;
            $nextNip = 'EMP' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        }

        return $this->successResponse(['nip' => $nextNip], 'NIP berhasil digenerate.');
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['role'] = UserRole::Employee;
        $data['password'] = Hash::make($data['password']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $employee = User::create($data);
        $employee->load(['position', 'department']);

        return $this->createdResponse(new EmployeeResource($employee), 'Karyawan berhasil ditambahkan.');
    }

    public function show(User $employee): JsonResponse
    {
        $employee->load(['position', 'department']);

        return $this->successResponse(new EmployeeResource($employee), 'Detail karyawan berhasil diambil.');
    }

    public function update(UpdateEmployeeRequest $request, User $employee): JsonResponse
    {
        $data = $request->validated();

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('photo')) {
            if ($employee->photo) {
                Storage::disk('public')->delete($employee->photo);
            }
            $data['photo'] = $request->file('photo')->store('photos', 'public');
        }

        $employee->update($data);
        $employee->load(['position', 'department']);

        return $this->successResponse(new EmployeeResource($employee), 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(User $employee): JsonResponse
    {
        if ($employee->photo) {
            Storage::disk('public')->delete($employee->photo);
        }

        $employee->delete();

        return $this->successResponse(null, 'Karyawan berhasil dihapus.');
    }
}
