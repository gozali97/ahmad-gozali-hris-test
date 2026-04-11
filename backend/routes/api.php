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

Route::middleware('auth:sanctum')->group(function () {

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

        // Employees
        Route::get('/employees/generate-nip', [EmployeeController::class, 'generateNip']);
        Route::apiResource('employees', EmployeeController::class);

        // Positions
        Route::get('/positions/all', [PositionController::class, 'all']);
        Route::apiResource('positions', PositionController::class);

        // Departments
        Route::get('/departments/all', [DepartmentController::class, 'all']);
        Route::apiResource('departments', DepartmentController::class);

        // Attendance admin actions
        Route::post('/attendances', [AttendanceController::class, 'store']);
        Route::get('/attendances/recap', [AttendanceController::class, 'recap']);

        // Leave approval
        Route::put('/leaves/{leave}/approve', [LeaveController::class, 'approve']);
        Route::put('/leaves/{leave}/reject', [LeaveController::class, 'reject']);
    });

    /*
    |------------------------------------------------------------------
    | Employee Routes
    |------------------------------------------------------------------
    */
    Route::middleware('role:employee')->group(function () {

        // Attendance
        Route::post('/attendances/check-in', [AttendanceController::class, 'checkIn']);
        Route::put('/attendances/check-out', [AttendanceController::class, 'checkOut']);

        // Leave submission
        Route::post('/leaves', [LeaveController::class, 'store']);
    });

    /*
    |------------------------------------------------------------------
    | Shared Routes (both admin and employee)
    |------------------------------------------------------------------
    */
    Route::get('/attendances/today', [AttendanceController::class, 'todayStatus']);
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::get('/leaves/{leave}', [LeaveController::class, 'show']);

    // Lookup data (for dropdowns — accessible by all)
    Route::get('/positions/all', [PositionController::class, 'all']);
    Route::get('/departments/all', [DepartmentController::class, 'all']);
});
