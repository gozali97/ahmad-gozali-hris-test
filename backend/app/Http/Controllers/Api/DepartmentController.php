<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $departments = Department::withCount('employees')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('code', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Data departemen berhasil diambil.',
            'data'    => DepartmentResource::collection($departments),
            'meta'    => [
                'current_page' => $departments->currentPage(),
                'last_page'    => $departments->lastPage(),
                'per_page'     => $departments->perPage(),
                'total'        => $departments->total(),
            ],
        ]);
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = Department::create($request->validated());

        return $this->createdResponse(new DepartmentResource($department), 'Departemen berhasil ditambahkan.');
    }

    public function show(Department $department): JsonResponse
    {
        $department->loadCount('employees');

        return $this->successResponse(new DepartmentResource($department), 'Detail departemen berhasil diambil.');
    }

    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $department->update($request->validated());

        return $this->successResponse(new DepartmentResource($department), 'Departemen berhasil diperbarui.');
    }

    public function destroy(Department $department): JsonResponse
    {
        if ($department->employees()->exists()) {
            return $this->errorResponse('Departemen tidak dapat dihapus karena masih memiliki karyawan.', 422);
        }

        $department->delete();

        return $this->successResponse(null, 'Departemen berhasil dihapus.');
    }

    public function all(): JsonResponse
    {
        $departments = Department::where('status', 'active')->select('id', 'name', 'code')->get();

        return $this->successResponse($departments, 'Semua departemen aktif.');
    }
}
