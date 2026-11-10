<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\PositionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'active'])->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    /*
    |------------------------------------------------------------------
    | Dashboard
    |------------------------------------------------------------------
    */
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/dashboard/employee', [DashboardController::class, 'employee'])->middleware('role:employee');

    /*
    |------------------------------------------------------------------
    | Admin Only Routes
    |------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {

        Route::get('/users/permissions', [\App\Http\Controllers\Api\UserController::class, 'permissions'])->middleware('permission:users.manage');
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class)->except(['destroy'])->middleware('permission:users.manage');

        // Employees
        Route::get('/employees/generate-nip', [EmployeeController::class, 'generateNip'])->middleware('permission:employees.manage');
        Route::apiResource('employees', EmployeeController::class);

        // Positions
        Route::get('/positions/all', [PositionController::class, 'all'])->middleware('permission:positions.manage');
        Route::apiResource('positions', PositionController::class);

        // Departments
        Route::get('/departments/all', [DepartmentController::class, 'all'])->middleware('permission:departments.manage');
        Route::apiResource('departments', DepartmentController::class);

        // Attendance admin actions
        Route::post('/attendances', [AttendanceController::class, 'store'])->middleware('permission:attendances.manage');
        Route::get('/attendances/recap', [AttendanceController::class, 'recap'])->middleware('permission:attendances.manage');

        // Leave approval
        Route::put('/leaves/{leave}/approve', [LeaveController::class, 'approve'])->middleware('permission:leaves.manage');
        Route::put('/leaves/{leave}/reject', [LeaveController::class, 'reject'])->middleware('permission:leaves.manage');
    });

    /*
    |------------------------------------------------------------------
    | Employee Routes
    |------------------------------------------------------------------
    */
    Route::middleware('role:employee')->group(function () {

        // Attendance
        Route::post('/attendances/check-in', [AttendanceController::class, 'checkIn'])->middleware('permission:attendances.manage');
        Route::put('/attendances/check-out', [AttendanceController::class, 'checkOut'])->middleware('permission:attendances.manage');

        // Leave submission
        Route::post('/leaves', [LeaveController::class, 'store'])->middleware('permission:leaves.manage');
    });

    /*
    |------------------------------------------------------------------
    | Shared Routes (both admin and employee)
    |------------------------------------------------------------------
    */
    Route::get('/attendances/today', [AttendanceController::class, 'todayStatus'])->middleware('permission:attendances.manage');
    Route::get('/attendances', [AttendanceController::class, 'index'])->middleware('permission:attendances.manage');
    Route::get('/leaves', [LeaveController::class, 'index'])->middleware('permission:leaves.manage');
    Route::get('/leaves/{leave}', [LeaveController::class, 'show'])->middleware('permission:leaves.manage');

    // Lookup data (for dropdowns — accessible by all)
    Route::get('/positions/all', [PositionController::class, 'all'])->middleware('permission:positions.manage');
    Route::get('/departments/all', [DepartmentController::class, 'all'])->middleware('permission:departments.manage');
});
