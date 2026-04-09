<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nip')->unique()->nullable()->after('id');
            $table->string('phone', 20)->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->date('birth_date')->nullable()->after('address');
            $table->enum('gender', ['male', 'female'])->nullable()->after('birth_date');
            $table->foreignId('position_id')->nullable()->constrained('positions')->nullOnDelete()->after('gender');
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete()->after('position_id');
            $table->date('join_date')->nullable()->after('department_id');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('join_date');
            $table->string('photo')->nullable()->after('status');
            $table->integer('leave_quota')->default(12)->after('photo');
            $table->enum('role', ['admin', 'employee'])->default('employee')->after('leave_quota');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['position_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn([
                'nip', 'phone', 'address', 'birth_date', 'gender',
                'position_id', 'department_id', 'join_date', 'status',
                'photo', 'leave_quota', 'role',
            ]);
        });
    }
};
