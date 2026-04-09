<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        $userRole = $request->user()->role->value;

        if (! in_array($userRole, $roles)) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak. Role tidak sesuai.'], 403);
        }

        return $next($request);
    }
}
