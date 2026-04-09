<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Position\StorePositionRequest;
use App\Http\Requests\Position\UpdatePositionRequest;
use App\Http\Resources\PositionResource;
use App\Models\Position;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $positions = Position::withCount('employees')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Data jabatan berhasil diambil.',
            'data'    => PositionResource::collection($positions),
            'meta'    => [
                'current_page' => $positions->currentPage(),
                'last_page'    => $positions->lastPage(),
                'per_page'     => $positions->perPage(),
                'total'        => $positions->total(),
            ],
        ]);
    }

    public function store(StorePositionRequest $request): JsonResponse
    {
        $position = Position::create($request->validated());

        return $this->createdResponse(new PositionResource($position), 'Jabatan berhasil ditambahkan.');
    }

    public function show(Position $position): JsonResponse
    {
        $position->loadCount('employees');

        return $this->successResponse(new PositionResource($position), 'Detail jabatan berhasil diambil.');
    }

    public function update(UpdatePositionRequest $request, Position $position): JsonResponse
    {
        $position->update($request->validated());

        return $this->successResponse(new PositionResource($position), 'Jabatan berhasil diperbarui.');
    }

    public function destroy(Position $position): JsonResponse
    {
        if ($position->employees()->exists()) {
            return $this->errorResponse('Jabatan tidak dapat dihapus karena masih memiliki karyawan.', 422);
        }

        $position->delete();

        return $this->successResponse(null, 'Jabatan berhasil dihapus.');
    }

    public function all(): JsonResponse
    {
        $positions = Position::where('status', 'active')->select('id', 'name')->get();

        return $this->successResponse($positions, 'Semua jabatan aktif.');
    }
}
