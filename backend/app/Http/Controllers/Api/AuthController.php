<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\EmployeeResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return $this->errorResponse('Email atau password salah.', 401);
        }

        $user = Auth::user();

        if ($user->status->value === 'inactive') {
            Auth::logout();
            return $this->errorResponse('Akun Anda tidak aktif. Hubungi Admin HR.', 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user'  => new EmployeeResource($user->load(['position', 'department'])),
        ], 'Login berhasil.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout berhasil.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['position', 'department']);

        return $this->successResponse(new EmployeeResource($user), 'Data user berhasil diambil.');
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password'      => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Password saat ini tidak sesuai.', 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        // Revoke other sessions, keep current token active
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return $this->successResponse(null, 'Password berhasil diubah.');
    }
}
