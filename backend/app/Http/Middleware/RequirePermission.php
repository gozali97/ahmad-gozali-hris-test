<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class RequirePermission
{
    public function handle(Request $request, Closure $next, string $permission) {
        // Employee routes remain governed by role and record ownership.
        if ($request->user()->isAdmin() && !$request->user()->hasPermission($permission)) {
            return response()->json(['success'=>false, 'message'=>'Anda tidak memiliki permission untuk modul ini.'], 403);
        }
        return $next($request);
    }
}
