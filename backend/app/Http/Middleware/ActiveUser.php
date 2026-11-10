<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class ActiveUser
{
    public function handle(Request $request, Closure $next) {
        if ($request->user()?->status?->value !== 'active') {
            return response()->json(['success'=>false, 'message'=>'Akun tidak aktif. Hubungi admin HR.'], 403);
        }
        return $next($request);
    }
}
