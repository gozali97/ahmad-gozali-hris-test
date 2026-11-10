<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
Illuminate\Support\Facades\DB::transaction(function () {
    foreach (['Manager','Staff','Senior Staff','Supervisor','Director'] as $name) {
        App\Models\Position::firstOrCreate(['name'=>$name], ['status'=>'active']);
    }
    foreach (['HR'=>'Human Resources','IT'=>'Information Technology','FIN'=>'Finance','MKT'=>'Marketing','OPS'=>'Operations'] as $code=>$name) {
        App\Models\Department::firstOrCreate(['code'=>$code], ['name'=>$name,'status'=>'active']);
    }
    $user=App\Models\User::where('email','ahmadmulti10@gmail.com')->first();
    if ($user) {
        if (!$user->isAdmin()) throw new RuntimeException('Email admin sudah dipakai akun non-admin.');
        echo "Admin sudah ada; password dipertahankan.\n";
    } else {
        App\Models\User::create(['name'=>'Ahmad Gozali','email'=>'ahmadmulti10@gmail.com','password'=>trim(file_get_contents('/run/secrets/admin_password')),'role'=>'admin','status'=>'active','leave_quota'=>12]);
        echo "Admin HRIS dibuat.\n";
    }
});
